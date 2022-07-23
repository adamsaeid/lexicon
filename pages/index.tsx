import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import Kitsu from 'kitsu';
import Lick from "../components/lick";

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);

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
      {/* types provided by package are incorrect */}
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="lexicon"
        getOAuthToken={getToken}
        connectOnInitialized={true}
      >
        {licks?.map(lick => (
          <Lick 
            key={lick.name}
            token={token!}
            lick={lick}
          />
        ))}
      </WebPlaybackSDK>
      <SpotifyAuth
        redirectUri={process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}
        clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
        scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state', 'streaming']}
        onAccessToken={(token: string) => setToken(token)}
      />
    </div>
  )
}

export default Home
