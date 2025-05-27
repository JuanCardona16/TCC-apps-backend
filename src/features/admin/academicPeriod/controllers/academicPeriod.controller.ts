import AcademicPeriodService from '../services/academicPeriod.service';
import { CrudController } from '@/lib/generic.controller';
import { IAcademicPeriod } from '@/infrastructure/mongoDb/Models/Global/schemas.global';

export class AcademicPeriodController extends CrudController<IAcademicPeriod> {
  constructor() {
    super(AcademicPeriodService); // Inyecta el servicio específico
  }
}
// Uso en rutas:
export const academicPeriodController = new AcademicPeriodController();
