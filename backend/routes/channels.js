import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// get all channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate('owner', 'username avatar')
      .populate('videos');

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// get single channel
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: {
          path: 'uploader',
          select: 'username avatar'
        }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// get channel by owner
router.get('/owner/:userId', async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.params.userId })
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: {
          path: 'uploader',
          select: 'username avatar'
        }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// create chanel
router.post('/', authenticate, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // check if user already has channel
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: 'You already have a channel' });
    }

    const channel = new Channel({
      channelName,
      description: description || '',
      channelBanner: channelBanner || 'https://via.placeholder.com/1280x360',
      owner: req.user._id
    });

    await channel.save();

    // add channel to user
    req.user.channels.push(channel._id);
    await req.user.save();

    const populatedChannel = await Channel.findById(channel._id)
      .populate('owner', 'username avatar');

    res.status(201).json(populatedChannel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// update the channel
router.put('/:id', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this channel' });
    }

    const { channelName, description, channelBanner } = req.body;

    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner) channel.channelBanner = channelBanner;

    await channel.save();

    const updatedChannel = await Channel.findById(channel._id)
      .populate('owner', 'username avatar')
      .populate('videos');

    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
