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
  
  const licks = [
    {
      name: "Albert King - Blues Power",
      spotifyUri: "spotify:track:3IWeSiU06w8cDXhyHpm98H",
      position: 5000,
      duration: 5500,
    },
    {
      name: "B.B. King - Sweet Little Angel",
      spotifyUri: "spotify:track:6F76ic7c6au3QxG6jaso7N",
      position: 36500,
      duration: 5000
    },
    {
      name: "Buddy Guy, Junior Wells - T-Bone Shuffle",
      spotifyUri: "spotify:track:2MGmQWzMhik2AXOrJj5azQ",
      position: 11000,
      duration: 5000,
    },
  
  ];

  return (
    <div className='app'>
      {/* types provided by package are incorrect */}
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="lexicon"
        getOAuthToken={getToken}
        connectOnInitialized={true}
      >
        {licks.map(lick => (
          <Lick 
            key={lick.name}
            token={token!}
            name={lick.name}
            spotifyUri={lick.spotifyUri}
            position={lick.position}
            duration={lick.duration}
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
