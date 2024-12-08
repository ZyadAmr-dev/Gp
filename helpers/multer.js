import multer from "multer";

export function fileUpload() {

    const storage = multer.memoryStorage();

    const multerUpload = multer({storage}) // contains middle wares
    return multerUpload
}