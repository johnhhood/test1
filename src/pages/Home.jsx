import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import React from 'react';

export default function Home() {
  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .gte('view_count', 0)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Popular fetch error:', error.message);
      } else {
        setPopularRecipes(data);
      }
    };

    fetchPopular();
  }, []);

 return (
  <div style={{ background: 'pink', padding: 40, fontSize: '1.5rem' }}>
    ✅ Home component loaded
  </div>
);
}
