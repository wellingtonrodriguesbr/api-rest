import { Router } from "express";
import LocationsController from "../controllers/LocationsController";
import { upload } from "../controllers/LocationsController";

const locationsRouter = Router();
const locationsController = new LocationsController();

locationsRouter.get("/", locationsController.index);
locationsRouter.get("/:id", locationsController.show);
locationsRouter.post("/", locationsController.create);
locationsRouter.put("/:id", upload.single("image"), locationsController.update);

export default locationsRouter;
