import express from 'express';
import { academicPeriodController } from '../controllers/academicPeriod.controller';

const academicPeriodPaths = express.Router();

// CRUD Básico
academicPeriodPaths.post('/periods', academicPeriodController.create.bind(academicPeriodController));
academicPeriodPaths.get('/periods', academicPeriodController.findAll.bind(academicPeriodController));
academicPeriodPaths.get('/periods/:id', academicPeriodController.findOne.bind(academicPeriodController));
academicPeriodPaths.put('/periods/:id', academicPeriodController.update.bind(academicPeriodController));
academicPeriodPaths.delete('/periods/:id', academicPeriodController.delete.bind(academicPeriodController));

export default academicPeriodPaths;