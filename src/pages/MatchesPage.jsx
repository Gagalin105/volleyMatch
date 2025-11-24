import React from 'react';
import MatchCard from '../components/Match/MatchCard';
import Login from '../components/Auth/Login';
import './MatchesPage.css';

const MatchesPage = ({ user, setUser }) => {
  // 模擬賽事資料（之後會從 Supabase 抓）
  const matches = [
    {
      id: 'match_001',
      league: '企業排球聯賽 (TVL)',
      homeTeam: '屏東台電',
      awayTeam: '臺北鯨華',
      homeScore: 3,
      awayScore: 1,
      setScores: ['25-23', '25-20', '23-25', '25-18'],
      highlight: '台電強力主攻手單場 30 分，穩守勝局！',
      commentCount: 12,
      status: 'finished'
    },
    {
      id: 'match_002',
      league: '職業排球聯盟 (TPVL) - 男子組',
      homeTeam: '臺中連莊',
      awayTeam: '臺北伊斯特',
      date: '2025/12/01 (日)',
      time: '14:30',
      location: '臺北市立大學天母校區體育館',
      status: 'upcoming'
    }
  ];

  return (
    <div className="matches-page">
        <Login user={user} setUser={setUser} />
      <section className="matches-header">
        <h2>🔥 最新賽事報告</h2>
        <p className="matches-subtitle">追蹤台灣職業與企業排球聯賽的最新動態</p>
      </section>

      <div className="match-list">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} user={user} />
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;