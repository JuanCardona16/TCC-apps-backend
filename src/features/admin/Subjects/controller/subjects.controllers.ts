// src/controllers/SubjectController.ts
import { CustomError } from "@/lib";
import { Request, Response } from "express";
import subjectsService from "../services/subjects.service";

export const createSubject = async (req: Request, res: Response) => {
  try {
    await subjectsService.create(req.body);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear materia" });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectsService.findAll();
    res.status(200).json({
      success: true,
      subjects: subjects.map((s: any) => ({
        uuid: s.uuid,
        name: s.name,
        credits: s.credits,
        periodId: s.periodId,
        teacherId: s.teacherId,
        prerequisites: s.prerequisites,
        studentsEnrolled: s.studentsEnrolled,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener materias" });
  }
};

export const getSubjectByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const subject = await subjectsService.findByUuid(uuid);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener materia" });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const updatedSubject = await subjectsService.update(uuid, req.body);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar materia" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const deletedSubject = await subjectsService.delete(uuid);

    res.status(200).json({
      success: true,
      message: "Materia eliminada",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar materia" });
  }
};

export const enrollStudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { uuid } = req.params;
    const { studentUuid } = req.body;

    if (!studentUuid) {
      return CustomError(400, "El UUID del estudiante es requerido");
    }

    const updatedSubject = await subjectsService.enrollStudent(uuid, studentUuid);

    res.status(200).json({
      success: true,
      subject: {
        uuid: updatedSubject.uuid,
        name: updatedSubject.name,
        credits: updatedSubject.credits,
        periodId: updatedSubject.periodId,
        teacherId: updatedSubject.teacherId,
        prerequisites: updatedSubject.prerequisites,
        studentsEnrolled: updatedSubject.studentsEnrolled,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al matricular estudiante" });
  }
};