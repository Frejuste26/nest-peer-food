import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PlatService } from './plat.service';
import { PlatController } from './plat.controller';
import { Plat } from '../Models/plat.model'; 

@Module({
  imports: [TypeOrmModule.forFeature([Plat])], 
  providers: [PlatService],
  controllers: [PlatController],
  exports: [PlatService], 
})
export class PlatModule {}
