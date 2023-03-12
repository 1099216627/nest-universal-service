import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Logger } from '../../logger/entities/logger.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Role } from '../../roles/entities/roles.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AccountStatusEnum } from '../../../common/enum/config.enum';
import { formatDate } from '../../../common/utils/index';

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
  //最后登录时间
  @Column({ type: 'timestamp', nullable: true })
  lastLoginTime: Date | string;

  //最后登录地区
  @Column({ type: 'varchar', length: 30, nullable: true })
  lastLoginArea: string;

  @OneToMany(() => Logger, (log) => log.user, { cascade: true })
  logs: Logger[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, //级联操作
  })
  profile: Profile;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @AfterLoad()
  afterLoad() {
    this.createdAt = formatDate(this.createdAt);
    this.updatedAt = formatDate(this.updatedAt);
    this.lastLoginTime = formatDate(this.lastLoginTime);
  }
}
