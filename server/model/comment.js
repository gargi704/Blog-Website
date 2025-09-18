import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        required: true
    }
});

const comment = mongoose.model('comment', CommentSchema);

export default comment;