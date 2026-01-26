import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube_clone';

const sampleUsers = [
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  },
  {
    username: 'JaneSmith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
  },
  {
    username: 'TechGuru',
    email: 'tech@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Guru&background=random'
  }
];

const sampleChannels = [
  {
    channelName: 'Code with John',
    description: 'Coding tutorials and tech reviews by John Doe.',
    channelBanner: 'https://via.placeholder.com/1280x360/FF0000/FFFFFF?text=Code+with+John',
    subscribers: 5200
  },
  {
    channelName: 'Jane\'s Cooking Channel',
    description: 'Delicious recipes and cooking tips.',
    channelBanner: 'https://via.placeholder.com/1280x360/00FF00/FFFFFF?text=Jane+Cooking',
    subscribers: 3200
  },
  {
    channelName: 'Tech Reviews',
    description: 'Latest tech reviews and gadget unboxings.',
    channelBanner: 'https://via.placeholder.com/1280x360/0000FF/FFFFFF?text=Tech+Reviews',
    subscribers: 15000
  }
];

const sampleVideos = [
  {
    title: 'Learn React in 30 Minutes',
    description: 'A quick tutorial to get started with React. We cover components, props, state, and hooks.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FF0000/FFFFFF?text=React+Tutorial',
    category: 'Education',
    views: 15200,
    likes: 1023,
    dislikes: 45
  },
  {
    title: 'JavaScript Basics for Beginners',
    description: 'Learn the fundamentals of JavaScript programming.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FFFF00/000000?text=JavaScript+Basics',
    category: 'Education',
    views: 8500,
    likes: 450,
    dislikes: 12
  },
  {
    title: 'Top 10 Gaming Moments 2024',
    description: 'The most epic gaming moments from 2024.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/00FF00/FFFFFF?text=Gaming+Moments',
    category: 'Gaming',
    views: 25000,
    likes: 2100,
    dislikes: 89
  },
  {
    title: 'Best Music Hits 2024',
    description: 'The top music hits of 2024.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FF00FF/FFFFFF?text=Music+Hits',
    category: 'Music',
    views: 45000,
    likes: 3500,
    dislikes: 120
  },
  {
    title: 'Latest Tech News',
    description: 'Stay updated with the latest technology news.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/0000FF/FFFFFF?text=Tech+News',
    category: 'News',
    views: 12000,
    likes: 890,
    dislikes: 34
  },
  {
    title: 'Football Highlights',
    description: 'Best football moments from recent matches.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FFA500/FFFFFF?text=Football',
    category: 'Sports',
    views: 18000,
    likes: 1200,
    dislikes: 56
  },
  {
    title: 'Comedy Special',
    description: 'Funny moments and comedy sketches.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FF1493/FFFFFF?text=Comedy',
    category: 'Entertainment',
    views: 30000,
    likes: 2500,
    dislikes: 78
  },
  {
    title: 'AI Technology Explained',
    description: 'Understanding artificial intelligence and machine learning.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://via.placeholder.com/640x360/800080/FFFFFF?text=AI+Tech',
    category: 'Technology',
    views: 22000,
    likes: 1800,
    dislikes: 67
  }
];

const sampleComments = [
  {
    text: 'Great video! Very helpful.',
    timestamp: new Date('2024-09-21T08:30:00Z')
  },
  {
    text: 'Thanks for sharing this!',
    timestamp: new Date('2024-09-21T10:15:00Z')
  },
  {
    text: 'Amazing content! Keep it up!',
    timestamp: new Date('2024-09-21T12:00:00Z')
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create channels
    const channelsData = sampleChannels.map((channel, index) => ({
      ...channel,
      owner: users[index]._id
    }));
    const channels = await Channel.insertMany(channelsData);
    console.log(`Created ${channels.length} channels`);

    // Update users with channels
    for (let i = 0; i < users.length; i++) {
      users[i].channels.push(channels[i]._id);
      await users[i].save();
    }

    // Create videos
    const videosData = [];
    for (let i = 0; i < sampleVideos.length; i++) {
      const channelIndex = i % channels.length;
      videosData.push({
        ...sampleVideos[i],
        channelId: channels[channelIndex]._id,
        uploader: users[channelIndex]._id
      });
    }
    const videos = await Video.insertMany(videosData);
    console.log(`Created ${videos.length} videos`);

    // Update channels with videos
    for (let i = 0; i < videos.length; i++) {
      const channelIndex = i % channels.length;
      channels[channelIndex].videos.push(videos[i]._id);
      await channels[channelIndex].save();
    }

    // Create comments
    const commentsData = [];
    for (let i = 0; i < videos.length; i++) {
      const commentCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < commentCount; j++) {
        const userIndex = Math.floor(Math.random() * users.length);
        commentsData.push({
          ...sampleComments[j % sampleComments.length],
          videoId: videos[i]._id,
          userId: users[userIndex]._id
        });
      }
    }
    await Comment.insertMany(commentsData);
    console.log(`Created ${commentsData.length} comments`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    console.log('Email: tech@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
