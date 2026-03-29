import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { immediate = true, params = {} } = options;

  const fetchData = useCallback(async (overrideUrl) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(overrideUrl || url, { params });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate]);

  return { data, loading, error, refetch: fetchData, setData };
};

export default useFetch;
