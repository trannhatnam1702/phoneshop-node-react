import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, /*require: true, unique: true*/ },
    slug: { type: String, lowercase: true },
    image: { data: Buffer, contentType: String },
})

export default mongoose.model('Category', categorySchema);
