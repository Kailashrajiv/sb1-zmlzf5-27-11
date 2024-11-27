import { useState, useEffect } from 'react';
import { LMEHistoryData } from '../types/market';
import { fetchLMEHistory } from '../services/api';

export function useLMEHistory() {
  const [data, setData] = useState<LMEHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: number;

    const fetchData = async () => {
      try {
        const result = await fetchLMEHistory();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error in useLMEHistory:', err);
          setError('Unable to fetch LME data');
          // Don't show error if we're using mock data
          if (import.meta.env.VITE_GOOGLE_SHEETS_API_KEY === 'your_api_key_here') {
            setError(null);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const scheduleNextUpdate = () => {
      const now = new Date();
      const next10AM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        10, 0, 0
      );
      
      if (now.getHours() >= 10) {
        next10AM.setDate(next10AM.getDate() + 1);
      }
      
      const delay = next10AM.getTime() - now.getTime();
      timeoutId = window.setTimeout(fetchData, delay);
    };

    fetchData();
    scheduleNextUpdate();

    return () => {
      mounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return { data, loading, error };
}