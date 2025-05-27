import { model, Schema } from 'mongoose';
import crypto from 'node:crypto';
import { CollectionsNamesMongo } from '../../Collections/Collections';

// Carrer Schema
export interface ICareer {
  uuid: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CarrerMongoSchema = new Schema<ICareer>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true     
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CarrerModel = model<ICareer>(CollectionsNamesMongo.CARRERS, CarrerMongoSchema);

// --------------------------------------------------------------

// Academic Period
export interface IAcademicPeriod {
  uuid: string;
  name: string;
  startDate: String;
  endDate: String;
  createdAt?: Date;
  updatedAt?: Date;
}

export const AcademicPeriodMongoSchema = new Schema<IAcademicPeriod>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String, 
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const AcademicPeriodModel = model<IAcademicPeriod>(
  CollectionsNamesMongo.ACADEMIC_PERIODS,
  AcademicPeriodMongoSchema
);

// --------------------------------------------------------------

// Academic Period
const CurriculumMongoSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    careerId: { type: String, ref: CollectionsNamesMongo.CARRERS, required: true },
    semester: { type: Number, required: true }, // Ejemplo: 1 para primer semestre
    subjects: [{ type: String, ref: CollectionsNamesMongo.SUBJECTS }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CurriculumModel = model(CollectionsNamesMongo.CURRICULUMS, CurriculumMongoSchema);

// --------------------------------------------------------------

// Subjects
export interface ISubject {
  _id?: string;
  uuid: string;
  name: string;
  credits: number;
  periodId: string;
  teacherId?: string;
  prerequisites?: string[];
  studentsEnrolled?: { userId: string; enrolledAt: Date }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SubjectSchema = new Schema<ISubject>({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
    index: true,
  },
  name: { type: String, required: true }, // Ejemplo: "Cálculo I"
  credits: { type: Number, required: true }, // Ejemplo: 4
  periodId: { type: String, ref: CollectionsNamesMongo.ACADEMIC_PERIODS, required: true },
  teacherId: { type: String, ref: CollectionsNamesMongo.USERS },
  prerequisites: [{ type: String, ref: CollectionsNamesMongo.SUBJECTS }],
  studentsEnrolled: [
    {
      type: String,
      ref: CollectionsNamesMongo.USERS,
      enrolledAt: { type: Date, default: Date.now },
    },
  ],
});

export const SubjectModel = model<ISubject>(CollectionsNamesMongo.SUBJECTS, SubjectSchema);

// --------------------------------------------------------------

// StudentCareer
const StudentCareerSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
    index: true,
  },
  studentId: { type: String, ref: CollectionsNamesMongo.USERS, required: true },
  careerId: { type: String, ref: CollectionsNamesMongo.CARRERS, required: true },
  enrolledAt: { type: Date, default: Date.now },
});

export const StudentCarrerModel = model(CollectionsNamesMongo.STUDENT_CARRER, StudentCareerSchema);

// --------------------------------------------------------------

// Schedule
const ScheduleMongoSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
    index: true,
  },
  subjectId: { type: String, ref: CollectionsNamesMongo.SUBJECTS, required: true },
  day: { type: String, required: true }, // Ejemplo: "Lunes"
  time: { type: String, required: true }, // Ejemplo: "08:00-10:00"
  aula: String, // Ejemplo: "Aula 101"
});

export const ScheduleModel = model(CollectionsNamesMongo.SCHEDULE, ScheduleMongoSchema);

// --------------------------------------------------------------

// Notes
const NoteMongoSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
    index: true,
  },
  studentId: { type: String, ref: CollectionsNamesMongo.USERS, required: true },
  subjectId: { type: String, ref: CollectionsNamesMongo.SUBJECTS, required: true },
  grade: { type: Number, required: true }, // Ejemplo: 4.5
  period: { type: String, required: true }, // Ejemplo: "2025-1"
});

export const MotesModel = model(CollectionsNamesMongo.NOTES, NoteMongoSchema);
