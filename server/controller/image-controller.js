import mongoose from "mongoose";

let gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "photos",
  });
  console.log("GridFSBucket initialized");
});

// Upload Image to GridFS
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      const backendURL = process.env.BACKEND_API_URL || "http://localhost:8080";
      const imageUrl = `${backendURL}/file/${uploadStream.id.toString()}`;
      return res.status(200).json({ url: imageUrl });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message });
    });
  } catch (error) {
    console.error("Server error in uploadImage:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getImage = async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(503).json({ error: "Storage not ready yet" });
    }

    let fileId;
    try {
      fileId = new mongoose.Types.ObjectId(req.params.filename);
    } catch (err) {
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const downloadStream = gridfsBucket.openDownloadStream(fileId);
    downloadStream.on("error", (err) => {
      console.error("Download error:", err);
      res.status(404).json({ error: "File not found" });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: error.message });
  }
};
