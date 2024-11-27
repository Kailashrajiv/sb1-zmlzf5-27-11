import { useState, useEffect } from 'react';
import { MARKET_CONFIG } from '../config/market';

export function useRBIRate() {
  const [rate, setRate] = useState(MARKET_CONFIG.RBI.DEFAULT_RATE);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchRBIRate = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use the default rate
        if (mounted) {
          setRate(MARKET_CONFIG.RBI.DEFAULT_RATE);
          setLastUpdated(new Date());
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching RBI rate:', err);
          setError('Failed to fetch RBI rate');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRBIRate();

    // Set up periodic updates
    const intervalId = setInterval(fetchRBIRate, MARKET_CONFIG.RBI.UPDATE_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return {
    rate,
    lastUpdated,
    loading,
    error
  };
}