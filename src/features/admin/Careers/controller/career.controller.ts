import { Request, Response } from 'express';
import careerService from '../services/career.service';

export const createCareer = async (req: Request, res: Response) => {
  try {
    const newCareer = await careerService.create(req.body);
    console.log(newCareer)
    res.status(201).json({
      success: true,
      career: {
        uuid: newCareer.uuid,
        name: newCareer.name,
        description: newCareer.description,
        createdAt: newCareer.createdAt,
        updatedAt: newCareer.updatedAt,
      },
    });
  } catch (error) {
    console.log("error carrer: ", error)
    res.status(500).json({ error: 'Error al crear carrera' });
  }
};

export const getCareers = async (req: Request, res: Response) => {
  try {
    const careers = await careerService.findAll();
    res.status(200).json({
      success: true,
      careers: careers.map((c: any) => ({
        uuid: c.uuid,
        name: c.name,
        description: c.description,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
};

export const getCareerByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const career = await careerService.findByUuid(uuid);

    res.status(200).json({
      success: true,
      career: {
        uuid: career.uuid,
        name: career.name,
        description: career.description,
        createdAt: career.createdAt,
        updatedAt: career.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
};

export const updateCareer = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const updatedCareer = await careerService.update(uuid, req.body);
    console.log("updatedCareer:", updatedCareer)

    res.status(200).json({
      success: true,
      career: updatedCareer,
    });
  } catch (error) {
    console.log("Error put:", error)
    res.status(500).json({ error: 'Error al actualizar carrera' });
  }
};

export const deleteCareer = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const deletedCareer = await careerService.delete(uuid);

    res.status(200).json({
      success: true,
      message: 'Carrera eliminada',
      career: {
        uuid: deletedCareer.uuid,
        name: deletedCareer.name,
        description: deletedCareer.description,
        createdAt: deletedCareer.createdAt,
        updatedAt: deletedCareer.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
};
