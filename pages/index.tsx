import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Kitsu from 'kitsu';
import Lick from "../components/lick";

const Home: NextPage = () => {
  const [licks, setLicks] = useState<Lick[]>([]);
  
  const api = new Kitsu({
    baseURL: process.env.NEXT_PUBLIC_API_HOST
  })

  const getLicks = async () => {
    const resp = await api.get('licks');
    setLicks(resp.data);
  };

  useEffect(() => {
    getLicks();
  }, []);


  return (
    <div className='app'>
        <h1>Lexicon</h1>
        <h2>All licks</h2>
        <Link href='/licks/new'>
          <button>Add new lick</button>
        </Link>
        <div style={{ marginTop: '30px' }}>
          {licks?.map(lick => (
            <Lick 
              key={lick.name}
              lick={lick}
            />
          ))}
        </div>
    </div>
  )
}

export default Home
