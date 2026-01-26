import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, 'Channel name is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  channelBanner: {
    type: String,
    default: 'https://via.placeholder.com/1280x360'
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
