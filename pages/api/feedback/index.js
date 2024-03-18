import dbConnect from "../../../db/connect";
import Feedback from "../../../db/models/Feedback";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    try {
      const feedback = new Feedback(request.body);
      await feedback.save();
      return response.status(201).json({ status: "feedback created." });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
