import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessage controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.userId;

        console.log('Getting messages between:', senderId, 'and', userToChatId);

        // Convert to ObjectId if they're strings
        const senderObjectId = mongoose.Types.ObjectId.isValid(senderId) 
            ? new mongoose.Types.ObjectId(senderId) 
            : senderId;
        const receiverObjectId = mongoose.Types.ObjectId.isValid(userToChatId) 
            ? new mongoose.Types.ObjectId(userToChatId) 
            : userToChatId;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderObjectId, receiverObjectId] },
        }).populate('messages');

        console.log('Conversation found:', conversation ? 'Yes' : 'No');
        if (conversation) {
            console.log('Number of messages:', conversation.messages.length);
        }

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (err) {
        console.log("Error in getMessages controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

