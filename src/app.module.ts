import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './Models/user.model'; // Assurez-vous d'importer toutes vos entités ici si elles ne sont pas chargées dynamiquement
import { Account } from './Models/account.model';
import { Category } from './Models/category.model';
import { Composer } from './Models/composer.model';
import { Customer } from './Models/customer.model';
import { Ingredient } from './Models/ingredient.model';
import { Order } from './Models/order.model';
import { Payment } from './Models/payment.model';
import { Plat } from './Models/plat.model';
import { Supplier } from './Models/supplier.model';
import { Supply } from './Models/supply.model';
import { AuthModule } from './auth/auth.module';
import { PlatModule } from './plat/plat.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { ComposerModule } from './composer/composer.module';
import { SupplierModule } from './supplier/supplier.module';
import { PaymentModule } from './payment/payment.module';
import { SupplyModule } from './supply/supply.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Account,
          Category,
          Composer,
          Customer,
          Ingredient,
          Order,
          Payment,
          Plat,
          Supplier,
          Supply
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PlatModule,
    OrderModule,
    CategoryModule,
    IngredientModule,
    ComposerModule,
    SupplierModule,
    PaymentModule,
    SupplyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
