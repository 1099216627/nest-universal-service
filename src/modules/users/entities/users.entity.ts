import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Log } from '../../logs/entities/logs.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Role } from '../../roles/entities/roles.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AccountStatusEnum } from '../../../common/enum/config.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    nullable: false,
    default: AccountStatusEnum.ENABLED,
    comment: '账号状态 1-启用 2-禁用 3-删除',
  })
  status: AccountStatusEnum;

  @OneToMany(() => Log, (log) => log.user, { cascade: true })
  logs: Log[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, //级联操作
  })
  profile: Profile;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
