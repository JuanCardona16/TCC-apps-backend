import mongoose from "mongoose";
import { IUser, Rol } from "../Entity/User.entity";
import UserModel from "./UserModel";

export class UserRepository {

  static async findStudents(conditions: mongoose.FilterQuery<IUser> = {}) {
    return UserModel.find({ conditions, rol: Rol.STUDENT })
  }

  static async findTeachers(conditions: mongoose.FilterQuery<IUser> = {}) {
    return UserModel.find({ conditions, rol: Rol.TEACHER })
  }

}
