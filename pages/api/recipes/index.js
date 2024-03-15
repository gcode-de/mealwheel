import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    let queryObj = {};
    console.log("query", request.query);
    const { sort = "title", order = "asc", search } = request.query;
    const sortOrder = order === "desc" ? -1 : 1;

    if (search) {
      queryObj["$text"] = { $search: search };
    }
    console.log("search:", search);

    Object.keys(request.query).forEach((key) => {
      if (!["sort", "order", "duration", "search"].includes(key)) {
        queryObj[key] = { $in: request.query[key].split(",") };
      }
    });

    let pipeline = [
      { $match: queryObj },
      {
        $addFields: {
          lowerCaseTitle: { $toLower: "$title" },
        },
      },
      {
        $sort:
          sort === "title"
            ? { lowerCaseTitle: sortOrder }
            : { [sort]: sortOrder },
      },
    ];

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
