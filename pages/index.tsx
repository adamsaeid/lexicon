import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";

import Lick from "../components/lick";

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);
  
  return (
    <div className='app'>
      {/* types provided by package are incorrect */}
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="lexicon"
        getOAuthToken={getToken}
        initialVolume={0.3}
        connectOnInitialized={true}
      >
        <Lick 
          token={token!}
          name="B.B. King - Sweet Little Angel"
          spotifyUri="spotify:track:6F76ic7c6au3QxG6jaso7N"
          position={27600}
          duration={2200}
        />
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
