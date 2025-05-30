import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteByUuid,
  getNotes,
  updateNote,
} from '../controller/notes.controllers';

const notesPaths = Router();

notesPaths.post('/notes', createNote);
notesPaths.get('/notes', getNotes);
notesPaths.get('/notes/:uuid', getNoteByUuid);
notesPaths.put('/notes/:uuid', updateNote);
notesPaths.delete('/notes/:uuid', deleteNote);

export default notesPaths;
