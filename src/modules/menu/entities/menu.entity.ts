import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/roles.entity';
import { IsBooleanEnum } from '../../../common/enum/config.enum';
import { Permission } from './permission.entity';

@Entity('menu')
export class Menu extends BaseEntity {
  @Column()
  title: string;

  @Column()
  path: string;

  //pid关联自身
  @Column({ nullable: true, default: null })
  pid: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({
    type: 'tinyint',
    default: IsBooleanEnum.NO,
    comment: '是否为外链 1是 0否',
  })
  isLink: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: null,
    comment: '图标',
  })
  icon: string;

  @Column({
    type: 'tinyint',
    default: IsBooleanEnum.NO,
    comment: '是否隐藏 1是 0否',
  })
  hidden: number;

  @Column({
    type: 'tinyint',
    default: IsBooleanEnum.NO,
    comment: '是否缓存 1是 0否',
  })
  cache: number;

  @Column({
    type: 'tinyint',
    default: IsBooleanEnum.NO,
    comment: '是否固定 1是 0否',
  })
  affix: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  component: string;

  @Column({
    type: 'tinyint',
    default: IsBooleanEnum.NO,
    comment: '是否为布局 1是 0否',
  })
  isLayout: number;

  @Column({
    type: 'varchar',
  })
  redirect: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ nullable: false, unique: true })
  key: string;

  @ManyToMany(() => Role, (role) => role.menus)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.menus)
  @JoinTable()
  permissions: Permission[];
}
