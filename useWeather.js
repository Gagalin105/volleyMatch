import { useState, useEffect } from 'react';

// Data ID 臺灣各縣市未來一週預報
const CWA_DATA_ID = 'F-D0047-093'; 

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_CWA_API_KEY; 
    if (!API_KEY) {
      setError("錯誤：請在 .env 檔案中設定 VITE_CWA_API_KEY。");
      setLoading(false);
      return;
    }
    const API_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${CWA_DATA_ID}?Authorization=${API_KEY}`;
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`CWA API 請求失敗，狀態碼: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setWeatherData(data.records.locations);
        setLoading(false);
      })
      .catch(err => {
        console.error("擷取天氣數據發生錯誤:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { weatherData, loading, error };
}