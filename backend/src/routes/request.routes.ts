import { Router } from "express";
import { requestController } from "../controllers/request.controller.js";

const requestRouter = Router();

requestRouter.get("/", requestController.findAll.bind(requestController));
requestRouter.get("/:id", requestController.findById.bind(requestController));
requestRouter.post("/", requestController.create.bind(requestController));
requestRouter.patch("/:id/status", requestController.updateStatus.bind(requestController));

export default requestRouter;
