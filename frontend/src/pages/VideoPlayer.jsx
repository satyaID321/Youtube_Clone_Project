import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import { videoAPI, commentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getById(id);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getByVideo(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    try {
      await videoAPI.like(id);
      fetchVideo();
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    try {
      await videoAPI.dislike(id);
      fetchVideo();
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!commentText.trim()) return;

    try {
      await commentAPI.create({ videoId: id, text: commentText });
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await commentAPI.update(commentId, { text: editText });
      setEditingComment(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.delete(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="video-player-page">
        <Header />
        <div className="loading">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-player-page">
        <Header />
        <div className="error">Video not found</div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <Header />
      <div className="video-player-container">
        <div className="video-main">
          <div className="video-wrapper">
            <iframe
              src={video.videoUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            />
          </div>

          <div className="video-info-section">
            <h1 className="video-title">{video.title}</h1>
            <div className="video-meta-section">
              <div className="video-stats">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDate(video.uploadDate)}</span>
              </div>
              <div className="video-actions">
                <button className="action-btn" onClick={handleLike}>
                  <span>👍</span> {formatViews(video.likes)}
                </button>
                <button className="action-btn" onClick={handleDislike}>
                  <span>👎</span> {formatViews(video.dislikes)}
                </button>
              </div>
            </div>

            <div className="channel-info">
              <Link to={`/channel/${video.channelId?._id}`} className="channel-link">
                <img
                  src={video.uploader?.avatar || 'https://ui-avatars.com/api/?name=Channel&background=random'}
                  alt={video.channelId?.channelName}
                  className="channel-avatar"
                />
                <div>
                  <div className="channel-name">{video.channelId?.channelName || 'Unknown Channel'}</div>
                  <div className="channel-subscribers">
                    {video.channelId?.subscribers || 0} subscribers
                  </div>
                </div>
              </Link>
            </div>

            <div className="video-description">
              <p>{video.description || 'No description available'}</p>
            </div>
          </div>

          <div className="comments-section">
            <h2>{comments.length} Comments</h2>

            {user && (
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="comment-input-wrapper">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="comment-avatar"
                  />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="comment-input"
                  />
                </div>
                <button type="submit" className="comment-submit-btn">
                  Comment
                </button>
              </form>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <img
                    src={comment.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                    alt={comment.userId?.username}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    {editingComment === comment._id ? (
                      <div className="comment-edit">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="comment-edit-input"
                        />
                        <div className="comment-edit-actions">
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            className="comment-save-btn"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditText('');
                            }}
                            className="comment-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="comment-header">
                          <span className="comment-author">{comment.userId?.username || 'Anonymous'}</span>
                          <span className="comment-date">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        {user && user.userId === comment.userId?._id && (
                          <div className="comment-actions">
                            <button
                              onClick={() => {
                                setEditingComment(comment._id);
                                setEditText(comment.text);
                              }}
                              className="comment-edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="comment-delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
