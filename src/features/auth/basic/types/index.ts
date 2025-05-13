import { AuthMethods, Rol } from "@/infrastructure/mongoDb/Models/User";

export type LoginRequestData = {
  email: string;
  password: string;
};

export type RegisterRequestData = LoginRequestData & {
  username: string;
  authenticationMethod: AuthMethods;
  rol: Rol
  studentCode?: string;
  registeredSubjects?: string[];
  associatedSubjects?: string[];
};
