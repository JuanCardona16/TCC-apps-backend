import { Router } from "express";
import { createCareer, deleteCareer, getCareerByUuid, getCareers, updateCareer } from "../controller/career.controller";

const careersPaths = Router();

careersPaths.post("/careers", createCareer);
careersPaths.get("/careers/", getCareers);
careersPaths.get("/careers/:uuid", getCareerByUuid);
careersPaths.put("/careers/:uuid", updateCareer);
careersPaths.delete("/careers/:uuid", deleteCareer);

export default careersPaths;