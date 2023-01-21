import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class Logger extends BaseEntity {
  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  ip: string;

  @Column({ comment: '耗时时间', type: 'int' })
  time: number;

  @Column({ comment: '请求code码', type: 'int' })
  code: number;

  @ManyToOne(() => User, (user) => user.logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
