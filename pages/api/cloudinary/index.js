import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

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
  if (request.method === "POST") {
    const form = formidable({ multiples: true });
    const [fields, files] = await form.parse(request); //fields nicht löschen, wird für irgendwas gebraucht

    if (!files) {
      return response.status(400).json({ error: "No file uploaded" });
    }
    const file = files.file?.[0];

    const { newFilename, filepath } = file;
    if (!newFilename || !filepath) {
      return response.status(400).json({ error: "File data incomplete" });
    }

    try {
      const result = await cloudinary.uploader.upload(filepath, {
        public_id: newFilename,
        folder: "recipes",
      });

      response
        .status(200)
        .json({ imageUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("Error uploading to Cloudinary: ", error);
      response.status(500).json({ error: "Error uploading to Cloudinary" });
    }
  }
  if (request.method === "PUT") {
    const { from_public_id, to_public_id } = request.query;

    try {
      cloudinary.uploader.rename(from_public_id, to_public_id);
      //überprüfe response
      response
        .status(200)
        .json({ imageUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("Error editing from Cloudinary: ", error);
      response.status(500).json({ error: "Error editing from Cloudinary" });
    }
  }
}
