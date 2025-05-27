import { FilterQuery, Model } from 'mongoose';
import { Rol } from '../Entity/User.entity';
import UserModel from './UserModel';
import { StudentModel, TeacherModel } from '../Schema/User.schema';

interface PaginatedResult<T> {
  data: any[];
  total: number;
  page: number;
  totalPages: number;
}

class UserQueryServicesRepository {
  private readonly DEFAULT_LIMIT: number = 10;
  private readonly DEFAULT_PAGE: number = 1;

  async findByUuid(uuid: string) {
    return await UserModel.findOne({ uuid });
  }

  // 📚 Estudiantes
  async findStudents(conditions: FilterQuery<any> = {}) {
    return StudentModel.find(conditions).lean().exec();
  }

  async paginatedStudents(
    conditions: FilterQuery<any> = {},
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT
  ) {
    return this.paginatedSearch(StudentModel, conditions, page, limit);
  }

  // 👨‍🏫 Profesores
  async findTeachers(conditions: FilterQuery<any> = {}) {
    return TeacherModel.find(conditions).lean().exec();
  }

  async paginatedTeachers(
    conditions: FilterQuery<any> = {},
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT
  ) {
    return this.paginatedSearch(TeacherModel, conditions, page, limit);
  }

  async searchTeachersByText(term: string, limit = 10) {
    return TeacherModel.find({ $text: { $search: term } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean()
      .exec();
  }

  // Otros metodos de busqueda:
  // 👥 Por rol y campo
  async findByField<T>(role: Rol, field: string, value: any): Promise<T | null> {
    const model = this._getModelByRole(role);
    return model
      .findOne({ [field]: value })
      .lean()
      .exec() as Promise<T | null>;
  }

  private _getModelByRole(role: Rol): Model<any> {
    switch (role) {
      case Rol.STUDENT:
        return StudentModel;
      case Rol.TEACHER:
        return TeacherModel;
      default:
        return UserModel;
    }
  }

  // Busqueda por texto (nombre, email, etc.)
  async searchText(searchTerm: string, limit: number = this.DEFAULT_LIMIT): Promise<any[] | null> {
    return UserModel.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean()
      .exec();
  }

  // ✅ Método genérico para paginar cualquier modelo
  async paginatedSearch<T>(
    model: Model<T>,
    conditions: FilterQuery<T> = {},
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT,
    sort: Record<string, 1 | -1> = {}
  ): Promise<PaginatedResult<T>> {
    const [data, total] = await Promise.all([
      model
        .find(conditions)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      model.countDocuments(conditions),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new UserQueryServicesRepository();
