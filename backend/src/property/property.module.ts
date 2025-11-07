import { Module } from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { PropertyController } from './property.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
