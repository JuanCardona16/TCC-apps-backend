import { RequestHandler } from 'express';
import UserServices from '../services/user.service';
import CustomApiResponses from '@/config/responses/CustomResponses';

class UserControllers {
  getUserInfo: RequestHandler = async (req, res, next) => {
    const user = (req as any).user;

    const response = await UserServices.getInfo(user.uuid);

    res.status(200).send(CustomApiResponses.success(response));
  };

  getAllStudent: RequestHandler = async (req, res, next) => {
    const { conditions, page, limit } = req.params;

    const response = await UserServices.getAllStudentsForPaginated(
      conditions,
      Number(page),
      Number(limit)
    );

    res.status(200).send(CustomApiResponses.success(response));
  };

  getAllTeachers: RequestHandler = async (req, res, next) => {
    const { conditions, page, limit } = req.params;

    const response = await UserServices.getAllTeachersForPaginated(
      conditions,
      Number(page),
      Number(limit)
    );

    res.status(200).send(CustomApiResponses.success(response));
  };
}

export default new UserControllers();
