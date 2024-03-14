import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  // if (request.method === "GET") {
  //   const recipes = await Recipe.find();

  //   if (!recipes) {
  //     return response.status(404).json({ status: "Not Found" });
  //   }

  //   response.status(200).json(recipes);
  // }

  if (request.method === "GET") {
    // Initialisiere ein leeres Abfrageobjekt
    let queryObj = {};

    // Iteriere über alle Query-Parameter
    Object.keys(request.query).forEach((key) => {
      const value = request.query[key];
      // Verarbeite spezielle Filterlogik basierend auf dem Schlüssel
      if (key === "duration") {
        // Spezielle Logik für die Dauer
        queryObj = { ...queryObj, ...handleDurationFilter(value) };
      } else {
        // Standardverhalten für andere Filter
        queryObj[key] = { $in: value.split(",") };
      }
    });

    // Verwende das dynamisch erstellte Abfrageobjekt
    const recipes = await Recipe.find(queryObj);

    if (!recipes.length) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(recipes);
  }

  if (request.method === "POST") {
    try {
      const recipes = new Recipe(request.body);
      await recipes.save();
      return response.status(201).json({ status: "Recipe created." });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}

// Hilfsfunktion für die Dauerfilterlogik
function handleDurationFilter(value) {
  const ranges = value.split(",");
  const durationQuery = ranges.reduce(
    (acc, range) => {
      const [min, max] = range.split("&&");
      if (min && max) {
        acc.$and.push({
          duration: { $gte: parseInt(min), $lte: parseInt(max) },
        });
      } else if (min) {
        acc.$and.push({ duration: { $gte: parseInt(min) } });
      } else if (max) {
        acc.$and.push({ duration: { $lte: parseInt(max) } });
      }
      return acc;
    },
    { $and: [] }
  );

  return durationQuery.$and.length ? { $and: durationQuery.$and } : {};
}
