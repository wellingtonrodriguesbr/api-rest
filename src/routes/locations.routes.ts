import { Router } from "express";
import { upload } from "../controllers/LocationsController";
import LocationsController from "../controllers/LocationsController";
import { celebrate, Joi } from "celebrate";

const locationsRouter = Router();
const locationsController = new LocationsController();

locationsRouter.get("/", locationsController.index);
locationsRouter.get("/:id", locationsController.show);
locationsRouter.post(
  "/",
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.array().items(Joi.number()).required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  locationsController.create
);
locationsRouter.put("/:id", upload.single("image"), locationsController.update);

export default locationsRouter;
