import { Request, Response } from "express";
import knexConnection from "../database/connection";

class LocationsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    if (city && uf && items) {
      const parsedItems: Number[] = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      const locations = await knexConnection("locations")
        .join(
          "location_items",
          "locations.id",
          "=",
          "location_items.location_id"
        )
        .whereIn("location_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("locations.*");

      return res.json(locations);
    } else {
      const locations = await knexConnection("locations").select("*");
      return res.json(locations);
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const location = await knexConnection("locations").where("id", id).first();

    if (!location) {
      return res.status(400).json({ error: "Location not found!" });
    }

    const items = await knexConnection("items")
      .join("location_items", "items.id", "=", "location_items.item_id")
      .where("location_items.location_id", id)
      .select("items.title");

    return res.json({ location, items });
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, city, uf, longitude, latitude, items } =
      req.body;
    const location = {
      image: "fake-image.jpg",
      name,
      email,
      whatsapp,
      city,
      uf,
      longitude,
      latitude,
    };
    const transaction = await knexConnection.transaction();

    const newIds = await transaction("locations").insert(location);
    const location_id = newIds[0];

    const locationItems = await Promise.all(
      items.map(async (item_id: number) => {
        const selectedItem = await transaction("items")
          .where("id", item_id)
          .first();

        if (!selectedItem) {
          return res.status(400).json({ error: "Item not already exists!" });
        }
        return {
          item_id,
          location_id,
        };
      })
    );
    await transaction("location_items").insert(locationItems);
    await transaction.commit();

    return res.json({
      id: location_id,
      ...location,
    });
  }
}

export default LocationsController;
