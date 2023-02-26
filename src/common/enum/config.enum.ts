export enum ConfigEnum {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  DB_SYNCHRONIZE = 'DB_SYNCHRONIZE',
  DB_TYPE = 'DB_TYPE',
  // JWT
  JWT_SECRET = 'JWT_SECRET',
  // Redis
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_RECONNECT = 'REDIS_RECONNECT',
}
export enum LogEnum {
  LOG_LEVEL = 'LOG_LEVEL',
  LOG_ON = 'LOG_ON',
}

export enum GenderEnum {
  MALE = 1,
  FEMALE = 2,
}

export enum StatusEnum {
  ENABLED = 1,
  DISABLE = 2,
  DELETE = 3,
}

export enum IsDefaultEnum {
  YES = 1,
  NO = 2,
}

export enum IsBooleanEnum {
  YES = 1,
  NO = 0,
}

export enum AccountStatusEnum {
  ENABLED = 1,
  DISABLE = 2,
  DELETE = 3,
}
