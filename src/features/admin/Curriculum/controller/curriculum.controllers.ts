// src/controllers/SubjectController.ts
import { Request, Response } from 'express';
import curriculumService from '../services/curriculum.service';

export const createCurriculum = async (req: Request, res: Response) => {
  console.log('controller', req.body);
  try {
    const newCurriculum = await curriculumService.create(req.body);

    console.log('response services', newCurriculum);

    res.status(201).json({
      success: true,
      curriculum: {
        uuid: newCurriculum.uuid,
        careerId: newCurriculum.careerId,
        semester: newCurriculum.semester,
        subjects: newCurriculum.subjects,
        createdAt: newCurriculum.createdAt,
        updatedAt: newCurriculum.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear currículum' });
  }
};

export const getCurriculums = async (_req: Request, res: Response) => {
  try {
    const curriculums = await curriculumService.findAll();
    res.status(200).json({
      success: true,
      curriculums: curriculums.map((c: any) => ({
        uuid: c.uuid,
        careerId: c.careerId,
        semester: c.semester,
        subjects: c.subjects,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener currículums' });
  }
};

export const getCurriculumByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const curriculum = await curriculumService.findByUuid(uuid);

    console.log('controller response', curriculum);

    res.status(200).json({
      success: true,
      curriculum: {
        career: curriculum.career.name,
        semester: curriculum.semesterInfo.name,
        subjects: curriculum.subjects,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener currículum' });
  }
};

export const updateCurriculum = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const updatedCurriculum = await curriculumService.update(uuid, req.body);

    res.status(200).json({
      success: true,
      curriculum: {
        uuid: updatedCurriculum.uuid,
        careerId: updatedCurriculum.careerId,
        semester: updatedCurriculum.semester,
        subjects: updatedCurriculum.subjects,
        createdAt: updatedCurriculum.createdAt,
        updatedAt: updatedCurriculum.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar currículum' });
  }
};

export const deleteCurriculum = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const deletedCurriculum = await curriculumService.delete(uuid);

    res.status(200).json({
      success: true,
      message: 'Currículum eliminado',
      curriculum: {
        uuid: deletedCurriculum.uuid,
        careerId: deletedCurriculum.careerId,
        semester: deletedCurriculum.semester,
        subjects: deletedCurriculum.subjects,
        createdAt: deletedCurriculum.createdAt,
        updatedAt: deletedCurriculum.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar currículum' });
  }
};

export const addSubjectToCurriculum = async (req: Request, res: Response) => {
  try {
    const { curriculumId, subjectId } = req.params;
    console.log('Params', curriculumId, subjectId);


    const curriculum = await curriculumService.addSubjectToCurriculum(curriculumId, subjectId);
    console.log('Curriculum controller response', curriculum);
    res.status(200).json({
      success: true,
      message: 'Materia agregada al currículum',
      curriculum: {
        uuid: curriculum.uuid,
        careerId: curriculum.careerId,
        semester: curriculum.semester,
        subjects: curriculum.subjects,
        createdAt: curriculum.createdAt,
        updatedAt: curriculum.updatedAt,
      },
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: 'Error al agregar materia al currículum' });
  }
};
