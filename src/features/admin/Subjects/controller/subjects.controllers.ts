// src/controllers/SubjectController.ts
import { CustomError } from '@/lib';
import { Request, Response } from 'express';
import subjectsService from '../services/subjects.service';

export const createSubject = async (req: Request, res: Response) => {
  try {
    const response = await subjectsService.create(req.body);
    res.status(201).json({
      success: true,
      subject: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear materia' });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectsService.findAll();
    res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materias' });
  }
};

export const getSubjectByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const subject = await subjectsService.findByUuid(uuid);

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materia' });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const subject = await subjectsService.update(uuid, req.body);

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    await subjectsService.delete(uuid);

    res.status(200).json({
      success: true,
      message: 'Materia eliminada exitosamente',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
};

export const enrollStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;
    const { studentUuid } = req.body;

    if (!studentUuid) {
      throw CustomError(400, 'El UUID del estudiante es requerido');
    }

    const subject = await subjectsService.enrollStudent(uuid, studentUuid);

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al matricular estudiante' });
  }
};
