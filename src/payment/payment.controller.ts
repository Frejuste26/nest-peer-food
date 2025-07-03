import { Controller, Post, Get, Patch, Body, Param, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '../Models/payment.model';

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('payments') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  // Seuls les étudiants et les enseignants peuvent initier des paiements
  @Roles(AccountRole.STUDENT, AccountRole.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto): Promise<Payment> {
    return this.paymentService.initiatePayment(initiatePaymentDto);
  }

  @Patch('webhook/:payCode')
  // Ce endpoint simule un webhook. En production, il serait accessible par la passerelle de paiement
  // et devrait avoir une sécurité renforcée (ex: signature de webhook).
  // Pour l'instant, seuls les administrateurs/managers peuvent le simuler.
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER)
  async updatePaymentStatus(
    @Param('payCode') payCode: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.updatePaymentStatus(payCode, updatePaymentDto);
  }

  @Get(':payCode')
  // Tous les utilisateurs (clients pour leurs propres paiements, admins/managers pour tous)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async getPaymentStatus(@Param('payCode') payCode: string): Promise<Payment> {
    const payment = await this.paymentService.findOne(payCode);
    if (!payment) {
      throw new NotFoundException(`Payment with code ${payCode} not found.`);
    }
    return payment;
  }

  @Get()
  // Seuls les administrateurs et managers peuvent voir tous les paiements
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER)
  async findAllPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }
}
