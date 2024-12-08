import { configDotenv } from "dotenv";
import sharp from "sharp";
import { pipeline, ViTFeatureExtractor } from "@huggingface/transformers";  // Use ViTFeatureExtractor
import fs from "fs";
import { fileURLToPath } from "url";  // Correct import to handle import.meta.url
import { dirname, resolve } from "path";  // Correct path imports

configDotenv();

export const searchController = {
    embeddingImage: async (req, res, next) => {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const imagePath = resolve(__dirname, 'temp_image.png'); // Absolute path for temp image

            // Resize the image and save it temporarily
            await sharp(req.file.buffer)
                .resize(224, 224)  
                .toFormat("png")  
                .toFile(imagePath);

            // Manually load the feature extractor for ViT
            const featureExtractor = await ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224-in21k');

            // Read the image and process it using the feature extractor
            const image = fs.readFileSync(imagePath);

            console.log("Image loaded successfully:", image);  // Debugging step: log the image buffer

            // Process the image using the feature extractor
            const inputs = await featureExtractor(image, { return_tensors: 'pt' });

            // Log the output to inspect its structure
            console.log("Feature Extractor Outputs:", inputs);

            // Ensure the inputs are processed properly (check for valid response)
            if (!inputs || !inputs.pixel_values) {
                throw new Error('Feature extractor did not return valid input.');
            }

            // Initialize the Hugging Face image classification pipeline for embedding extraction
            const imageFeatureExtractor = pipeline('image-classification', 'google/vit-base-patch16-224-in21k', {
                useAuthToken: process.env.HUGGING_FACE_API_KEY,
            });

            // Get the classification results
            const result = await imageFeatureExtractor(inputs);
            console.log("Pipeline Results:", result);  // Log the result to check the output

            // Optionally, you can extract embeddings from the model response
            if (result && result[0] && result[0].embedding) {
                req.embedding = result[0].embedding;
            }

            // Clean up temporary image file
            fs.unlinkSync(imagePath);  // Remove the temp image after processing

            next(); 
        } catch (error) {
            console.error("Error embedding image:", error.message);
            return res.status(500).json({ error: "Failed to process the image" });
        }
    },

    sendImage: async (req, res) => {
        if (!req.embedding) {
            return res.status(400).json({ error: "Embedding not found" });
        }

        try {
            const queryVector = req.embedding;

            const results = await Product.aggregate([
                {
                    $search: {
                        knnBeta: {
                            vector: queryVector,
                            path: "embedding",
                            k: 5, 
                        },
                    },
                },
            ]);

            return res.status(200).json({
                message: "Search successful",
                results,
            });
        } catch (err) {
            console.error("Error handling image:", err.message);
            return res.status(500).json({ error: "Failed to handle the image" });
        }
    },
};
