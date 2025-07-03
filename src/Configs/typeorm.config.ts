import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { User } from 'src/Models/user.model';
dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  // Correction ici : Convertir en nombre et fournir une valeur par défaut si undefined
  port: parseInt(process.env.DB_PORT || '3306', 10), // Utilisez '3306' comme valeur par défaut
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User, // Listez explicitement vos entités ici
    // Ajoutez toutes vos autres entités ici (Category, Account, Customer, etc.)
    // Ou utilisez un glob pattern si vous êtes sûr de votre structure de dossiers
    // par exemple : __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true, // À désactiver en production et utiliser des migrations
};

export default typeOrmConfig;