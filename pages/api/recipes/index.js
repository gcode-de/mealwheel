import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    let queryObj = {};

    let sortObj = {};
    const { sort, order } = request.query;

    if (sort && order) {
      sortObj[sort] = order;
    }

    Object.keys(request.query).forEach((key) => {
      const value = request.query[key];
      if (key === "duration") {
        queryObj = { ...queryObj, ...handleDurationFilter(value) };
      } else {
        queryObj[key] = { $in: value.split(",") };
      }
    });

    const recipes = await Recipe.find(queryObj).sort({ title: 1 });

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
