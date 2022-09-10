import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { Container, Stack, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import Kitsu from 'kitsu';

import Lick from "../../components/lick";

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const getToken = useCallback((callback: any) => callback(token), [token]);

  const [name, setName] = useState<string>('');
  const [spotifyUri, setSpotifyUri] = useState<string>('');
  const [position, setPosition] = useState<string>('0');
  const [duration, setDuration] = useState<string>('');

  const router = useRouter();

  const lick={
    name,
    'spotify-uri': spotifyUri,
    position: parseInt(position),
    duration: parseInt(duration)
  }

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
    /* types provided by package are incorrect */
    /* @ts-ignore */
    <WebPlaybackSDK
      initialDeviceName="lexicon"
      getOAuthToken={getToken}
      connectOnInitialized={true}
    >
      <Container 
        className='app'
        maxWidth='xs'
        >
        <Stack spacing={2} alignItems='center'>
          <h1>New lick</h1>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Spotify URI"
            variant="outlined"
            onChange={(event) => setSpotifyUri(event.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Position"
            variant="outlined"
            onChange={(event) => setPosition(event.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Duration"
            variant="outlined"
            onChange={(event) => setDuration(event.target.value)}
            fullWidth
          />
          <Lick token={token} lick={lick} />
          <button onClick={createLick}>Save</button>
          <SpotifyAuth
            redirectUri={`${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}/licks/new`}
            clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
            scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state', 'streaming']}
            onAccessToken={(token: string) => setToken(token)}
          />
        </Stack>
      </Container>
    </WebPlaybackSDK>
  )
}

export default Home
