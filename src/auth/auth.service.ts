// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Customer } from '../Models/customer.model';
import { Account, AccountRole } from '../Models/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Génère un JSON Web Token (JWT) pour l'utilisateur donné.
   * @param payload Informations à inclure dans le token.
   * @returns Le token JWT généré.
   */
  private async signToken(payload: { username: string; sub: string; role: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /**
   * Génère un nouvel ID client au format "CUSXXXX" (ex: "CUS0001").
   * Trouve le plus grand ID numérique existant et l'incrémente.
   * @returns Le nouvel ID client généré.
   */
  private async generateNewCustomerId(): Promise<string> {
    // Récupère tous les customerId existants pour trouver le maximum.
    // Cette approche est simple mais peut être coûteuse pour un très grand nombre d'enregistrements.
    const customers = await this.customerRepository.find({
      select: ['customerId'], // Sélectionne uniquement la colonne customerId pour optimiser la requête
    });

    let maxNum = 0;
    for (const customer of customers) {
      // Vérifie si l'ID commence par "CUS" et tente de parser la partie numérique.
      if (customer.customerId.startsWith('CUS')) {
        const numPart = parseInt(customer.customerId.substring(3), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }

    const nextIdNum = maxNum + 1;
    // Formate le nombre avec des zéros en tête pour atteindre 4 chiffres minimum (ex: 1 -> "0001").
    // Si le nombre dépasse 9999, le padding s'ajustera automatiquement (ex: 10000 -> "10000").
    const paddedId = String(nextIdNum).padStart(4, '0');
    return `CUS${paddedId}`;
  }


  /**
   * Enregistre un nouvel utilisateur (client Student/Teacher) et crée un compte associé.
   * @param registerUserDto Les données d'enregistrement de l'utilisateur.
   * @returns Un message de succès.
   */
  async register(registerUserDto: RegisterUserDto): Promise<{ message: string }> {
    const { email, username, mdpasse, ...customerDetails } = registerUserDto;

    // 1. Vérifier si l'email existe déjà dans Customers
    const existingCustomerByEmail = await this.customerRepository.findOne({ where: { email } });
    if (existingCustomerByEmail) {
      throw new ConflictException('Email déjà utilisé.');
    }

    // 2. Vérifier si le nom d'utilisateur existe déjà dans Accounts
    const existingAccountByUsername = await this.accountRepository.findOne({ where: { username } });
    if (existingAccountByUsername) {
      throw new ConflictException('Nom d\'utilisateur déjà utilisé.');
    }

    // 3. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(mdpasse, 10); // Le second argument est le saltRounds

    try {
      // 4. Générer un nouvel ID client et créer/sauvegarder le nouveau Customer
      const newCustomerId = await this.generateNewCustomerId(); // Appel de la nouvelle fonction
      const newCustomer = this.customerRepository.create({
        ...customerDetails,
        customerId: newCustomerId, // Utilisation de l'ID généré
      });
      const savedCustomer = await this.customerRepository.save(newCustomer);

      // 5. Créer et sauvegarder le nouveau Account lié au Customer
      const newAccount = this.accountRepository.create({
        username,
        mdpasse: hashedPassword,
        customer: savedCustomer.customerId, // Lier le compte au customerId du Customer
        role: registerUserDto.role || AccountRole.STUDENT, // Par défaut 'Student'
      });
      await this.accountRepository.save(newAccount);

      return { message: 'Utilisateur enregistré avec succès.' };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
      throw new InternalServerErrorException('Erreur lors de l\'enregistrement de l\'utilisateur.');
    }
  }

  /**
   * Connecte un utilisateur (client Student/Teacher ou Admin/Manager) et retourne un JWT.
   * @param loginUserDto Les identifiants de connexion.
   * @returns Un objet contenant l'accessToken.
   */
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { username, mdpasse } = loginUserDto;

    // Tenter de trouver l'utilisateur dans la table 'accounts' (pour Student/Teacher)
    const account = await this.accountRepository.findOne({ where: { username } });
    if (account) {
      const isPasswordValid = await bcrypt.compare(mdpasse, account.mdpasse);
      if (isPasswordValid) {
        // Le `sub` du payload JWT devrait être l'identifiant unique de l'utilisateur
        const payload = { username: account.username, sub: account.customer, role: account.role };
        return { accessToken: await this.signToken(payload) };
      }
    }

    // Tenter de trouver l'utilisateur dans la table 'users' (pour Administrator/Manager)
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      const isPasswordValid = await bcrypt.compare(mdpasse, user.password);
      if (isPasswordValid) {
        // Le `sub` du payload JWT devrait être l'identifiant unique de l'utilisateur
        const payload = { username: user.username, sub: user.userId.toString(), role: user.statut };
        return { accessToken: await this.signToken(payload) };
      }
    }

    throw new UnauthorizedException('Nom d\'utilisateur ou mot de passe invalide.');
  }

  /**
   * Valide les identifiants d'un utilisateur pour Passport (utilisé par la stratégie Local).
   * @param username Nom d'utilisateur.
   * @param pass Mot de passe brut.
   * @returns L'objet utilisateur sans mot de passe, ou null si invalide.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { username } });
    if (account && (await bcrypt.compare(pass, account.mdpasse))) {
      const { mdpasse, ...result } = account;
      return result;
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
