import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all videos (with optional search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar')
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channelId')
      .populate('uploader', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create video (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;

    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Verify channel ownership
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this channel' });
    }

    const video = new Video({
      title,
      description: description || '',
      videoUrl,
      thumbnailUrl,
      category: category || 'All',
      channelId,
      uploader: req.user._id
    });

    await video.save();

    // Add video to channel
    channel.videos.push(video._id);
    await channel.save();

    const populatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar');

    res.status(201).json(populatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update video (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this video' });
    }

    const { title, description, thumbnailUrl, category } = req.body;

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (category) video.category = category;

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar');

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete video (protected)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this video' });
    }

    // Remove from channel
    const channel = await Channel.findById(video.channelId);
    if (channel) {
      channel.videos = channel.videos.filter(
        v => v.toString() !== video._id.toString()
      );
      await channel.save();
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like video
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dislike video
router.post('/:id/dislike', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.dislikes += 1;
    await video.save();

    res.json({ dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
