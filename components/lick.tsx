import { useSpotifyDevice, useSpotifyPlayer } from '../contexts/spotify';

import { useAccessToken } from '../contexts/spotify';

export interface Props {
  lick: Lick;
}

const Lick = ({ lick } : Props) => {
  const player = useSpotifyPlayer();
  const device = useSpotifyDevice();

  const token = useAccessToken();

  const onResume = async() => {
    player?.activateElement();
  };

  const onPlay = async () => {
    player?.addListener('player_state_changed', () => {
      player.removeListener('player_state_changed');
      setTimeout(() => {
        player.pause();
      }, lick.duration)
    });

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
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

    // player?.resume();
  };

  return(
    <div style={{ display: 'flex' }}>
      <button onClick={onPlay}>Play</button>
      <button onClick={onResume}>Activate</button>
      <p>{lick.name}</p>
    </div>
  );
}

export default Lick;