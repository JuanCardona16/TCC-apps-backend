import { Router } from 'express';
import {
  addSubjectToCurriculum,
  createCurriculum,
  deleteCurriculum,
  getCurriculumByUuid,
  getCurriculums,
  updateCurriculum,
} from '../controller/curriculum.controllers';

const CurriculumPaths = Router();

CurriculumPaths.post('/curriculums', createCurriculum);
CurriculumPaths.get('/curriculums', getCurriculums);
CurriculumPaths.get('/curriculums/:uuid', getCurriculumByUuid);
CurriculumPaths.put('/curriculums/:uuid', updateCurriculum);
CurriculumPaths.delete('/curriculums/:uuid', deleteCurriculum);
CurriculumPaths.post('/curriculums/:uuid/subjects/:subjectId', addSubjectToCurriculum);

export default CurriculumPaths;
