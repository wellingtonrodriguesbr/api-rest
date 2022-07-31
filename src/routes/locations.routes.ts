import { Router } from "express";
import LocationsController from "../controllers/LocationsController";

const locationsRouter = Router();
const locationsController = new LocationsController();

locationsRouter.get("/", locationsController.index);
locationsRouter.get("/:id", locationsController.show);
locationsRouter.post("/", locationsController.create);

export default locationsRouter;
