import { Router } from 'express';
import {
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

export default CurriculumPaths;
