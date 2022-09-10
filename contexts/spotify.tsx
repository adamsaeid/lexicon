import { createContext, useCallback, useContext, useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import Cookies from 'js-cookie';

const AccessTokenContext = createContext<string | undefined>(undefined);

export const SpotifyProvider =  ({ children } : { children: any }) => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);
  
  return ( 
    <AccessTokenContext.Provider value={token}>
      {
        !token
          ? <p>loading...</p>
          : <>   
            {/* types provided by package are incorrect */}
            {/* @ts-ignore */}
            <WebPlaybackSDK
              initialDeviceName="lexicon"
              getOAuthToken={getToken}
              connectOnInitialized={true}
            >
              {children}
            </WebPlaybackSDK>
          </>
      }

      <div style={{ marginTop: "30px" }}>
        <SpotifyAuth
          redirectUri={process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}
          clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
          scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state', 'streaming']}
          onAccessToken={(token: string) => setToken(token)}
        />
      </div>
    </AccessTokenContext.Provider>
  )
};

export const useAccessToken = () => useContext(AccessTokenContext);