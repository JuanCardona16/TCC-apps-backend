// src/controllers/SubjectController.ts
import { Request, Response } from 'express';
import notesService from '../services/notes.service';

export const createNote = async (req: Request, res: Response) => {
  try {
    const newNote = await notesService.create(req.body);
    res.status(201).json({
      success: true,
      note: {
        uuid: newNote.uuid,
        studentId: newNote.studentId,
        subjectId: newNote.subjectId,
        grade: newNote.grade,
        period: newNote.period,
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear nota" });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await notesService.findAll();
    res.status(200).json({
      success: true,
      notes: notes.map((n: any) => ({
        uuid: n.uuid,
        studentId: n.studentId,
        subjectId: n.subjectId,
        grade: n.grade,
        period: n.period,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener notas" });
  }
};

export const getNoteByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const note = await notesService.findByUuid(uuid);

    res.status(200).json({
      success: true,
      note: {
        uuid: note.uuid,
        studentId: note.studentId,
        subjectId: note.subjectId,
        grade: note.grade,
        period: note.period,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener nota" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const updatedNote = await notesService.update(uuid, req.body);

    res.status(200).json({
      success: true,
      note: {
        uuid: updatedNote.uuid,
        studentId: updatedNote.studentId,
        subjectId: updatedNote.subjectId,
        grade: updatedNote.grade,
        period: updatedNote.period,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar nota" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const deletedNote = await notesService.delete(uuid);

    res.status(200).json({
      success: true,
      message: "Nota eliminada",
      note: {
        uuid: deletedNote.uuid,
        studentId: deletedNote.studentId,
        subjectId: deletedNote.subjectId,
        grade: deletedNote.grade,
        period: deletedNote.period,
        createdAt: deletedNote.createdAt,
        updatedAt: deletedNote.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar nota" });
  }
};
