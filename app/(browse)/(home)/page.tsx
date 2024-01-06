import { Results, ResultsSkeleton } from './_components/results';
import { Suspense } from 'react';
// import HlsPlayer fro../../../components/stream-player/hlsplayeryer';
export default function Home() {
  // const streamUrl =
  // 'http://localhost:5000/api/stream/receive/Toomda/index.m3u8';

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      {/* <HlsPlayer src={streamUrl} /> */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}
