import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending', path: '/?category=Trending' },
    { icon: '📺', label: 'Subscriptions', path: '/?category=Subscriptions' },
    { icon: '📚', label: 'Library', path: '/?category=Library' },
    { icon: '📜', label: 'History', path: '/?category=History' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
          {user && (
            <Link
              to={`/channel/${user.channels?.[0] || ''}`}
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">📹</span>
              <span className="sidebar-label">Your Channel</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
