import React, { useState } from 'react';
import CommentSection from '../Comment/CommentSection';
import './MatchCard.css';

const MatchCard = ({ match, user }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' 或 'comments'

  const isUpcoming = match.status === 'upcoming';

  return (
    <div className={`match-card ${isUpcoming ? 'upcoming-card' : 'result-card'}`}>
      <div className="league-info">{match.league}</div>
      
      {/* Tab 切換按鈕 */}
      <div className="match-tabs">
        <button 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          📊 賽事資訊
        </button>
        <button 
          className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 留言揪團 ({match.commentCount || 0})
        </button>
      </div>

      {/* 賽事資訊 Tab */}
      {activeTab === 'info' && (
        <div className="match-body">
          {isUpcoming ? (
            <>
              <div className="team-vs">
                <span className="team-name">{match.homeTeam}</span>
                <span className="vs">VS</span>
                <span className="team-name">{match.awayTeam}</span>
              </div>
              <div className="time-location">
                <p>📅 <strong>時間：</strong> {match.date} {match.time}</p>
                <p>📍 <strong>地點：</strong> {match.location}</p>
              </div>
              <div className="match-footer">
                <button className="action-button primary">
                  🎫 購票資訊
                </button>
                <button className="action-button secondary">
                  👥 我要揪團
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="team-score team-home">
                <span className="team-name">{match.homeTeam} (主)</span>
                <span className="score-set">{match.homeScore}</span>
              </div>
              <div className="team-score team-away">
                <span className="team-name">{match.awayTeam} (客)</span>
                <span className="score-set">{match.awayScore}</span>
              </div>
              
              {match.setScores && (
                <div className="set-details">
                  <span className="label">局數：</span>
                  {match.setScores.map((set, index) => (
                    <React.Fragment key={index}>
                      <span className="set">{set}</span>
                      {index < match.setScores.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>
              )}
              
              {match.highlight && (
                <div className="match-highlight">
                  <span className="highlight-icon">⭐</span>
                  <p>{match.highlight}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 留言區 Tab */}
      {activeTab === 'comments' && (
        <div className="comments-tab-content">
          <CommentSection matchId={match.id} user={user} />
        </div>
      )}
    </div>
  );
};

export default MatchCard;