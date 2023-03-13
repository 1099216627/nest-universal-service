export enum UserAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  DISABLE = 'disable',
  ENABLE = 'enable',
  RECOVER = 'recover',
}

export enum RoleAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PERMISSION = 'permission',
  LOCK = 'lock',
  UNLOCK = 'unlock',
}

export enum LogAction {
  READ = 'read',
  DELETE = 'delete',
}

export enum ResourceAction {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
