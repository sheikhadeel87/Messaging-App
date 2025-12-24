import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        if (!message && !imageUrl) {
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
            imageUrl,
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

// Delete message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        // Find the message
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        // Remove message from conversation
        await Conversation.updateOne(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        // Delete the message
        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.log("Error in deleteMessage controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

// Edit message
export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message: newMessageText } = req.body;
        const userId = req.userId;

        if (!newMessageText || !newMessageText.trim()) {
            return res.status(400).json({ error: "Message text is required" });
        }

        // Find the message
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is the sender
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }

        // Update the message
        message.message = newMessageText.trim();
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        res.status(200).json(message);
    } catch (err) {
        console.log("Error in editMessage controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

