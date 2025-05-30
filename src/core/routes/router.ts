import { ApiPrefixAuthRoutes, ApiPrefixRouteUser } from '@/constants/routes';
import { Router } from 'express';
import authenticationPaths from '@/features/auth/routes/auth.route';
import userRouterPaths from '@/features/user/routes/user.router';
import academicPeriodPaths from '@/features/admin/academicPeriod/routes/academicPeriod.routes';
import careersPaths from '@/features/admin/Careers/routes/career.ruutes';
import subjectsPaths from '@/features/admin/Subjects/routes/subjects.routes';
import CurriculumPaths from '@/features/admin/Curriculum/routes/curriculum.routes';
import SchedulePaths from '@/features/admin/Schedule/routes/schedule.routes';
import notesPaths from '@/features/admin/Notes/routes/notes.routes';

const routerApplication: Router = Router();

routerApplication.use(ApiPrefixAuthRoutes, authenticationPaths);
routerApplication.use(ApiPrefixRouteUser, userRouterPaths);
routerApplication.use('/', academicPeriodPaths);
routerApplication.use('/', careersPaths);
routerApplication.use('/', subjectsPaths);
routerApplication.use('/', CurriculumPaths);
routerApplication.use('/', SchedulePaths);
routerApplication.use('/', notesPaths);

export default routerApplication;
