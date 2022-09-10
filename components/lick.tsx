import { useEffect } from 'react';
import { usePlayerDevice, useSpotifyPlayer } from 'react-spotify-web-playback-sdk';

import { useAccessToken } from '../contexts/spotify';

export interface Props {
  lick: Lick;
}

const Lick = ({ lick } : Props) => {
  const device = usePlayerDevice()
  const player = useSpotifyPlayer();

  const token = useAccessToken();

  const onResume = async() => {
    player?.resume();
  };

  const onPlay = async () => {
    player?.addListener('player_state_changed', () => {
      player.removeListener('player_state_changed');
      setTimeout(() => {
        player.pause();
      }, lick.duration)
    });

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device?.device_id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [lick["spotify-uri"]],
          position_ms: lick.position,
        })
      }
    );

    player?.resume();
  };

  return(
    <div style={{ display: 'flex' }}>
      <button onClick={onPlay}>Play</button>
      <button onClick={onResume}>Resume</button>
      <p>{lick.name}</p>
    </div>
  );
}

export default Lick;