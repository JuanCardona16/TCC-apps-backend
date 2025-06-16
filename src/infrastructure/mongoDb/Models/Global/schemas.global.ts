import mongoose, { model, Schema } from 'mongoose';
import crypto from 'node:crypto';
import { CollectionsNamesMongo } from '../../Collections/Collections';

// Carrer Schema
export interface ICareer {
  uuid: string;
  name: string;
  description: string;
  curriculumId?: string;
  enrolledStudents?: {
    semesterId?: string;
    students: string[];
  }[];
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
      required: true,
    },
    curriculumId: {
      type: String,
    },
    enrolledStudents: [
      {
        semesterId: {
          type: String,
          required: true,
        },
        students: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false,
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
      required: true,
    },
    endDate: {
      type: String,
      required: true,
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
export interface ICurriculum {
  uuid: string;
  careerId: string;
  semester: string;
  subjects?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const CurriculumMongoSchema = new Schema<ICurriculum>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    careerId: { type: String, required: true },
    semester: { type: String, required: true },
    subjects: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CurriculumMongoSchema.virtual('career', {
  ref: CollectionsNamesMongo.CARRERS,
  localField: 'careerId',
  foreignField: 'uuid',
  justOne: true,
});

CurriculumMongoSchema.virtual('semesterInfo', {
  ref: CollectionsNamesMongo.ACADEMIC_PERIODS, // nombre del modelo
  localField: 'semester', // campo en Curriculum
  foreignField: 'uuid', // campo en AcademicPeriods
  justOne: true,
});

export const CurriculumModel = model<ICurriculum>(
  CollectionsNamesMongo.CURRICULUMS,
  CurriculumMongoSchema
);

// --------------------------------------------------------------

// Subjects
export interface ISubject {
  uuid: string;
  name: string;
  credits: number;
  periodId: string;
  teacherId?: string;
  prerequisites?: string[];
  studentsEnrolled?: {
    userId: string;
    enrolledAt: Date;
    status: 'active' | 'inactive' | 'withdrawn';
  }[];
  totalStudents?: number;
  activities?: [
    {
      uuid: string;
      name: string;
      type: string;
      date: Date;
      description: string;
      maxScore: number;
      weight: number; // Percentage weight of the activity in final grade
      submissions?: {
        studentId: string;
        submittedAt: Date;
        score: number;
        feedback?: string;
        status: 'pending' | 'graded' | 'late';
      }[];
    },
  ];
  syllabus?: {
    objectives: string[];
    methodology: string;
    evaluationCriteria: {
      item: string;
      percentage: number;
    }[];
    bibliography: string[];
  };
  schedule?: {
    startTime: string;
    endTime: string;
    days: string[];
    classroom?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    periodId: { type: String, required: true },
    teacherId: { type: String },
    prerequisites: [{ type: String }],
    studentsEnrolled: [
      {
        userId: { type: String },
        enrolledAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['active', 'inactive', 'withdrawn'],
        },
      },
    ],
    totalStudents: { type: Number },
    activities: [
      {
        uuid: { type: String },
        name: { type: String },
        type: { type: String },
        date: { type: Date },
        description: { type: String },
        maxScore: { type: Number },
        weight: { type: Number },
        submissions: [
          {
            studentId: { type: String },
            submittedAt: { type: Date },
            score: { type: Number },
            feedback: { type: String },
            status: {
              type: String,
              enum: ['pending', 'graded', 'late'],
            },
          },
        ],
      },
    ],
    syllabus: {
      objectives: [{ type: String }],
      methodology: { type: String },
      evaluationCriteria: [
        {
          item: { type: String },
          percentage: { type: Number },
        },
      ],
      bibliography: [{ type: String }],
    },
    schedule: {
      startTime: { type: String },
      endTime: { type: String },
      days: [{ type: String }],
      classroom: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    // _id: false,
  }
);

export const SubjectModel = model<ISubject>(CollectionsNamesMongo.SUBJECTS, SubjectSchema);

// --------------------------------------------------------------

// StudentCareer
// const StudentCareerSchema = new Schema({
//   uuid: {
//     type: String,
//     required: true,
//     unique: true,
//     default: () => crypto.randomUUID(),
//     index: true,
//   },
//   studentId: { type: String, required: true },
//   careerId: { type: String, required: true },
//   enrolledAt: { type: Date, default: Date.now },
// });

// export const StudentCarrerModel = model(CollectionsNamesMongo.STUDENT_CARRER, StudentCareerSchema);

// --------------------------------------------------------------

// Schedule
export interface ISchedule {
  uuid: string;
  subjectId: string;
  day: string;
  time: string;
  aula?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// const ScheduleMongoSchema = new Schema<ISchedule>({
//   uuid: {
//     type: String,
//     required: true,
//     unique: true,
//     default: () => crypto.randomUUID(),
//     index: true,
//   },
//   subjectId: { type: String, ref: CollectionsNamesMongo.SUBJECTS, required: true },
//   day: { type: String, required: true }, // Ejemplo: "Lunes"
//   time: { type: String, required: true }, // Ejemplo: "08:00-10:00"
//   aula: String, // Ejemplo: "Aula 101"
// });

// export const ScheduleModel = model<ISchedule>(CollectionsNamesMongo.SCHEDULE, ScheduleMongoSchema);

// --------------------------------------------------------------

// Notes
export interface INote {
  uuid: string;
  studentId: string;
  subjectId: string;
  grade: number;
  period: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const NoteMongoSchema = new Schema<INote>({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
    index: true,
  },
  studentId: { type: String, required: true },
  subjectId: { type: String, required: true },
  grade: { type: Number, required: true }, // Ejemplo: 4.5
  period: { type: String, required: true }, // Ejemplo: "2025-1"
});

export const NotesModel = model<INote>(CollectionsNamesMongo.NOTES, NoteMongoSchema);
