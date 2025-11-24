import React from 'react';
import './VideoPage.css';

const VideoPage = () => {
  return (
    <div className="video-page">
      <section className="video-section">
        <h2>📺 精彩影音專區</h2>
        <div className="video-grid">
          <div className="video-item">
            <h3>企業聯賽精華</h3>
            <iframe 
              width="100%" 
              height="250" 
              src="https://www.youtube.com/embed/gT4I06H6I7I" 
              title="排球精華" 
              frameBorder="0" 
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-item">
            <h3>國際賽事剪輯</h3>
            <iframe 
              width="100%" 
              height="250" 
              src="https://www.youtube.com/embed/blAaDmRBjHk?si=1hWlY6hD9w6cQ4kF" 
              title="YouTube video player" 
              frameBorder="0" 
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-item">
            <h3>球員/戰術分析</h3>
            <div className="placeholder">待新增影片...</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoPage;