import { SelectQueryBuilder } from 'typeorm';
import { User } from '../../modules/users/entities/users.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { Log } from '../../modules/logs/entities/logs.entity';
import { Menu } from '../../modules/menu/entities/menu.entity';
import { BaseEntity } from '../entities/base.entity';

export function getPageAndLimit(page: number, limit: number) {
  const _limit = limit || 10;
  const _page = page || 1;
  const skip = (_page - 1) * _limit;
  return {
    skip,
    take: _limit,
  };
}
//过滤无效参数,应用于createBuilder查询方法
export function conditionUtil<T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
): SelectQueryBuilder<T> {
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] });
    }
  });
  return queryBuilder;
}
//格式化数据
export class ResultData {
  constructor(code = 200, message?: string, data?: any) {
    this.code = code;
    this.message = message || 'success';
    this.data = data || null;
  }

  code: number;

  message?: string;

  data?: any;
  static success(message?: any, data?: any) {
    return new ResultData(200, message, data);
  }

  static error(code: number, message?: string, data?: any) {
    return new ResultData(code, message, data);
  }
}
//生成分页数据，包含字段page ->当前页 pages ->总页数 total ->总条数 size ->每页条数
export function generatePaginationData(
  total: number,
  page: number,
  limit?: number,
) {
  const pages = Math.ceil(total / (limit || 10));
  const size = limit || 10;
  return {
    total,
    page,
    pages,
    size,
  };
}

export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  //时间格式化YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}
