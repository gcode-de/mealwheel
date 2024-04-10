import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);
  const userId = session?.user?.id
    ? new mongoose.Types.ObjectId(session.user.id)
    : null;

  if (request.method === "GET") {
    const { sort = "_id", order = "desc", search } = request.query;
    const sortOrder = order === "desc" ? -1 : 1;

    let pipeline = [];

    // Verwende eine Regex-Suche, wenn der Suchparameter vorhanden ist
    if (search) {
      // Erstelle eine case-insensitive Regex-Suche
      pipeline.push({ $match: { title: { $regex: search, $options: "i" } } });
    }

    let queryObj = {};
    Object.keys(request.query).forEach((key) => {
      if (!["sort", "order", "duration", "search"].includes(key)) {
        if (key === "author") {
          queryObj[key] = new mongoose.Types.ObjectId(request.query[key]);
        } else {
          queryObj[key] = { $in: request.query[key].split(",") };
        }
      }
    });

    //Filtern der Rezepte, damit keine fremden, privaten Rezepte angezeigt werden:
    pipeline.push({
      $match: {
        $or: [
          { public: { $ne: false } }, // Das Rezept ist öffentlich oder hat keine public-Property
          { author: userId }, // Der aktuelle Benutzer ist der Autor
        ],
      },
    });

    // Hinzufügen eines kombinierten $match-Schritts für alle anderen Filter
    if (Object.keys(queryObj).length > 0) {
      pipeline.push({ $match: queryObj });
    }

    // Dauer-Filter integrieren, wenn vorhanden
    if (request.query.duration) {
      const durationFilter = handleDurationFilter(request.query.duration);
      if (durationFilter.$or.length > 0) {
        pipeline.push({ $match: durationFilter });
      }
    }

    // Hinzufügen der $addFields und $sort Schritte
    if (sort === "title") {
      pipeline.push({
        $addFields: {
          lowerCaseTitle: { $toLower: "$title" },
        },
      });

      pipeline.push({
        $sort: { lowerCaseTitle: sortOrder },
      });
    } else {
      pipeline.push({ $sort: { [sort]: sortOrder } });
    }

    const recipes = await Recipe.aggregate(pipeline);

    if (!recipes.length) {
      return response.status(200).json([]);
    }
    response.status(200).json(recipes);
  } else if (request.method === "POST") {
    try {
      const recipeData = {
        ...request.body,
        likes: request.body.likes || 0,
      };
      const recipe = new Recipe(recipeData);
      await recipe.save();
      return response
        .status(201)
        .json({ status: "Recipe created.", id: recipe._id });
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
