import Document from '../models/document.model.js';
import User from '../models/user.model.js';
import cloudinaryInstance from '../utils/cloudinary.js';

export const uploadDocument = async (req, res) => {
    try {
        const { doc_name, doc_category, doc_owner_type, userId } = req.body;
        
        // Use user ID from req.user if populated by auth middleware, else fallback to req.body
        const uId = req.user?._id || userId;
        
        let userRecord = null;
        if (uId) {
            userRecord = await User.findById(uId);
            if (!userRecord) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }
        
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
            // req.file.filename gives the file name. We serve it statically at /uploads/
            file_path = `/uploads/${req.file.filename}`;
        }

        // Create the document record in the database
        const newDocument = new Document({
            doc_name: doc_name || req.file.originalname,
            file_path,
            mime_type,
            doc_category,
            doc_owner_type,
            user: uId || undefined
        });

        await newDocument.save();

        if (userRecord) {
            userRecord.documents.push(newDocument._id);
            await userRecord.save();
        }

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: newDocument
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ success: false, message: 'Server error during document upload' });
    }
};

export const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching documents' });
    }
};
