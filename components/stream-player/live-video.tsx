'use client';

import { useRef, useState, useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';

import { FullscreenControl } from './fullscreen-control';
import { VolumeControl } from './volume-control';
import Hls from 'hls.js';
import { LoadingVideo } from './loading-video';

interface LiveVideoProps {
  username: string;
}

export const LiveVideo = ({ username }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);
  const [manifestParsed, setManifestParsed] = useState(false);

  const src = `http://localhost:5000/api/stream/receive/${username}/index.m3u8`;

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 50 : 0);

    if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  useEffect(() => {
    onVolumeChange(0);
  }, []);

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  useEventListener('fullscreenchange', handleFullscreenChange, wrapperRef);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported() && video) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 1,
        liveBackBufferLength: 0,
        liveSyncDuration: 1,
        liveMaxLatencyDuration: 5,
        liveDurationInfinity: true,
        highBufferWatchdogPeriod: 1,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      console.log('Registering manifest parsed event');
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setManifestParsed(true);
        console.log('manifest parsed');
        video.play().catch((e) => console.error('Error playing video!', e));
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        if (data.details.live) {
          video.currentTime = video.duration - 1;
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        setManifestParsed(false);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          }
        }
      });
    } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((e) => console.error('Error playing video:', e));
      });
    }
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-full flex"
      onDoubleClick={toggleFullscreen}
    >
      <video src={src} width={'100%'} ref={videoRef} />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
          <VolumeControl
            onChange={onVolumeChange}
            value={volume}
            onToggle={toggleMute}
          />
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};
