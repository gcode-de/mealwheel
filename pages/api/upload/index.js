import cloudinary from "next-cloudinary";

export default async function handler(request, response) {
  if (request.method === "POST") {
    const form = formidable({ multiples: true });
    const [fields, files] = await form.parse(request);
    const file = files.recipeImage?.[0];
    const { newFilename, filepath } = file || {};

    try {
      const result = await cloudinary.v2.uploader.upload(filepath, {
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
  if (request.method === "DELETE") {
    const public_id = request.query.id;
    try {
      await cloudinary.v2.uploader.destroy(public_id);
      response.status(200).json({ message: "Image removed from Cloudinary" });
    } catch (error) {
      console.error("Error deleting from Cloudinary: ", error);
      response.status(500).json({ error: "Error deleting from Cloudinary" });
    }
  }
}
