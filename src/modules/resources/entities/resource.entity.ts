import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Resource extends BaseEntity {
  @Column({
    type: "varchar",
    length: 50,
    comment: "资源名称",
  })
  name: string;
  @Column({
    type: "varchar",
    length: 255,
    comment: "资源描述",
  })
  description: string;
  @Column({
    type: "varchar",
    length: 255,
    comment: "资源链接",
  })
  url: string;
  @Column({
    type: "varchar",
    length: 255,
    comment: "资源封面",
  })
  cover: string;
}
