// Esquela De Usuario
export interface IUser {
  uuid: string;
  username: string;
  email: string;
  password: string;
  authenticationMethod: AuthMethods;
  rol: Rol;
  studentCode?: string;
  associatedSubjects?: string[];
  registeredSubjects?: string[];
  historyOfNotifications?: string;
}

// Estudiante
export interface IStudent extends IUser {
  studentCode: string;
  registeredSubjects: string[];
}

export interface ITeacher extends IUser {
  associatedSubjects: string[];
}

export enum AuthMethods {
  BASIC = 'BASIC',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
}

export enum Rol {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}
