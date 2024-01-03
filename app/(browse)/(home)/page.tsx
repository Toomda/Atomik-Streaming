import { Results, ResultsSkeleton } from './_components/results';
import { Suspense } from 'react';
import HlsPlayer from './_components/hlsplayer';
export default function Home() {
  const streamUrl = 'http://localhost:5000/api/livestreams/Toomda/index.m3u8';

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      {/* <HlsPlayer src={streamUrl} /> */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}
