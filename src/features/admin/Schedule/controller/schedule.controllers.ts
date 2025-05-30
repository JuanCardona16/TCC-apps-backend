// src/controllers/SubjectController.ts
import { CustomError } from '@/lib';
import { Request, Response } from 'express';
import subjectsService from '../services/schedule.service';
import scheduleService from '../services/schedule.service';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const newSchedule = await scheduleService.create(req.body);
    res.status(201).json({
      success: true,
      schedule: {
        uuid: newSchedule.uuid,
        subjectId: newSchedule.subjectId,
        day: newSchedule.day,
        time: newSchedule.time,
        aula: newSchedule.aula,
        createdAt: newSchedule.createdAt,
        updatedAt: newSchedule.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear horario" });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await scheduleService.findAll();
    res.status(200).json({
      success: true,
      schedules: schedules.map((s: any) => ({
        uuid: s.uuid,
        subjectId: s.subjectId,
        day: s.day,
        time: s.time,
        aula: s.aula,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener horarios" });
  }
};

export const getScheduleByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const schedule = await scheduleService.findByUuid(uuid);

    res.status(200).json({
      success: true,
      schedule: {
        uuid: schedule.uuid,
        subjectId: schedule.subjectId,
        day: schedule.day,
        time: schedule.time,
        aula: schedule.aula,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener horario" });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const updatedSchedule = await scheduleService.update(uuid, req.body);

    res.status(200).json({
      success: true,
      schedule: {
        uuid: updatedSchedule.uuid,
        subjectId: updatedSchedule.subjectId,
        day: updatedSchedule.day,
        time: updatedSchedule.time,
        aula: updatedSchedule.aula,
        createdAt: updatedSchedule.createdAt,
        updatedAt: updatedSchedule.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar horario" });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const deletedSchedule = await scheduleService.delete(uuid);

    res.status(200).json({
      success: true,
      message: "Horario eliminado",
      schedule: {
        uuid: deletedSchedule.uuid,
        subjectId: deletedSchedule.subjectId,
        day: deletedSchedule.day,
        time: deletedSchedule.time,
        aula: deletedSchedule.aula,
        createdAt: deletedSchedule.createdAt,
        updatedAt: deletedSchedule.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar horario" });
  }
};
