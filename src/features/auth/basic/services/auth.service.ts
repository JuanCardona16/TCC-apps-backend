import { jwtHelpers } from '@/core/security/security';
import { CustomError } from '@/lib';
import { LoginRequestData, RegisterRequestData } from '../types';
import PasswordHelpers from '../../../../lib/Passwords/PasswordHelpers';
import CustomApiResponses from '@/config/responses/CustomResponses';
import UserModel from '@/infrastructure/mongoDb/Models/User/repository/UserModel';
import { AuthMethods, Rol, StudentModel, TeacherModel } from '@/infrastructure/mongoDb/Models/User';

class AuthenticationServices {
  register = async (data: RegisterRequestData) => {
    if (!UserModel) return CustomError(409, 'User not found');

    let newUser;

    if (data.rol === Rol.STUDENT) {
      newUser = new StudentModel({
        ...data,
        studentCode: data.studentCode ?? '', // asegura que no sea undefined
        registeredSubjects: data.registeredSubjects ?? [], // asegura que siempre sea array
      });
    } else if (data.rol === Rol.TEACHER) {
      newUser = new TeacherModel({
        ...data,
        associatedSubjects: data.associatedSubjects ?? [], // asegura que no sea undefined
      });
    } else if (data.rol === Rol.ADMIN) {
      newUser = new UserModel(data);
    } else {
      throw CustomError(400, 'Invalid role or missing user data');
    }

    const newUserInDb = await newUser.save();

    const token = jwtHelpers.generateToken<string>({ payload: newUserInDb.uuid }, '2d');

    return {
      access_token: token
    };
  };

  login = async (data: LoginRequestData) => {
    // Buscar usuario e incluir el password
    const isExistUserInDb = await UserModel.findOne({ email: data.email }).select('+password');

    if (!isExistUserInDb) return CustomError(401, 'Credenciales Invalidas');

    // Validar que el método de autenticación coincida
    if (isExistUserInDb.authenticationMethod !== AuthMethods.BASIC) {
      return CustomError(
        403,
        `Este usuario usa autenticación por ${isExistUserInDb.authenticationMethod}`
      );
    }

    if (!PasswordHelpers.compare(data.password, isExistUserInDb.password))
      return CustomError(401, 'Credenciales inválidas');

    const token = jwtHelpers.generateToken<string>({ payload: isExistUserInDb.uuid }, '2d');

    return {
      access_token: token
    };
  };

  logout() {}
}

export default new AuthenticationServices();
