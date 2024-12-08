import express from "express";
import { fileUpload } from "../helpers/multer.js";
import { searchController } from "../controllers/searchController.js";

const router = express.Router()

router.post('/search', fileUpload().single('image'), searchController.embeddingImage, searchController.sendImage)

export default router
