import { Global, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { RolesModule } from '../roles/roles.module';
import { ProfileModule } from '../profile/profile.module';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), RolesModule, ProfileModule],
  exports: [UsersService],
})
export class UsersModule {}
