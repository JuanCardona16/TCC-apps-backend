import { Base } from "../../Base";

export interface Subjects extends Base {
  name: string,
  code: string,
  teacherUuid: string,
  scheduleUuid: string, // Horario de clases
  enrolledStudents: string[], // Estudiantes inscritos
}