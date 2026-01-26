# YouTube Clone - MERN Stack Project

A full-stack YouTube clone application built with MongoDB, Express, React, and Node.js (MERN stack). This project demonstrates a complete video sharing platform with user authentication, video management, channel management, and comment functionality.

## Features

### Frontend (React)
- **Home Page**: YouTube-style header, toggleable sidebar, filter buttons, and video grid
- **User Authentication**: Registration and login with JWT-based authentication
- **Search & Filter**: Search videos by title and filter by category (8 categories)
- **Video Player Page**: Watch videos with like/dislike buttons and full comment CRUD
- **Channel Page**: Create channels, upload videos, and manage videos (CRUD operations)
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices

### Backend (Node.js, Express)
- **RESTful API**: Well-structured API endpoints for all features
- **MongoDB Integration**: Proper data modeling and relationships
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware for protecting authenticated routes

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with responsive design

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youtube_clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube_clone
JWT_SECRET=your_secret_key_here_change_in_production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in the `.env` file.

### 5. Seed the Database (Optional)

To populate the database with sample data, you can use MongoDB Compass or run the seed script:

```bash
cd backend
node seed.js
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
youtube_clone/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Video.js
│   │   ├── Channel.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   ├── channels.js
│   │   └── comments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── VideoCard/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   └── Channel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos (with optional search and filter)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)
- `POST /api/videos/:id/like` - Like video (protected)
- `POST /api/videos/:id/dislike` - Dislike video (protected)

### Channels
- `GET /api/channels` - Get all channels
- `GET /api/channels/:id` - Get single channel
- `GET /api/channels/owner/:userId` - Get channel by owner
- `POST /api/channels` - Create channel (protected)
- `PUT /api/channels/:id` - Update channel (protected)

### Comments
- `GET /api/comments/video/:videoId` - Get comments for a video
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

## Usage Guide

### User Registration & Login
1. Click "Sign In" in the header
2. Register with username, email, and password
3. After registration, you'll be redirected to login
4. Login with your email and password

### Creating a Channel
1. Sign in to your account
2. Navigate to "Your Channel" from the sidebar or header
3. Create a channel by entering a channel name

### Uploading Videos
1. Go to your channel page
2. Click "Upload Video"
3. Fill in the video details:
   - Title (required)
   - Description
   - Video URL (YouTube embed URL format: `https://www.youtube.com/embed/VIDEO_ID`)
   - Thumbnail URL
   - Category
4. Click "Create Video"

### Managing Videos
- **Edit**: Click "Edit" on any video card in your channel
- **Delete**: Click "Delete" on any video card in your channel

### Watching Videos
1. Click on any video from the home page
2. Watch the video in the player
3. Like or dislike the video
4. Add comments, edit your comments, or delete your comments

### Search & Filter
- Use the search bar in the header to search videos by title
- Click filter buttons to filter videos by category
- Categories: All, Music, Gaming, Education, Entertainment, Sports, Technology, News

## Sample Data Format

### Video
```json
{
  "title": "Learn React in 30 Minutes",
  "description": "A quick tutorial to get started with React.",
  "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "thumbnailUrl": "https://example.com/thumbnails/react30min.png",
  "category": "Education",
  "views": 15200,
  "likes": 1023,
  "dislikes": 45
}
```

### User
```json
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "hashedPassword123",
  "avatar": "https://example.com/avatar/johndoe.png"
}
```

### Channel
```json
{
  "channelName": "Code with John",
  "description": "Coding tutorials and tech reviews by John Doe.",
  "channelBanner": "https://example.com/banners/john_banner.png",
  "subscribers": 5200
}
```

## Important Notes

- **Video URLs**: Use YouTube embed URLs in the format: `https://www.youtube.com/embed/VIDEO_ID`
- **Authentication**: JWT tokens are stored in localStorage
- **Protected Routes**: Some routes require authentication (indicated in API documentation)
- **ES Modules**: The project uses ES6 import/export syntax throughout
- **Vite**: Frontend uses Vite instead of Create React App

## Development

### Code Structure
- Clean separation of concerns
- Reusable components
- Context API for state management
- RESTful API design
- Proper error handling

### Best Practices
- Input validation on both frontend and backend
- Password hashing with bcrypt
- JWT token expiration
- Protected API routes
- Responsive CSS design

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env` file
- For MongoDB Atlas, whitelist your IP address

### CORS Issues
- Backend CORS is configured to allow frontend origin
- Check if both servers are running on correct ports

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT_SECRET in backend `.env` file
- Verify token expiration

## Future Enhancements

- Video upload functionality
- User subscriptions
- Playlists
- Video recommendations
- Nested comments
- Video analytics
- User profiles

## License

This project is created for educational purposes.

## Author

YouTube Clone - MERN Stack Capstone Project

---

**Note**: This is a capstone project demonstrating full-stack development skills with the MERN stack. For production use, additional security measures, error handling, and optimizations would be required.
