import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        // Find all conversations where user is a participant
        const conversations = await Conversation.find({
            participants: userId,
        })
        .populate('participants', '-password') // Populate user details except password
        .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 }, limit: 1 } // Get only the latest message
        })
        .sort({ updatedAt: -1 }); // Sort by most recently updated

        // Format the response
        const formattedConversations = conversations.map(conversation => {
            // Get the other participant (not the current user)
            const otherParticipant = conversation.participants.find(
                participant => participant._id.toString() !== userId
            );

            // Get the latest message
            const latestMessage = conversation.messages[0] || null;

            return {
                _id: conversation._id,
                user: otherParticipant,
                latestMessage: latestMessage ? {
                    message: latestMessage.message,
                    createdAt: latestMessage.createdAt,
                    senderId: latestMessage.senderId
                } : null,
                updatedAt: conversation.updatedAt
            };
        });

        res.status(200).json(formattedConversations);
    } catch (err) {
        console.log("Error in getConversations controller:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};
