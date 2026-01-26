import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  const formatDate = (date) => {
    const uploadDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - uploadDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnailUrl} alt={video.title} />
        <div className="video-duration">10:30</div>
      </div>
      <div className="video-info">
        <div className="video-channel-avatar">
          <img
            src={video.uploader?.avatar || 'https://ui-avatars.com/api/?name=Channel&background=random'}
            alt={video.channelId?.channelName || 'Channel'}
          />
        </div>
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-channel">{video.channelId?.channelName || 'Unknown Channel'}</p>
          <div className="video-meta">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDate(video.uploadDate)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
