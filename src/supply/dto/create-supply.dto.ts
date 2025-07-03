import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSupplyDto {
  @IsNotEmpty({ message: 'L\'ID du plat est requis.' })
  @IsNumber({}, { message: 'L\'ID du plat doit être un nombre.' })
  platId: number;

  @IsNotEmpty({ message: 'L\'ID de la commande est requis.' })
  @IsString({ message: 'L\'ID de la commande doit être une chaîne de caractères.' })
  orderId: string;
}