import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    let queryObj = {};

    const { sort = "title", order = "asc" } = request.query; // Standardwerte setzen

    const sortOrder = order === "desc" ? -1 : 1;

    // Ausschluss von Sortierparametern aus der Filterlogik
    Object.keys(request.query).forEach((key) => {
      if (key !== "sort" && key !== "order" && key !== "duration") {
        queryObj[key] = { $in: request.query[key].split(",") };
      }
    });

    // Aufbau der Aggregations-Pipeline
    let pipeline = [
      { $match: queryObj },
      {
        $addFields: {
          lowerCaseTitle: { $toLower: "$title" }, // Feld in Kleinbuchstaben umwandeln
        },
      },
      {
        $sort:
          sort === "title"
            ? { lowerCaseTitle: sortOrder }
            : { [sort]: sortOrder },
      },
    ];

    // Filter für die Dauer hinzufügen, falls vorhanden
    if (request.query.duration) {
      const durationFilter = handleDurationFilter(request.query.duration);
      pipeline = [{ $match: durationFilter }, ...pipeline];
    }

    const recipes = await Recipe.aggregate(pipeline);

    if (!recipes.length) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(recipes);
  } else if (request.method === "POST") {
    try {
      const recipe = new Recipe(request.body);
      await recipe.save();
      return response.status(201).json({ status: "Recipe created." });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}

function handleDurationFilter(value) {
  const ranges = value.split(",");
  const durationQuery = ranges.reduce(
    (acc, range) => {
      const [min, max] = range.split("&&");
      if (min && max) {
        acc.$or.push({
          duration: { $gte: parseInt(min), $lte: parseInt(max) },
        });
      } else if (min) {
        acc.$or.push({ duration: { $gte: parseInt(min) } });
      } else if (max) {
        acc.$or.push({ duration: { $lte: parseInt(max) } });
      }
      return acc;
    },
    { $or: [] }
  );
  return durationQuery.$or.length ? { $or: durationQuery.$or } : {};
}
