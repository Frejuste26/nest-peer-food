import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../Models/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([User])], 
  providers: [UserService], 
  controllers: [UserController], 
  exports: [UserService]
})
export class UserModule {}
