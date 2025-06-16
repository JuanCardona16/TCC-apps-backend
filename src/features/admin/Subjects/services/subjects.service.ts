import {
  AcademicPeriodModel,
  ISubject,
  SubjectModel,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { Rol, TeacherModel } from '@/infrastructure/mongoDb/Models/User';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

class SubjectService extends CrudService<ISubject> {
  constructor() {
    super(SubjectModel);
  }

  // Crear una materia
  async create(data: Partial<ISubject>): Promise<ISubject> {
    const {
      name,
      credits,
      periodId,
      teacherId,
      prerequisites,
      studentsEnrolled,
      activities,
      schedule,
      syllabus,
      totalStudents,
    } = data;

    // Validaciones
    if (!name || !credits || !periodId) {
      throw CustomError(400, 'Required fields missing: name, credits, periodId');
    }

    if (credits <= 0) {
      throw CustomError(400, 'Credits must be greater than 0');
    }

    // Validar que el período existe
    const period = await AcademicPeriodModel.findOne({ name: periodId });
    if (!period) {
      throw CustomError(400, 'Período académico no encontrado');
    }

    // Validar que el profesor existe y tiene rol professor (si se proporciona)
    if (teacherId) {
      const professor = await TeacherModel.findOne({ uuid: teacherId });
      if (!professor || professor.rol !== Rol.TEACHER) {
        throw CustomError(400, 'Profesor no encontrado o no válido');
      }
    }

    // Validar que los prerrequisitos existen (si se proporcionan)
    if (prerequisites?.length) {
      const validPrerequisites = await SubjectModel.find({
        uuid: { $in: prerequisites },
      });
      if (validPrerequisites.length !== prerequisites.length) {
        throw CustomError(400, 'Uno o más prerrequisitos no son válidos');
      }
    }

    // Verificar si la materia ya existe en el período
    const existingSubject = await this.model.findOne({ name, periodId });
    if (existingSubject) {
      throw CustomError(400, 'La materia ya existe en este período');
    }

    return super.create({
      name,
      credits,
      periodId,
      teacherId,
      prerequisites,
      studentsEnrolled: studentsEnrolled || [],
      activities,
      schedule,
      syllabus,
      totalStudents,
    });
  }

  // Buscar todas las materias
  async findAll(): Promise<ISubject[]> {
    try {
      const subjects = await super.findAll();
      return subjects;
    } catch (error) {
      throw CustomError(500, 'Error fetching subjects');
    }
  }

  // Buscar una materia por UUID
  async findByUuid(uuid: string): Promise<ISubject> {
    try {
      const subject = await this.model.findOne({ uuid }).exec();
      if (!subject) {
        throw CustomError(404, 'Subject not found');
      }
      return subject;
    } catch (error) {
      throw CustomError(500, 'Error fetching subject');
    }
  }

  // Actualizar una materia
  async update(uuid: string, data: Partial<ISubject>): Promise<ISubject> {
    try {
      const updatedSubject = await this.model
        .findOneAndUpdate({ uuid }, { ...data }, { new: true })
        .exec();

      if (!updatedSubject) {
        throw CustomError(404, 'Subject not found');
      }

      return updatedSubject;
    } catch (error) {
      throw CustomError(500, 'Error updating subject');
    }
  }

  // Eliminar una materia
  async delete(uuid: string): Promise<ISubject> {
    try {
      const deletedSubject = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedSubject) {
        throw CustomError(404, 'Subject not found');
      }
      return deletedSubject;
    } catch (error) {
      throw CustomError(500, 'Error deleting subject');
    }
  }

  // Método adicional para matricular un estudiante
  async enrollStudent(subjectUuid: string, studentUuid: string): Promise<ISubject> {
    try {
      // First find the subject to check if it exists
      const subject = await this.model.findOne({ uuid: subjectUuid });
      if (!subject) {
        throw CustomError(404, 'Subject not found');
      }

      // Update subject with new student and increment totalStudents
      const updatedSubject = await this.model
        .findOneAndUpdate(
          { uuid: subjectUuid },
          {
            $push: {
              studentsEnrolled: {
                userId: studentUuid,
                enrolledAt: new Date(),
              },
            },
            $inc: { totalStudents: 1 }, // Increment totalStudents by 1
          },
          { new: true }
        )
        .exec();

      if (!updatedSubject) {
        throw CustomError(404, 'Subject not found');
      }

      return updatedSubject;
    } catch (error) {
      throw CustomError(500, 'Error enrolling student');
    }
  }
}

export default new SubjectService();
