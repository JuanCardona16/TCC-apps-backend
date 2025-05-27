import { Router } from 'express';
import {
  createSubject,
  deleteSubject,
  enrollStudent,
  getSubjectByUuid,
  getSubjects,
  updateSubject,
} from '../controller/subjects.controllers';

const subjectsPaths = Router();

subjectsPaths.post('/subjects', createSubject);
subjectsPaths.get('/subjects', getSubjects);
subjectsPaths.get('/subjects/:uuid', getSubjectByUuid);
subjectsPaths.put('/subjects/:uuid', updateSubject);
subjectsPaths.delete('/subjects/:uuid', deleteSubject);
subjectsPaths.post('/subjects/:uuid/enroll', enrollStudent);

export default subjectsPaths;
