import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import VideoCard from '../components/VideoCard/VideoCard';
import { channelAPI, videoAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Channel.css';

const Channel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'All'
  });

  useEffect(() => {
    if (id) {
      fetchChannel();
    } else if (user) {
      fetchUserChannel();
    } else {
      // No user, redirect to sign in
      navigate('/signin');
    }
  }, [id, user, navigate]);

  const fetchChannel = async () => {
    try {
      const response = await channelAPI.getById(id);
      setChannel(response.data);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserChannel = async () => {
    try {
      const response = await channelAPI.getByOwner(user.userId);
      setChannel(response.data);
      setVideos(response.data.videos || []);
      navigate(`/channel/${response.data._id}`, { replace: true });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user channel:', error);
      // User doesn't have a channel yet
      setChannel(null);
      setVideos([]);
      setLoading(false);
    }
  };

  const handleCreateChannel = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const channelName = prompt('Enter channel name:');
    if (!channelName) return;

    try {
      const response = await channelAPI.create({ channelName });
      setChannel(response.data);
      navigate(`/channel/${response.data._id}`, { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating channel');
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    if (!channel) return;

    try {
      const response = await videoAPI.create({
        ...videoForm,
        channelId: channel._id
      });
      setVideos([response.data, ...videos]);
      setShowCreateVideo(false);
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: 'All'
      });
      fetchChannel();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating video');
    }
  };

  const handleUpdateVideo = async (videoId) => {
    try {
      await videoAPI.update(videoId, videoForm);
      setShowEditVideo(null);
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: 'All'
      });
      fetchChannel();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await videoAPI.delete(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
      fetchChannel();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting video');
    }
  };

  const startEdit = (video) => {
    setShowEditVideo(video._id);
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category
    });
  };

  const isOwner = user && channel && channel.owner._id === user.userId;

  if (loading) {
    return (
      <div className="channel-page">
        <Header />
        <div className="loading">Loading channel...</div>
      </div>
    );
  }

  if (!channel && user) {
    return (
      <div className="channel-page">
        <Header />
        <div className="channel-container">
          <div className="no-channel">
            <h2>You don't have a channel yet</h2>
            <button onClick={handleCreateChannel} className="create-channel-btn">
              Create Channel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="channel-page">
        <Header />
        <div className="error">Channel not found</div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <Header />
      <div className="channel-container">
        <div className="channel-banner">
          <img src={channel.channelBanner} alt={channel.channelName} />
        </div>

        <div className="channel-header">
          <div className="channel-info">
            <div className="channel-avatar-large">
              <img
                src={channel.owner?.avatar || 'https://ui-avatars.com/api/?name=Channel&background=random'}
                alt={channel.channelName}
              />
            </div>
            <div>
              <h1>{channel.channelName}</h1>
              <p className="channel-subscribers">{channel.subscribers} subscribers</p>
              <p className="channel-description">{channel.description}</p>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="channel-actions">
            <button
              onClick={() => setShowCreateVideo(true)}
              className="create-video-btn"
            >
              Upload Video
            </button>
          </div>
        )}

        {showCreateVideo && (
          <div className="video-form-modal">
            <div className="video-form-card">
              <h2>Upload New Video</h2>
              <form onSubmit={handleCreateVideo}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Video URL *</label>
                  <input
                    type="url"
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL *</label>
                  <input
                    type="url"
                    value={videoForm.thumbnailUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Create Video</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateVideo(false);
                      setVideoForm({
                        title: '',
                        description: '',
                        videoUrl: '',
                        thumbnailUrl: '',
                        category: 'All'
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="channel-videos">
          <h2>Videos</h2>
          {videos.length === 0 ? (
            <div className="no-videos">No videos yet</div>
          ) : (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video._id} className="video-card-wrapper">
                  <VideoCard video={video} />
                  {isOwner && (
                    <div className="video-card-actions">
                      <button
                        onClick={() => startEdit(video)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showEditVideo && (
          <div className="video-form-modal">
            <div className="video-form-card">
              <h2>Edit Video</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateVideo(showEditVideo);
              }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL *</label>
                  <input
                    type="url"
                    value={videoForm.thumbnailUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Update Video</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditVideo(null);
                      setVideoForm({
                        title: '',
                        description: '',
                        videoUrl: '',
                        thumbnailUrl: '',
                        category: 'All'
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
