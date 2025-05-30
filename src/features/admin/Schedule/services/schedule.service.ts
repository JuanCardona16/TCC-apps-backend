import {
  ISchedule,
  ScheduleModel,
  SubjectModel,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

export class ScheduleService extends CrudService<ISchedule> {
  constructor() {
    super(ScheduleModel);
  }

  // Crear un horario
  async create(data: Partial<ISchedule>): Promise<any> {
    const { subjectId, day, time, aula } = data;

    // Validaciones
    if (!subjectId || !day || !time) {
      return CustomError(400, "Faltan campos requeridos: subjectId, day, time");
    }

    // Validar formato del UUID de subjectId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(subjectId)) {
      return CustomError(400, "UUID de materia inválido");
    }

    // Validar que la materia existe
    const subject = await SubjectModel.findOne({ uuid: subjectId });
    if (!subject) {
      return CustomError(400, "Materia no encontrada");
    }

    // Validar día
    const validDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    if (!validDays.includes(day)) {
      return CustomError(400, "Día inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo");
    }

    // Validar formato de tiempo (HH:MM-HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return CustomError(400, "Formato de tiempo inválido. Debe ser HH:MM-HH:MM");
    }

    // Validar que el tiempo de inicio sea anterior al tiempo de fin
    const [startTime, endTime] = time.split("-");
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    if (start >= end) {
      return CustomError(400, "El tiempo de inicio debe ser anterior al tiempo de fin");
    }

    // Verificar conflictos de horario en la misma aula
    if (aula) {
      const conflictingSchedule = await this.model.findOne({
        aula,
        day,
        time,
      });
      if (conflictingSchedule) {
        return CustomError(400, "Conflicto de horario: la aula ya está ocupada en ese día y hora");
      }
    }

    // Verificar si el horario ya existe para la materia
    const existingSchedule = await this.model.findOne({ subjectId, day, time });
    if (existingSchedule) {
      return CustomError(400, "El horario ya existe para esta materia");
    }

    // Crear horario
    return super.create({ subjectId, day, time, aula });
  }

  // Buscar todos los horarios
  async findAll(): Promise<any> {
    try {
      const schedules = await super.findAll();
      if (schedules.length === 0) {
        return CustomError(404, "No se encontraron horarios");
      }
      return schedules;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener horarios");
    }
  }

  // Buscar un horario por UUID
  async findByUuid(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const schedule = await this.model.findOne({ uuid }).exec();
      if (!schedule) {
        return CustomError(404, "Horario no encontrado");
      }
      return schedule;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener horario");
    }
  }

  // Actualizar un horario
  async update(uuid: string, data: Partial<ISchedule>): Promise<any> {
    try {
      const { subjectId, day, time, aula } = data;

      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      // Validar que se proporcione al menos un campo
      if (!subjectId && !day && !time && !aula) {
        return CustomError(400, "Debe proporcionar al menos un campo para actualizar");
      }

      // Validar subjectId si se proporciona
      if (subjectId) {
        if (!uuidRegex.test(subjectId)) {
          return CustomError(400, "UUID de materia inválido");
        }
        const subject = await SubjectModel.findOne({ uuid: subjectId });
        if (!subject) {
          return CustomError(400, "Materia no encontrada");
        }
      }

      // Validar día si se proporciona
      if (day) {
        const validDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        if (!validDays.includes(day)) {
          return CustomError(400, "Día inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo");
        }
      }

      // Validar tiempo si se proporciona
      if (time) {
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
          return CustomError(400, "Formato de tiempo inválido. Debe ser HH:MM-HH:MM");
        }
        const [startTime, endTime] = time.split("-");
        const start = new Date(`1970-01-01T${startTime}:00Z`);
        const end = new Date(`1970-01-01T${endTime}:00Z`);
        if (start >= end) {
          return CustomError(400, "El tiempo de inicio debe ser anterior al tiempo de fin");
        }
      }

      // Verificar conflictos de horario en la misma aula (excepto para el horario actual)
      if (aula && day && time) {
        const conflictingSchedule = await this.model.findOne({
          aula,
          day,
          time,
          uuid: { $ne: uuid },
        });
        if (conflictingSchedule) {
          return CustomError(400, "Conflicto de horario: la aula ya está ocupada en ese día y hora");
        }
      }

      // Verificar si el horario ya existe para otra materia (excepto para el horario actual)
      if (subjectId && day && time) {
        const existingSchedule = await this.model.findOne({
          subjectId,
          day,
          time,
          uuid: { $ne: uuid },
        });
        if (existingSchedule) {
          return CustomError(400, "El horario ya existe para esta materia");
        }
      }

      const updatedSchedule = await this.model
        .findOneAndUpdate({ uuid }, { subjectId, day, time, aula }, { new: true })
        .exec();
      if (!updatedSchedule) {
        return CustomError(404, "Horario no encontrado");
      }

      return updatedSchedule;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al actualizar horario");
    }
  }

  // Eliminar un horario
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const deletedSchedule = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedSchedule) {
        return CustomError(404, "Horario no encontrado");
      }

      return deletedSchedule;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al eliminar horario");
    }
  }
}

export default new ScheduleService();
