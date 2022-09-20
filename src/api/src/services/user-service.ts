export class UserService {
  async getBySub(sub: string): Promise<any | undefined> {
    if (sub == "asdf") return { sub: sub };
    return undefined;
  }

  async create(item: any): Promise<any> {
    return item;
  }
}
