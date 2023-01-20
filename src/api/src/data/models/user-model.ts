export interface User {
  email: string;
  sub: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  is_admin: Boolean;
  ynet_id: string;
  directory_id: string;
  create_date: Date;

  roles?: string[];
  scopes?: string[];
  display_name?: string;
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface User_Create {
  email: string;
  sub: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
}

export interface User_Update {
  first_name: string;
  last_name: string;
  status: UserStatus;
  ynet_id: string;
  directory_id: string;
  roles?: string[];
}

export interface UserRole {
  email: string;
  role: string;
}

export class UserHelper {
  fromDTO(dto: any): User {
    return {
      email: dto.email,
      sub: dto.sub,
      first_name: dto.first_name,
      last_name: dto.last_name,
      status: dto.status,
      is_admin: dto.is_admin,
      ynet_id: dto.ynet_id,
      directory_id: dto.directory_id,
      create_date: dto.create_date,
    };
  }
}
