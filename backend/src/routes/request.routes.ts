import { Router } from "express";
import { requestController } from "../controllers/request.controller.js";

const requestRouter = Router();

requestRouter.get("/", requestController.findAll.bind(requestController));
requestRouter.post("/", requestController.create.bind(requestController));

export default requestRouter;
