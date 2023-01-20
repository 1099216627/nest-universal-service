export interface GetUserDto {
  page: number;
  limit?: number;
  username?: string;
  roleId?: number;
  gender?: number;
}
