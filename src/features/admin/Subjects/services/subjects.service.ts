import {
  AcademicPeriodModel,
  ISubject,
  SubjectModel,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { Rol, StudentModel, TeacherModel } from '@/infrastructure/mongoDb/Models/User';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

class SubjectService extends CrudService<ISubject> {
  constructor() {
    super(SubjectModel);
  }

  // Crear una materia
  async create(data: Partial<ISubject>): Promise<any> {
    const { name, credits, periodId, teacherId, prerequisites } = data;

    // Validaciones
    if (!name || !credits || !periodId) {
      return CustomError(400, 'Faltan campos requeridos: name, credits, periodId');
    }

    if (credits <= 0) {
      return CustomError(400, 'Los créditos deben ser mayores a 0');
    }

    // Validar que el período existe
    const period = await AcademicPeriodModel.findOne({ uuid: periodId });
    if (!period) {
      return CustomError(400, 'Período académico no encontrado');
    }

    // Validar que el profesor existe y tiene rol professor (si se proporciona)
    if (teacherId) {
      const professor = await TeacherModel.findOne({ uuid: teacherId });
      if (!professor || professor.rol !== Rol.TEACHER) {
        return CustomError(400, 'Profesor no encontrado o no válido');
      }
    }

    // Validar que los prerrequisitos existen (si se proporcionan)
    if (prerequisites && prerequisites.length > 0) {
      const validPrerequisites = await SubjectModel.find({ uuid: { $in: prerequisites } });
      if (validPrerequisites.length !== prerequisites.length) {
        return CustomError(400, 'Uno o más prerrequisitos no son válidos');
      }
    }

    // Verificar si la materia ya existe en el período
    const existingSubject = await this.model.findOne({ name, periodId });
    if (existingSubject) {
      return CustomError(400, 'La materia ya existe en este período');
    }

    // Crear materia
    return super.create({ name, credits, periodId, teacherId, prerequisites });
  }

  // Buscar todas las materias
  async findAll(): Promise<any> {
    try {
      const subjects = await super.findAll();
      if (subjects.length === 0) {
        return CustomError(404, 'No se encontraron materias');
      }
      return subjects;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al obtener materias');
    }
  }

  // Buscar una materia por UUID
  async findByUuid(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, 'UUID inválido');
      }

      const subject = await this.model.findOne({ uuid }).exec();
      if (!subject) {
        return CustomError(404, 'Materia no encontrada');
      }
      return subject;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al obtener materia');
    }
  }

  // Actualizar una materia
  async update(uuid: string, data: Partial<ISubject>): Promise<any> {
    try {
      const { name, credits, periodId, teacherId, prerequisites } = data;

      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, 'UUID inválido');
      }

      // Validar que se proporcione al menos un campo
      if (!name && !credits && !periodId && !teacherId && !prerequisites) {
        return CustomError(400, 'Debe proporcionar al menos un campo para actualizar');
      }

      // Validar créditos si se proporcionan
      if (credits && credits <= 0) {
        return CustomError(400, 'Los créditos deben ser mayores a 0');
      }

      // Validar período si se proporciona
      if (periodId) {
        const period = await AcademicPeriodModel.findOne({ uuid: periodId });
        if (!period) {
          return CustomError(400, 'Período académico no encontrado');
        }
      }

      // Validar profesor si se proporciona
      if (teacherId) {
        const professor = await TeacherModel.findOne({ uuid: teacherId });
        if (!professor || professor.rol !== Rol.TEACHER) {
          return CustomError(400, 'Profesor no encontrado o no válido');
        }
      }

      // Validar prerrequisitos si se proporcionan
      if (prerequisites && prerequisites.length > 0) {
        const validPrerequisites = await SubjectModel.find({ uuid: { $in: prerequisites } });
        if (validPrerequisites.length !== prerequisites.length) {
          return CustomError(400, 'Uno o más prerrequisitos no son válidos');
        }
      }

      // Verificar si el nombre ya existe en el período (excepto para la materia actual)
      if (name && periodId) {
        const existingSubject = await this.model.findOne({ name, periodId, uuid: { $ne: uuid } });
        if (existingSubject) {
          return CustomError(400, 'La materia ya existe en este período');
        }
      }

      const updatedSubject = await this.model
        .findOneAndUpdate(
          { uuid },
          { name, credits, periodId, teacherId, prerequisites },
          { new: true }
        )
        .exec();
      if (!updatedSubject) {
        return CustomError(404, 'Materia no encontrada');
      }

      return updatedSubject;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al actualizar materia');
    }
  }

  // Eliminar una materia
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, 'UUID inválido');
      }

      const deletedSubject = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedSubject) {
        return CustomError(404, 'Materia no encontrada');
      }

      return deletedSubject;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al eliminar materia');
    }
  }

  // Método adicional para matricular un estudiante
  async enrollStudent(subjectUuid: string, studentUuid: string): Promise<any> {
    try {
      // Validar UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(subjectUuid) || !uuidRegex.test(studentUuid)) {
        return CustomError(400, 'UUID inválido');
      }

      // Validar que la materia existe
      const subject = await this.model.findOne({ uuid: subjectUuid });
      if (!subject) {
        return CustomError(404, 'Materia no encontrada');
      }

      // Validar que el estudiante existe y tiene rol student
      const student = await StudentModel.findOne({ uuid: studentUuid });
      if (!student || student.rol !== Rol.STUDENT) {
        return CustomError(400, 'Estudiante no encontrado o no válido');
      }

      // Verificar si el estudiante ya está matriculado
      if (subject.studentsEnrolled?.some((s) => s.userId === studentUuid)) {
        return CustomError(400, 'El estudiante ya está matriculado en esta materia');
      }

      // Matricular estudiante
      const updatedSubject = await this.model
        .findOneAndUpdate(
          { uuid: subjectUuid },
          { $push: { studentsEnrolled: { userId: studentUuid, enrolledAt: new Date() } } },
          { new: true }
        )
        .exec();

      return updatedSubject;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al matricular estudiante');
    }
  }
}

export default new SubjectService();
