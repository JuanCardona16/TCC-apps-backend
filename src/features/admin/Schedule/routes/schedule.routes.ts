import { Router } from 'express';
import {
  createSchedule,
  deleteSchedule,
  getScheduleByUuid,
  getSchedules,
  updateSchedule,
} from '../controller/schedule.controllers';

const SchedulePaths = Router();

SchedulePaths.post('/schedules', createSchedule);
SchedulePaths.get('/schedules', getSchedules);
SchedulePaths.get('/schedules/:uuid', getScheduleByUuid);
SchedulePaths.put('/schedules/:uuid', updateSchedule);
SchedulePaths.delete('/schedules/:uuid', deleteSchedule);

export default SchedulePaths;
