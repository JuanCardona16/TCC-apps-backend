import {
  AcademicPeriodModel,
  INote,
  NotesModel,
  SubjectModel,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { Rol } from '@/infrastructure/mongoDb/Models/User';
import UserModel from '@/infrastructure/mongoDb/Models/User/repository/UserModel';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

class NoteService extends CrudService<INote> {
  constructor() {
    super(NotesModel);
  }

  // Crear una nota
  async create(data: Partial<INote>): Promise<any> {
    const { studentId, subjectId, grade, period } = data;

    // Validaciones
    if (!studentId || !subjectId || grade === undefined || !period) {
      return CustomError(400, "Faltan campos requeridos: studentId, subjectId, grade, period");
    }

    // Validar formato de UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(studentId) || !uuidRegex.test(subjectId) || !uuidRegex.test(period)) {
      return CustomError(400, "UUID inválido");
    }

    // Validar que el estudiante existe y tiene rol student
    const student = await UserModel.findOne({ uuid: studentId });
    if (!student || student.rol !== Rol.STUDENT) {
      return CustomError(400, "Estudiante no encontrado o no válido");
    }

    // Validar que la materia existe
    const subject = await SubjectModel.findOne({ uuid: subjectId });
    if (!subject) {
      return CustomError(400, "Materia no encontrada");
    }

    // Validar que el período existe
    const academicPeriod = await AcademicPeriodModel.findOne({ uuid: period });
    if (!academicPeriod) {
      return CustomError(400, "Período académico no encontrado");
    }

    // Validar la nota (0.0 a 5.0)
    if (grade < 0 || grade > 5) {
      return CustomError(400, "La nota debe estar entre 0.0 y 5.0");
    }

    // Verificar si ya existe una nota para el estudiante, materia y período
    const existingNote = await this.model.findOne({ studentId, subjectId, period });
    if (existingNote) {
      return CustomError(400, "Ya existe una nota para este estudiante, materia y período");
    }

    // Crear nota
    return super.create({ studentId, subjectId, grade, period });
  }

  // Buscar todas las notas
  async findAll(): Promise<any> {
    try {
      const notes = await super.findAll();
      if (notes.length === 0) {
        return CustomError(404, "No se encontraron notas");
      }
      return notes;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener notas");
    }
  }

  // Buscar una nota por UUID
  async findByUuid(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const note = await this.model.findOne({ uuid }).exec();
      if (!note) {
        return CustomError(404, "Nota no encontrada");
      }
      return note;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener nota");
    }
  }

  // Actualizar una nota
  async update(uuid: string, data: Partial<INote>): Promise<any> {
    try {
      const { studentId, subjectId, grade, period } = data;

      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      // Validar que se proporcione al menos un campo
      if (!studentId && !subjectId && grade === undefined && !period) {
        return CustomError(400, "Debe proporcionar al menos un campo para actualizar");
      }

      // Validar studentId si se proporciona
      if (studentId) {
        if (!uuidRegex.test(studentId)) {
          return CustomError(400, "UUID de estudiante inválido");
        }
        const student = await UserModel.findOne({ uuid: studentId });
        if (!student || student.rol !== Rol.STUDENT) {
          return CustomError(400, "Estudiante no encontrado o no válido");
        }
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

      // Validar period si se proporciona
      if (period) {
        if (!uuidRegex.test(period)) {
          return CustomError(400, "UUID de período inválido");
        }
        const academicPeriod = await AcademicPeriodModel.findOne({ uuid: period });
        if (!academicPeriod) {
          return CustomError(400, "Período académico no encontrado");
        }
      }

      // Validar grade si se proporciona
      if (grade !== undefined && (grade < 0 || grade > 5)) {
        return CustomError(400, "La nota debe estar entre 0.0 y 5.0");
      }

      // Verificar duplicidad (excepto para la nota actual)
      if (studentId || subjectId || period) {
        const query: any = { uuid: { $ne: uuid } };
        if (studentId) query.studentId = studentId;
        if (subjectId) query.subjectId = subjectId;
        if (period) query.period = period;
        const existingNote = await this.model.findOne(query);
        if (existingNote) {
          return CustomError(400, "Ya existe una nota para este estudiante, materia y período");
        }
      }

      const updatedNote = await this.model
        .findOneAndUpdate({ uuid }, { studentId, subjectId, grade, period }, { new: true })
        .exec();
      if (!updatedNote) {
        return CustomError(404, "Nota no encontrada");
      }

      return updatedNote;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al actualizar nota");
    }
  }

  // Eliminar una nota
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const deletedNote = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedNote) {
        return CustomError(404, "Nota no encontrada");
      }

      return deletedNote;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al eliminar nota");
    }
  }
}

export default new NoteService();
