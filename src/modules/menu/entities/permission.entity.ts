import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from './menu.entity';
import { ActionEnum } from '../../../common/enum/action.enum';
import { Role } from '../../roles/entities/roles.entity';

@Entity()
export class Permission extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'enum', enum: ActionEnum, comment: '权限' })
  action: ActionEnum;

  @Column({ nullable: false, unique: true })
  key: string;

  @Column()
  controller: string;

  @ManyToMany(() => Menu, (menu) => menu.permissions)
  menus: Menu[];

  @ManyToMany(() => Role, (role) => role.permissions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  roles: Role[];
}
