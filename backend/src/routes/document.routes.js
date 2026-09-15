import { Router } from 'express';
import { uploadDocument, getAllDocuments } from '../controllers/document.controller.js';
import upload from '../utils/upload.js';

const router = Router();

// Upload a document
router.post('/upload', upload.single('file'), uploadDocument);

// Get all documents
router.get('/', getAllDocuments);

export default router;
