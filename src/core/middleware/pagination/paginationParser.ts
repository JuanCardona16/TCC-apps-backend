import { Request, Response, NextFunction } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  filters: Record<string, any>;
}

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationParams;
    }
  }
}

export function paginationParser(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Extrae todos los filtros restantes de la query
  const { page: _, limit: __, ...filters } = req.query;

  req.pagination = {
    page,
    limit,
    filters: filters as Record<string, any>
  };

  next();
}
