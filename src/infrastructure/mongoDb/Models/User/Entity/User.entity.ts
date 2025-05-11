export interface User {
  uuid: string;
  username: string;
  email: string;
  password: string;
  authenticationMethod: AuthMethods;
  rol: Rol,
  studentCode: string, // Codigo de estudiante.
	associatedSubjects: String[], // Materias asignadas solo para profesores (relacion con la otra coleccion).
	registeredSubjects: String[], // Materias inscritas solo para estudiantes.
	historyOfNotifications: string, // Historial de notificaciones para todos los usuarios (relacion con la otra coleccion).
	createdAt: Date, // Fecha de craecion.
  updatedAt: Date // Fecha de ultima actualizacion.
}

export enum AuthMethods {
  BASIC = 'BASIC',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
}

export enum Rol {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}
