import { AcademicPeriodModel, IAcademicPeriod } from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

class AcademicPeriodServices extends CrudService<IAcademicPeriod> {
  constructor() {
    super(AcademicPeriodModel);
  }

  async create(data: Partial<IAcademicPeriod>): Promise<any> {
    const { name, startDate, endDate } = data;

    // Validaciones
    if (!name || !startDate || !endDate) {
      return CustomError(500, "Faltan campos requeridos: name, startDate, endDate");
    }

    if (startDate >= endDate) {
      return CustomError(500, "La fecha de inicio debe ser anterior a la fecha de fin");
    }

    // Verificar si el período ya existe
    const existingPeriod = await this.model.findOne({ name });
    if (existingPeriod) {
      return CustomError(500, "El período ya existe");
    }

    return super.create({ name, startDate, endDate });
  }

  // Buscar todos los períodos académicos
  async findAll(): Promise<any> {
    try {
      const periods = await super.findAll();
      if (periods.length === 0) {
        return CustomError(404, "No se encontraron períodos académicos");
      }
      console.log("periodos academicos", periods)
      return periods;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.log(error)
      return CustomError(500, "Error al obtener períodos académicos");
    }
  }

  // Buscar un período académico por ID
  async findById(uuid: string): Promise<any> {
    try {
      // Validar formato del ID
      if (!uuid) {
        return CustomError(400, "ID inválido");
      }

      const period = await super.findOne(uuid);
      if (!period) {
        return CustomError(404, "Período académico no encontrado");
      }
      return period;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener período académico");
    }
  }

  // Actualizar un período académico
  async update(uuid: string, data: Partial<IAcademicPeriod>): Promise<any> {
    try {
      const { name, startDate, endDate } = data;

      // Validar formato del ID
      if (!uuid) {
        return CustomError(400, "ID inválido");
      }

      // Validar que se proporcione al menos un campo
      if (!name && !startDate && !endDate) {
        return CustomError(400, "Debe proporcionar al menos un campo para actualizar");
      }

      // Validar fechas si se proporcionan
      if (startDate && endDate && startDate >= endDate) {
        return CustomError(400, "La fecha de inicio debe ser anterior a la fecha de fin");
      }

      // Verificar si el nombre ya existe (excepto para el período actual)
      if (name) {
        const existingPeriod = await this.model.findOne({ name, _id: { $ne: uuid } });
        if (existingPeriod) {
          return CustomError(400, "El período ya existe");
        }
      }

      const updatedPeriod = await super.update(uuid, { name, startDate, endDate });
      if (!updatedPeriod) {
        return CustomError(404, "Período académico no encontrado");
      }

      return updatedPeriod;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al actualizar período académico");
    }
  }

  // Eliminar un período académico
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del ID
      if (!uuid) {
        return CustomError(400, "ID inválido");
      }

      const deletedPeriod = await super.delete(uuid);
      if (!deletedPeriod) {
        return CustomError(404, "Período académico no encontrado");
      }

      return deletedPeriod;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al eliminar período académico");
    }
  }
}

export default new AcademicPeriodServices();
