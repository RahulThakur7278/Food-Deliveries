import Document from '../models/document.model.js';
import User from '../models/user.model.js';

export const createDocument = async (documentData, userId) => {
    let userRecord = null;
    
    if (userId) {
        userRecord = await User.findById(userId);
        if (!userRecord) {
            throw new Error('User not found');
        }
    }

    const newDocument = new Document(documentData);
    await newDocument.save();

    if (userRecord) {
        userRecord.documents.push(newDocument._id);
        await userRecord.save();
    }

    return newDocument;
};

export const fetchAllDocuments = async () => {
    return await Document.find().sort({ createdAt: -1 });
};
