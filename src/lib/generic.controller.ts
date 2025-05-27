import { Request, Response } from 'express';
import { CrudService } from './genericCrud.service';

export class CrudController<T> {
  constructor(protected service: CrudService<T>) {}

  // CREATE
  async create(req: Request, res: Response) {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Error creating item' });
    }
  }

  // READ (All)
  async findAll(req: Request, res: Response) {
    try {
      const items = await this.service.findAll(req.query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching items' });
    }
  }

  // READ (One)
  async findOne(req: Request, res: Response) {
    try {
      const item = await this.service.findOne(req.params.id);
      item ? res.json(item) : res.status(404).json({ error: 'Item not found' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching item' });
    }
  }

  // UPDATE
  async update(req: Request, res: Response) {
    try {
      const item = await this.service.update(req.params.id, req.body);
      item ? res.json(item) : res.status(404).json({ error: 'Item not found' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating item' });
    }
  }

  // DELETE
  async delete(req: Request, res: Response) {
    try {
      const item = await this.service.delete(req.params.id);
      item ? res.json({ message: 'Item deleted' }) : res.status(404).json({ error: 'Item not found' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting item' });
    }
  }
}