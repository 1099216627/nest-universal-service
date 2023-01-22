import { SetMetadata } from '@nestjs/common';

export const setRouteNameDecorator = (name: string) => {
  //设置路由metaData中的name
  return (target: any, key: string, descriptor: PropertyDescriptor) =>
    SetMetadata('name', name)(target, key, descriptor);
};
