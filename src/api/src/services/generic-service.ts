export interface GenericService<T> {
  getAll(): Promise<T[]>;
}
