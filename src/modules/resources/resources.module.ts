import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource } from './entities/resource.entity';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports:[TypeOrmModule.forFeature([Resource])]

})
export class ResourcesModule {}
