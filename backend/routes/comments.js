import express from 'express';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ timestamp: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create comment (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!videoId || !text) {
      return res.status(400).json({ message: 'Video ID and text are required' });
    }

    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = new Comment({
      videoId,
      userId: req.user._id,
      text
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update comment (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this comment' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comment (protected)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
