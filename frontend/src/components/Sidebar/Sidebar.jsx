import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending', path: '/?category=Trending' },
    { icon: '📺', label: 'Subscriptions', path: '/?category=Subscriptions' },
    { icon: '📚', label: 'Library', path: '/?category=Library' },
    { icon: '📜', label: 'History', path: '/?category=History' },
  ];

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (!isDesktop) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && !isDesktop && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      <aside className={`sidebar ${isOpen || isDesktop ? 'open' : ''} ${isCollapsed && isDesktop ? 'collapsed' : ''}`}>
        {isDesktop && (
          <button className="sidebar-toggle" onClick={onToggleCollapse}>
            {isCollapsed ? (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
              </svg>
            )}
          </button>
        )}
        <div className="sidebar-content">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-item"
              onClick={handleItemClick}
              title={isCollapsed && isDesktop ? item.label : ''}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {(!isCollapsed || !isDesktop) && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
          {user && (
            <Link
              to={user.channels?.[0] ? `/channel/${user.channels[0]}` : '/channel'}
              className="sidebar-item"
              onClick={handleItemClick}
              title={isCollapsed && isDesktop ? 'Your Channel' : ''}
            >
              <span className="sidebar-icon">📹</span>
              {(!isCollapsed || !isDesktop) && <span className="sidebar-label">Your Channel</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
