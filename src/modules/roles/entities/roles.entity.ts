import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { StatusEnum } from '../../../common/enum/config.enum';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { Permission } from '../../menu/entities/permission.entity';

@Entity()
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: '20', comment: '角色名称' })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: null,
    comment: '角色标识',
  })
  identification: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ENABLED,
    comment: '状态 启用1 禁用2 删除3',
  })
  status: StatusEnum;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Menu, (menu) => menu.roles, { cascade: true })
  menus: Menu[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  permissions: Permission[];
}
