import { CustomError } from '@/lib';
import UserQueryServicesRepository from '@/infrastructure/mongoDb/Models/User/repository/UserRepository';

class UserServices {
  getInfo = async (uuid: string) => {
    const user = await UserQueryServicesRepository.findByUuid(uuid);

    if (!user) return CustomError(404, 'User not found');

    return user;
  };

  getAllStudentsForPaginated = async (conditions = {}, page: number, limit: number) => {
    const allStudent = await UserQueryServicesRepository.paginatedStudents(conditions, page, limit);

    if (!allStudent) return CustomError(404, 'Students not found');

    return allStudent;
  };

  getAllTeachersForPaginated = async (conditions = {}, page: number, limit: number) => {
    const allTeachers = await UserQueryServicesRepository.paginatedTeachers(
      conditions,
      page,
      limit
    );

    if (!allTeachers) return CustomError(404, 'Teachers not found');

    return allTeachers;
  };
}

export default new UserServices();
