# Cloudinary Setup Instructions

## Overview
Your messaging app now uses **Cloudinary** for image uploads instead of local disk storage. This allows images to work properly on Vercel's serverless platform.

## What Was Changed

### Backend Changes:
1. **`middlewares/upload.js`** - Now uses Cloudinary storage instead of disk storage
2. **`routes/uploadRoutes.js`** - Updated to return Cloudinary URLs

### Frontend Changes:
1. **`components/messages/MessageInput.jsx`** - Image preview now shows actual uploaded image
2. **`components/messages/Message.jsx`** - Displays Cloudinary image URLs correctly

## Setup Steps

### 1. Create Cloudinary Account (FREE)

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email
4. Login to your dashboard

### 2. Get Your Credentials

From your Cloudinary Dashboard, copy these three values:
- **Cloud Name** (e.g., `dxxxxx`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### 3. Update Local Environment

Add these to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your **backend** project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your api key
   - `CLOUDINARY_API_SECRET` = your api secret
5. Click **Save**
6. **Redeploy** your backend (it will automatically redeploy when you push to git)

### 5. Deploy Changes

```bash
# From the backend directory
cd backend
git add .
git commit -m "Add Cloudinary for image uploads"
git push

# From the frontend directory
cd ../frontend
git add .
git commit -m "Update image display for Cloudinary"
git push
```

## How It Works Now

1. User selects an image in the chat
2. Image is uploaded to **Cloudinary** (cloud storage)
3. Cloudinary returns a secure URL (e.g., `https://res.cloudinary.com/...`)
4. This URL is saved in your MongoDB database
5. When displaying messages, the image loads from Cloudinary

## Benefits

✅ Works on Vercel serverless
✅ Automatic image optimization
✅ Fast CDN delivery worldwide
✅ Free tier: 25GB storage + 25GB bandwidth/month
✅ No server disk space needed

## Testing

After deployment:
1. Login to your app
2. Select a user to chat with
3. Click the image icon 📷
4. Upload an image
5. Send the message
6. Image should appear in the chat

## Troubleshooting

### Images not uploading?
- Check Vercel environment variables are set correctly
- Check browser console for errors
- Verify Cloudinary credentials in your dashboard

### Images not displaying?
- Check the imageUrl in your database (should be a full Cloudinary URL)
- Open the image URL directly in browser to verify it exists
- Check browser console for CORS errors

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 2.5 credits per month

This is more than enough for most small to medium apps!

