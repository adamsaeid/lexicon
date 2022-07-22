import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";

import Player from "../components/player";

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);
  
  return (
    <div className='app'>
      <WebPlaybackSDK
        initialDeviceName="lexicon"
        getOAuthToken={getToken}
        initialVolume={0.3}
        connectOnInitialized={true}
      >
        <Player token={token!}/>
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
