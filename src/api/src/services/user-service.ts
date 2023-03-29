import { db } from "../data";
import { User, UserRole, User_Create, User_Update } from "../data/models";
import { GenericService } from "./generic-service";

const SCHEMA = "dbo";
const USER_TABLE = "users";
const ROLES_TABLES = "user_roles";

export class UserService implements GenericService<User> {
  async getAll(): Promise<User[]> {
    return db.withSchema(SCHEMA).from(USER_TABLE);
  }

  async getBySub(sub: string): Promise<User | undefined> {
    let user = await db<User>(USER_TABLE).withSchema(SCHEMA).where({ sub }).first();

    if (user)
      user.roles = await db<UserRole>(ROLES_TABLES).withSchema(SCHEMA).where({ email: user.email }).select("role");

    return user;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    let user = await db<User>(USER_TABLE).withSchema(SCHEMA).where({ email }).first();

    if (user)
      user.roles = await db<UserRole>(ROLES_TABLES).withSchema(SCHEMA).where({ email: user.email }).select("role");

    return user;
  }

  async create(item: User_Create): Promise<any> {
    return db(USER_TABLE).withSchema(SCHEMA).insert(item);
  }

  async update(email: string, item: User_Update): Promise<User> {
    return db(USER_TABLE).withSchema(SCHEMA).where({ email }).update(item);
  }
}
