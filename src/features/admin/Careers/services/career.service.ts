import { CarrerModel, ICareer } from "@/infrastructure/mongoDb/Models/Global/schemas.global";
import { CustomError } from "@/lib";
import { CrudService } from "@/lib/genericCrud.service";

class CareerService extends CrudService<ICareer> {
  constructor() {
    super(CarrerModel);
  }

  // Crear una carrera
  async create(data: Partial<ICareer>): Promise<any> {
    const { name, description } = data;

    // Validaciones
    if (!name) {
      return CustomError(400, "El nombre de la carrera es requerido");
    }

    // Verificar si la carrera ya existe (por nombre)
    const existingCareer = await this.model.findOne({ name });
    if (existingCareer) {
      return CustomError(400, "La carrera ya existe");
    }

    // El uuid se genera automáticamente en el modelo
    return super.create({ name, description });
  }

  // Buscar todas las carreras
  async findAll(): Promise<any> {
    try {
      const careers = await super.findAll();
      if (careers.length === 0) {
        return CustomError(404, "No se encontraron carreras");
      }
      return careers;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener carreras");
    }
  }

  // Buscar una carrera por UUID
  async findByUuid(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const career = await this.model.findOne({ uuid }).exec();
      if (!career) {
        return CustomError(404, "Carrera no encontrada");
      }
      return career;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al obtener carrera");
    }
  }

  // Actualizar una carrera
  async update(uuid: string, data: Partial<ICareer>): Promise<any> {
    try {
      const { name, description } = data;

      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      // Validar que se proporcione al menos un campo
      if (!name && !description) {
        return CustomError(400, "Debe proporcionar al menos un campo para actualizar");
      }

      // Verificar si el nombre ya existe (excepto para la carrera actual)
      if (name) {
        const existingCareer = await this.model.findOne({ name, uuid: { $ne: uuid } });
        if (existingCareer) {
          return CustomError(400, "El nombre de la carrera ya existe");
        }
      }

      const updatedCareer = await this.model
        .findOneAndUpdate({ uuid }, { name, description }, { new: true })
        .exec();
      if (!updatedCareer) {
        return CustomError(404, "Carrera no encontrada");
      }

      return updatedCareer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al actualizar carrera");
    }
  }

  // Eliminar una carrera
  async delete(uuid: string): Promise<any> {
    try {
      // Validar formato del UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return CustomError(400, "UUID inválido");
      }

      const deletedCareer = await this.model.findOneAndDelete({ uuid }).exec();
      if (!deletedCareer) {
        return CustomError(404, "Carrera no encontrada");
      }

      return deletedCareer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      return CustomError(500, "Error al eliminar carrera");
    }
  }
}

export default new CareerService();
