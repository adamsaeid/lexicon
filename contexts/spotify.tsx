// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import Cookies from 'js-cookie';

const AccessTokenContext = createContext<string | undefined>(undefined);
const SpotifyPlayerContext = createContext<any | undefined>(undefined);
const SpotifyDeviceContext = createContext<any | undefined>(undefined);

export const SpotifyProvider =  ({ children } : { children: any }) => {
  const [token, setToken] = useState("");
  const [player, setPlayer] = useState<any>(null);
  const [device, setDevice] = useState<string>("");

  useEffect(() => {
    setToken(Cookies.get("spotifyAuthToken"));
    
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (token) {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
            console.log('the device id is ', device_id)
            setDevice(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });


        player.connect();
      }

    };
}, [token]);
  
  return ( 
    <AccessTokenContext.Provider value={token}>
      <SpotifyPlayerContext.Provider value={player}>
        <SpotifyDeviceContext.Provider value={device}>
          { token
            ? children 
            : (
              <SpotifyAuth
                redirectUri={process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}
                clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
                scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state', 'streaming']}
                onAccessToken={(token: string) => setToken(token)}
              />
            )
          }
        </SpotifyDeviceContext.Provider>
      </SpotifyPlayerContext.Provider>
    </AccessTokenContext.Provider>
  )
};

export const useAccessToken = () => useContext(AccessTokenContext);
export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);
export const useSpotifyDevice = () => useContext(SpotifyDeviceContext);
