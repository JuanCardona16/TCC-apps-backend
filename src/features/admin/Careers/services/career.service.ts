import {
  AcademicPeriodModel,
  CarrerModel,
  CurriculumModel,
  ICareer,
} from '@/infrastructure/mongoDb/Models/Global/schemas.global';
import { CustomError } from '@/lib';
import { CrudService } from '@/lib/genericCrud.service';

class CareerService extends CrudService<ICareer> {
  private readonly DEFAULT_SEMESTER = '2025-1';

  constructor() {
    super(CarrerModel);
  }

  private async validateCareerName(name: string, excludeUuid?: string): Promise<void> {
    const query = excludeUuid ? { name, uuid: { $ne: excludeUuid } } : { name };

    const existingCareer = await this.model.findOne(query);
    if (existingCareer) {
      throw CustomError(400, 'La carrera ya existe');
    }
  }

  async create(data: Partial<ICareer>): Promise<ICareer> {
    const { name, description } = data;

    if (!name) {
      throw CustomError(400, 'El nombre de la carrera es requerido');
    }

    await this.validateCareerName(name);

    try {
      const newCareer = await super.create({ name, description });

      const semester = await AcademicPeriodModel.findOne({ name: this.DEFAULT_SEMESTER });

      const curriculum = await CurriculumModel.create({
        careerId: newCareer.uuid,
        semester: semester?.name,
      });

      const updatedCareer = await this.model.findOneAndUpdate(
        { uuid: newCareer.uuid },
        { curriculumId: curriculum.uuid },
        { new: true }
      );

      if (!updatedCareer) {
        throw CustomError(404, 'Career not found');
      }
      return updatedCareer;
    } catch (error) {
      throw CustomError(500, 'Error creating career and curriculum');
    }
  }

  async findAll(): Promise<ICareer[]> {
    try {
      const careers = await super.findAll();
      if (!careers.length) {
        throw CustomError(404, 'No se encontraron carreras');
      }
      return careers;
    } catch (error) {
      throw CustomError(500, 'Error al obtener carreras');
    }
  }

  async findByUuid(uuid: string): Promise<ICareer> {
    try {
      const career = await this.model.findOne({ uuid }).exec();
      if (!career) {
        throw CustomError(404, 'Carrera no encontrada');
      }
      return career;
    } catch (error) {
      throw CustomError(500, 'Error al obtener carrera');
    }
  }

  async update(uuid: string, data: Partial<ICareer>): Promise<ICareer> {
    try {
      const { name, description, enrolledStudents } = data;

      // Create update object only with provided fields
      const updateData: Partial<ICareer> = {};

      if (name) {
        await this.validateCareerName(name, uuid);
        updateData.name = name;
      }

      if (description !== undefined) {
        updateData.description = description;
      }

      const career = await this.model.findOne({ uuid });

      if (!career) {
        throw CustomError(404, 'Carrera no encontrada');
      }

      // Si vienen cambios en enrolledStudents, los fusionamos
      if (enrolledStudents !== undefined) {
        const current = career.enrolledStudents || [];
        const incoming = Array.isArray(enrolledStudents) ? enrolledStudents : [enrolledStudents];

        const map = new Map();

        // Agrega los actuales
        for (const entry of current) {
          map.set(entry.semesterId, new Set(entry.students));
        }

        // Fusiona con los nuevos
        for (const entry of incoming) {
          if (!map.has(entry.semesterId)) {
            map.set(entry.semesterId, new Set(entry.students));
          } else {
            for (const s of entry.students) {
              map.get(entry.semesterId).add(s);
            }
          }
        }

        // Vuelve a array
        updateData.enrolledStudents = Array.from(map.entries()).map(([semesterId, students]) => ({
          semesterId,
          students: Array.from(students),
        }));
      }

      // Check if there are any fields to update
      if (Object.keys(updateData).length === 0) {
        throw CustomError(400, 'Debe proporcionar al menos un campo para actualizar');
      }

      const updatedCareer = await this.model
        .findOneAndUpdate({ uuid }, updateData, { new: true })
        .exec();

      if (!updatedCareer) {
        throw CustomError(404, 'Carrera no encontrada');
      }

      return updatedCareer;
    } catch (error) {
      throw CustomError(500, 'Error al actualizar carrera');
    }
  }

  async delete(uuid: string): Promise<ICareer> {
    try {
      const deletedCareer = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedCareer) {
        throw CustomError(404, 'Carrera no encontrada');
      }

      return deletedCareer;
    } catch (error) {
      throw CustomError(500, 'Error al eliminar carrera');
    }
  }
}

export default new CareerService();
