import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDefaultEnum } from '../enum/config.enum';
import { formatDate } from '../utils';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: IsDefaultEnum,
    default: IsDefaultEnum.NO,
    comment: '是否为默认数据 1是 0否',
  })
  isDefault: IsDefaultEnum;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | string;

  @AfterLoad()
  afterLoad() {
    this.createdAt = formatDate(this.createdAt);
    this.updatedAt = formatDate(this.updatedAt);
  }
}
