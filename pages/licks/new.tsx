import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import Kitsu from 'kitsu';

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);

  const [name, setName] = useState<string>('');
  const [spotifyUri, setSpotifyUri] = useState<string>('');
  const [position, setPosition] = useState<string>('0');
  const [duration, setDuration] = useState<string>('');

  const router = useRouter();

  const createLick = async () => {
    await api.create('licks', {
      name,
      'spotify-uri': spotifyUri,
      position,
      duration
    })

    router.push('/')
  };
  
  const api = new Kitsu({
    baseURL: process.env.NEXT_PUBLIC_API_HOST
  })

  return (
    <div className='app'>
      {/* types provided by package are incorrect */}
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="lexicon"
        getOAuthToken={getToken}
        connectOnInitialized={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <div>
            <label>Name: </label>
            <input type="text" onChange={(event) => setName(event.target.value)}/>
          </div>
          <div>
            <label>Spotify URI: </label>
            <input type="text" onChange={(event) => setSpotifyUri(event.target.value)}/>
          </div>
          <div>
            <label>Position: </label>
            <input type="text" onChange={(event) => setPosition(event.target.value)}/>
          </div>
          <div>
            <label>Duration: </label>
            <input type="text" onChange={(event) => setDuration(event.target.value)}/>
          </div>
        </div>
        <button onClick={createLick}>Save</button>
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
