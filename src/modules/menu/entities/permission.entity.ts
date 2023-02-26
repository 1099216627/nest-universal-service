import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Menu } from './menu.entity';
import { Role } from '../../roles/entities/roles.entity';

@Entity()
export class Permission extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', comment: '权限' })
  action: string;

  @Column({ nullable: false, unique: true })
  key: string;

  @Column()
  controller: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  roles: Role[];
}
