import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Log } from '../../logs/entities/logs.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Role } from '../../roles/entities/roles.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Log, (log) => log.user, { cascade: true })
  logs: Log[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, //级联操作
  })
  profile: Profile;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
