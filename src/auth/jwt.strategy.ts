import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Models/user.model'; 
import { Account } from '../Models/account.model';

// Définir l'interface pour le payload de votre JWT (ce qui est encodé dans le token)
export interface JwtPayload {
  username: string;
  sub: string; // userId ou customerId
  role: string; // Administrator, Manager, Student, Teacher
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrait le token de l'en-tête Authorization: Bearer <token>
      ignoreExpiration: false, // Ne pas ignorer l'expiration du token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'superSecretKey', // Doit correspondre à la clé secrète utilisée pour signer le token
    });
  }

  // Cette méthode est appelée après l'extraction et la vérification réussie du JWT
  // Le 'payload' est l'objet décodé du JWT
  async validate(payload: JwtPayload): Promise<any> {
    const { sub: id, role } = payload;

    // Chercher l'utilisateur en fonction de son rôle et de son ID
    if (role === 'Administrator' || role === 'Manager') {
      const user = await this.userRepository.findOne({ where: { userId: parseInt(id, 10) } });
      if (!user) {
        throw new UnauthorizedException('Utilisateur (Admin/Manager) non trouvé.');
      }
      // Retourne l'utilisateur. Cet objet sera attaché à 'req.user'
      return user;
    } else if (role === 'Student' || role === 'Teacher') {
      const account = await this.accountRepository.findOne({ where: { customer: id } });
      if (!account) {
        throw new UnauthorizedException('Compte (Student/Teacher) non trouvé.');
      }
      // Pour les comptes, vous pourriez vouloir attacher l'entité Customer aussi
      const customer = await this.accountRepository.findOne({
        where: { customer: id },
        relations: ['customerEntity'], // Charger la relation pour obtenir l'objet Customer
      });
      // Retourne les informations du compte et du client. Cet objet sera attaché à 'req.user'
      return customer ? { ...account, customerInfo: customer.customerEntity } : account;
    }

    throw new UnauthorizedException('Rôle utilisateur inconnu.');
  }
}
