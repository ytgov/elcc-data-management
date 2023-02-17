import { CareCentre } from "../data/models";

export class CentreService {
  constructor() {}

  async getAll(): Promise<CareCentre[]> {
    return new Array<CareCentre>();
  }
}
