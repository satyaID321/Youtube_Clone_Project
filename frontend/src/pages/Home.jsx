import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import VideoCard from "../components/VideoCard/VideoCard";
import { videoAPI } from "../utils/api";
import "./Home.css";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Entertainment",
  "Sports",
  "Technology",
  "News",
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const selectedCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== "All")
        params.category = selectedCategory;

      const response = await videoAPI.getAll(params);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    if (searchQuery) {
      newParams.set("search", searchQuery);
    }
    setSearchParams(newParams);
  };

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="home">
      <Header onMenuClick={handleMenuClick} />
      <div className="home-container">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
        >
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="no-videos">No videos found</div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
