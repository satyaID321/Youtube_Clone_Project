# Quick Setup Guide

## Prerequisites
- Node.js (v16+) installed
- MongoDB running locally or MongoDB Atlas account

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube_clone
JWT_SECRET=your_super_secret_jwt_key_change_this
```

### 3. Seed Database (Optional but Recommended)

```bash
cd backend
node seed.js
```

This will create:
- 3 sample users
- 3 sample channels
- 8 sample videos
- Sample comments

**Login credentials:**
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`
- Email: `tech@example.com`, Password: `password123`

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### 5. Access the Application

Open your browser and navigate to: http://localhost:3000

## Testing the Application

1. **Sign Up/Login:**
   - Click "Sign In" in the header
   - Register a new account or login with sample credentials

2. **Create Channel:**
   - After login, go to "Your Channel" from sidebar
   - Create a channel

3. **Upload Video:**
   - On your channel page, click "Upload Video"
   - Fill in video details
   - Use YouTube embed URL format: `https://www.youtube.com/embed/VIDEO_ID`

4. **Watch Videos:**
   - Browse videos on home page
   - Click on any video to watch
   - Like/dislike and add comments

5. **Search & Filter:**
   - Use search bar to find videos by title
   - Click filter buttons to filter by category

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (or start MongoDB service)
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure IP is whitelisted

### Port Already in Use
- Change PORT in `backend/.env` if 5000 is taken
- Change port in `frontend/vite.config.js` if 3000 is taken

### CORS Errors
- Ensure backend is running before frontend
- Check that backend CORS is configured correctly

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token expiration (default: 7 days)

## Project Structure

```
youtube_clone/
├── backend/          # Node.js/Express backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # React Context
│       └── utils/       # Utility functions
└── README.md         # Full documentation
```

## Features Checklist

✅ User Registration & Login (JWT)
✅ Home Page with Video Grid
✅ Toggleable Sidebar
✅ Search Functionality
✅ Category Filters (8 categories)
✅ Video Player Page
✅ Like/Dislike Buttons
✅ Comment CRUD Operations
✅ Channel Page
✅ Video CRUD Operations
✅ Responsive Design

## Next Steps

1. Explore the codebase
2. Test all features
3. Customize styling if needed
4. Add more videos through the UI
5. Test on different devices for responsiveness

Happy coding! 🚀
