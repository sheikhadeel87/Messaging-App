import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET,
         { expiresIn: '15d' });
    
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: 'none', // Allow cross-domain cookies (required for Vercel → Ngrok)
        secure: true, // Required when sameSite is 'none' (HTTPS only)
    });
    
    return token;
};

export default generateTokenAndSetCookie;