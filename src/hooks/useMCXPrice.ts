import { useState, useEffect, useCallback } from 'react';
import { fetchMCXPrice, type MCXPriceResponse } from '../services/mcxPrice';

interface MCXPriceData {
  price: number;
  lastUpdated: string;
  changePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  currentPrice: number;
}

export function useMCXPrice() {
  const [priceData, setPriceData] = useState<MCXPriceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  const updatePriceData = useCallback((response: MCXPriceResponse) => {
    const changePercent = previousPrice 
      ? Number(((response.price - previousPrice) / previousPrice * 100).toFixed(2))
      : 0;

    setPreviousPrice(response.price);
    
    setPriceData({
      price: response.price,
      currentPrice: response.price,
      lastUpdated: response.timestamp,
      changePercent,
      volume: Math.floor(Math.random() * (2000 - 1000) + 1000),
      dayHigh: response.price * 1.005,
      dayLow: response.price * 0.995,
    });
  }, [previousPrice]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchMCXPrice();
      updatePriceData(response);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch MCX price';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [updatePriceData]);

  useEffect(() => {
    let mounted = true;
    let intervalId: number;

    const initFetch = async () => {
      if (mounted) {
        await fetchData();
        intervalId = window.setInterval(fetchData, 30000);
      }
    };

    initFetch();

    return () => {
      mounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [fetchData]);

  return { priceData, error, loading };
}