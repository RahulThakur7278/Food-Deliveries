import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({
    doc_name: { type: String },
    file_path: { type: String },
    mime_type: { type: String },
    doc_category: { type: String },
    doc_owner_type: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })


const Document = mongoose.model('Document', documentSchema)

export default Document