import express from "express";
import Thread from "../models/threds.js";
import getOpenAIAPIResponce from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "New Title1"
        });

        const responce = await thread.save()
        res.send(responce);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB!" });
    }
});

//get all threads
router.get("/thread", async (req, res) => {
    try {
        const responce = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(responce);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB!" });
    }
});

//get single chat
router.get("/thread/:threadId", async (req, res) => {
    let { threadId } = req.params;
    
    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404).json({ error: "Thread not found!" });
        }

        res.json(thread);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get chat!" });
    }
});

//delete chat
router.delete("/thread/:threadId", async (req, res) => {
    let { threadId } = req.params;
    
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found!" });
        }

        res.status(200).json({ success: "Thread Deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get chat!" });
    }
});

//chat route
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields!" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                message: [{ content: message, role: "user" }]
            });
        } else {
            thread.message.push({ content: message, role: "user" });
        }

        const apiResponse = await getOpenAIAPIResponce(message);

        thread.message.push({ content: apiResponse, role: "assistant" });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: apiResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!!" });
    }
});


export default router;