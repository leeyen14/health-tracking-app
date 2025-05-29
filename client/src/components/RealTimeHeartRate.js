import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RealTimeHeartRate() {
  const [heartRateData, setHeartRateData] = useState([]);

  useEffect(() => {
    // Kết nối SSE endpoint từ backend
    const eventSource = new EventSource('/api/real-time-updates');

    eventSource.onmessage = (e) => {
      const newData = JSON.parse(e.data);
      setHeartRateData(prev => [...prev, newData]);
    };

    return () => eventSource.close(); // Cleanup khi component unmount
  }, []);

  return (
    <div>
      <h3>Real-Time Heart Rate</h3>
      <ul>
        {heartRateData.map((item, index) => (
          <li key={index}>{item.value} bpm at {new Date(item.time).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}