import { CollectionsNamesMongo } from '@/infrastructure/mongoDb';
import {
  CarrerModel,
  CurriculumModel,
  ICurriculum,
  SubjectModel,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

export class CurriculumService extends CrudService<ICurriculum> {
  constructor() {
    super(CurriculumModel);
  }

  // Crear un currículum
  async create(data: Partial<ICurriculum>): Promise<any> {
    const { careerId, semester, subjects } = data;
    console.log(data);

    // Validaciones
    if (!careerId || !semester) {
      return CustomError(400, 'Faltan campos requeridos: careerId, semester');
    }

    // Validar que las materias existen (si se proporcionan)
    if (subjects && subjects.length > 0) {
      const validSubjects = await SubjectModel.find({ uuid: { $in: subjects } });
      if (validSubjects.length !== subjects.length) {
        return CustomError(400, 'Una o más materias no son válidas');
      }
    }

    // Verificar si el currículum ya existe para la carrera y semestre
    const existingCurriculum = await this.model.findOne({ careerId, semester });
    if (existingCurriculum) {
      return CustomError(400, 'El currículum ya existe para esta carrera y semestre');
    }

    // Crear currículum
    return super.create({ careerId, semester, subjects });
  }

  // Buscar todos los currículums
  async findAll(): Promise<any> {
    try {
      const curriculums = await super.findAll();
      if (curriculums.length === 0) {
        return CustomError(404, 'No se encontraron currículums');
      }
      return curriculums;
    } catch (error) {
      return CustomError(500, 'Error al obtener currículums');
    }
  }

  // Buscar un currículum por UUID
  async findByUuid(uuid: string): Promise<any> {
    try {
      const curriculum = await this.model
        .findOne({ uuid: uuid })
        .populate('career', 'name -_id')
        .populate('semesterInfo', 'name -_id')
        .exec();

      if (!curriculum) {
        return CustomError(404, 'Currículum no encontrado');
      }

      console.log('Curriculum', curriculum);

      return curriculum;
    } catch (error) {
      console.log(error);
      return CustomError(500, 'Error al obtener currículum');
    }
  }

  // Actualizar un currículum
  async update(uuid: string, data: Partial<ICurriculum>): Promise<any> {
    try {
      const { careerId, semester, subjects } = data;

      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, 'UUID inválido');
      }

      // Validar que se proporcione al menos un campo
      if (!careerId && !semester && !subjects) {
        return CustomError(400, 'Debe proporcionar al menos un campo para actualizar');
      }

      // Validar carrera si se proporciona
      if (careerId) {
        const career = await CarrerModel.findOne({ uuid: careerId });
        if (!career) {
          return CustomError(400, 'Carrera no encontrada');
        }
      }

      // Validar materias si se proporcionan
      if (subjects && subjects.length > 0) {
        const validSubjects = await SubjectModel.find({ uuid: { $in: subjects } });
        if (validSubjects.length !== subjects.length) {
          return CustomError(400, 'Una o más materias no son válidas');
        }
      }

      // Verificar si el currículum ya existe para otra carrera y semestre (excepto para el currículo actual)
      if (careerId && semester) {
        const existingCurriculum = await this.model.findOne({
          careerId,
          semester,
          uuid: { $ne: uuid },
        });
        if (existingCurriculum) {
          return CustomError(400, 'El currículum ya existe para esta carrera y semestre');
        }
      }

      const updatedCurriculum = await this.model
        .findOneAndUpdate({ uuid }, { careerId, semester, subjects }, { new: true })
        .exec();
      if (!updatedCurriculum) {
        return CustomError(404, 'Currículum no encontrado');
      }

      return updatedCurriculum;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al actualizar currículum');
    }
  }

  // Eliminar un currículum
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, 'UUID inválido');
      }

      const deletedCurriculum = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedCurriculum) {
        return CustomError(404, 'Currículum no encontrado');
      }

      return deletedCurriculum;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, 'Error al eliminar currículum');
    }
  }

  async addSubjectToCurriculum(uuid: string, subjectId: string): Promise<any> {
    try {
      
      const subject = await SubjectModel.findOne({ uuid: subjectId }).exec();
      
      if (!subject) {
        return CustomError(404, 'Materia no encontrada');
      }
      
      const curriculum = await this.model.findOneAndUpdate({ uuid }, { $push: { subjects: subjectId } }).exec();

      return curriculum;
    } catch (error) {
      throw CustomError(500, 'Error al agregar materia al currículum');
    }
  }


}

export default new CurriculumService();
