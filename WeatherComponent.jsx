import React from 'react';
import { useWeather } from '../hooks/useWeather'; // 假設路徑是 src/hooks/useWeather

function WeatherComponent() {
  const { weatherData, loading, error } = useWeather();
  // 設置一個狀態來存儲用戶選擇的縣市，預設為臺北市
  const [selectedCity, setSelectedCity] = React.useState('臺北市'); 
  
  if (loading) return <div>天氣資料載入中...</div>;
  if (error) return <div style={{ color: 'red' }}>載入天氣錯誤: {error}</div>;

  // 篩選出用戶選擇的縣市資料
  const cityData = weatherData.find(loc => loc.locationName === selectedCity);
  
  // 提取所有可選的縣市名稱
  const cityNames = weatherData.map(loc => loc.locationName);

  if (!cityData) return <div>找不到 {selectedCity} 的天氣預報。</div>;

  // 假設我們要顯示溫度 (T) 和天氣現象 (Wx)
  const weatherElements = cityData.location[0].weatherElement; 
  const temperatureElement = weatherElements.find(e => e.elementName === 'T'); // 溫度
  const wxElement = weatherElements.find(e => e.elementName === 'Wx'); // 天氣現象

  return (
    <div>
      <h3>🏐 臺灣排球比賽天氣預報</h3>
      
      {/* 縣市選擇下拉選單 */}
      <select 
        value={selectedCity} 
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cityNames.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      
      <h4>{selectedCity} 未來 7 天預報 (部分數據)</h4>
      <ul>
        {wxElement.time.slice(0, 7).map((timeSlot, index) => {
          // 取得該時段的溫度資料 (T)
          const tempValue = temperatureElement.time[index].elementValue[0].value;
          
          return (
            <li key={index}>
              <strong>{new Date(timeSlot.startTime).toLocaleDateString('zh-TW')}：</strong>
              {timeSlot.elementValue[0].value} (天氣現象)
              / 溫度 {tempValue}°C
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default WeatherComponent;