import { Request, Response, NextFunction } from 'express';

// types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      mongoFilter?: Record<string, any>;
    }
  }
}

export function parseQueryToMongoFilter(req: Request, res: Response, next: NextFunction) {
  const filter: Record<string, any> = {};

  for (const key in req.query) {
    if (req.query[key] !== undefined) {
      filter[key] = req.query[key];
    }
  }

  req.mongoFilter = filter;
  next();
}
