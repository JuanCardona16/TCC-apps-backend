import { model, Schema } from 'mongoose';
import crypto from 'node:crypto';
import { AuthMethods, Rol, IUser, ITeacher, IStudent } from '../Entity/User.entity';
import PasswordHelpers from '@/lib/Passwords/PasswordHelpers';
import { CustomError } from '@/lib';
import { CollectionsNamesMongo } from '@/infrastructure/mongoDb/Collections/Collections';

const UserMongoSchema = new Schema<IUser>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Email is not valid',
      },
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      select: false,
    },
    authenticationMethod: {
      type: String,
      required: true,
      enum: Object.values(AuthMethods),
      default: AuthMethods.BASIC,
    },
    rol: {
      type: String,
      required: true,
      enum: Object.values(Rol),
      default: Rol.STUDENT,
      index: true,
    },
    historyOfNotifications: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
    discriminatorKey: 'rol',
  }
);

UserMongoSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Generar contraseña si no existe (por método GOOGLE)
  if (user.authenticationMethod === 'GOOGLE') {
    if (!user.password) {
      // Generar una contraseña aleatoria si no tiene una
      user.password = PasswordHelpers.generateSecurePassword(user.username);
    }
  } else {
    // Validar si la contraseña cumple con las reglas
    if (!PasswordHelpers.validateCharacters(user.password)) {
      return next(CustomError(400, 'Invalid Credentials'));
    }
  }

  // Hashear la contraseña siempre
  user.password = PasswordHelpers.generateHashing(user.password, 12);

  next();
});

// Modelo Base
const UserModel = model<IUser>(CollectionsNamesMongo.USERS, UserMongoSchema);

// INTERFACES Y MODELOS ESPECÍFICOS POR ROL ------------------------

// Estudiante
const StudentSchema = new Schema<IStudent>({
  studentCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  registeredSubjects: {
    type: [String],
    default: [],
    validate: {
      validator: (subjects: string[]) => new Set(subjects).size === subjects.length,
      message: 'Subjects must be unique',
    },
  },
});

// Profesor
const TeacherSchema = new Schema<ITeacher>({
  associatedSubjects: {
    type: [String],
    required: true,
    validate: {
      validator: (subjects: string[]) => new Set(subjects).size === subjects.length,
      message: 'Subjects must be unique',
    },
  },
});

// Creamos los discriminadores
export const StudentModel = UserModel.discriminator<IStudent>(Rol.STUDENT, StudentSchema);
export const TeacherModel = UserModel.discriminator<ITeacher>(Rol.TEACHER, TeacherSchema);

export default UserMongoSchema;
