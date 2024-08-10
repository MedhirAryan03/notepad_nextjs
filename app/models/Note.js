// app/models/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
