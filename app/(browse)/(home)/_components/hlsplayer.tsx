'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
}

const HlsPlayer = ({ src }: HlsPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    console.log(video);
    console.log(Hls.isSupported());
    if (Hls.isSupported() && video) {
      console.log('in is supported function');
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 1,
        liveBackBufferLength: 0,
        liveSyncDuration: 0,
        liveMaxLatencyDuration: 5,
        liveDurationInfinity: true,
        highBufferWatchdogPeriod: 1,
      });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('manifest parsed');
        setOnline(true);
        video.play().catch((e) => console.error('Error playing video!', e));
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        if (data.details.live) {
          video.currentTime = video.duration - 1;
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setOnline(false);
          }
        }
      });
    } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      setOnline(true);
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((e) => console.error('Error playing video:', e));
      });
    }
  }, [src]);

  return (
    <>
      {online && (
        <video ref={videoRef} controls width="100%">
          Your browser does not support this video format.
        </video>
      )}
      {!online && <div>stream is offline</div>}
    </>
  );
};

export default HlsPlayer;
