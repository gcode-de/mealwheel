import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});
export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(request, response) {
  const { id } = request.query;
  if (request.method === "DELETE") {
    const public_id = request.query.id;
    try {
      await cloudinary.uploader.destroy(id);
      response.status(200).json({ message: "Image removed from Cloudinary" });
    } catch (error) {
      console.error("Error deleting from Cloudinary: ", error);
      response.status(500).json({ error: "Error deleting from Cloudinary" });
    }
  }
}
