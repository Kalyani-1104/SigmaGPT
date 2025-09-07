import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true   
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const threadSchema = new Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    message: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Thread", threadSchema);

