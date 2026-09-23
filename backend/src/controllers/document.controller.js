import cloudinaryInstance from '../utils/cloudinary.js';
import { createDocument, fetchAllDocuments } from '../services/document.service.js';

export const uploadDocument = async (req, res) => {
    try {
        const { doc_name, doc_category, doc_owner_type, userId } = req.body;
        
        // Use user ID from req.user if populated by auth middleware, else fallback to req.body
        const uId = req.user?._id || userId;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        let file_path = '';
        const mime_type = req.file.mimetype;

        // Check environment to determine storage strategy
        if (process.env.NODE_ENV === 'production') {
            // In production, upload to Cloudinary (which also deletes the local file)
            const cloudinaryResult = await cloudinaryInstance(req.file.path);
            if (!cloudinaryResult) {
                return res.status(500).json({ success: false, message: 'Failed to upload to Cloudinary' });
            }
            file_path = cloudinaryResult.secure_url;
        } else {
            // In development, keep the file in the local uploads directory
            file_path = `/uploads/${req.file.filename}`;
        }

        // Prepare document data
        const documentData = {
            doc_name: doc_name || req.file.originalname,
            file_path,
            mime_type,
            doc_category,
            doc_owner_type,
            user: uId || undefined
        };

        // Call service to handle DB logic
        const newDocument = await createDocument(documentData, uId);

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: newDocument
        });

    } catch (error) {
        console.error('Upload document error:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server error during document upload' });
    }
};

export const getAllDocuments = async (req, res) => {
    try {
        const documents = await fetchAllDocuments();
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching documents' });
    }
};
