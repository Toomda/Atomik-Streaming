import { getStreams } from "@/actions/stream";
import { ResultCard, ResultCardSkeleton } from "./result-card";

export const Recommended = async () => {
  const streams = await getStreams();

  return (
    <div>
      {streams.length === 0 && (
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      <div className="grid grid-cols-3 gap-4 max-h-96">
        {streams.map((stream: any) => (
          <ResultCard data={stream} key={stream.id} />
        ))}
      </div>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 max-h-96">
        {[...Array(3)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
