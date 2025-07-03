import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { Customer } from '../Models/customer.model'; 
import { Account } from '../Models/account.model';
import { User } from '../Models/user.model';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '3600s' },
    }),
    // --- AJOUT IMPORTANT ICI ---
    TypeOrmModule.forFeature([Customer, Account, User]), // Expose les dépôts des entités Customer, Account, User
    // --- FIN AJOUT IMPORTANT ---
  ],
  providers: [
    AuthService,
    JwtStrategy,],
  controllers: [AuthController],
})
export class AuthModule {}
