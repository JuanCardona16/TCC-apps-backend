import { Model } from "mongoose";

export class CrudService<T> {
  constructor(readonly model: Model<T>) {}

  // CREATE
  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  // READ (All)
  async findAll(filter: Record<string, any> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  // READ (One by ID)
  async findOne(uuid: string): Promise<T | null> {
    return this.model.findOne({ uuid }).exec();
  }

  // UPDATE
  async update(uuid: string, item: Partial<T>): Promise<T | null> {
    return this.model.findOneAndUpdate({ uuid }, item, { new: true }).exec();
  }

  // DELETE
  async delete(uuid: string): Promise<T | null> {
    return this.model.findOneAndDelete({ uuid }).exec();
  }
}