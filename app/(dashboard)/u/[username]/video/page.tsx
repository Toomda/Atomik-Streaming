import { getVODs } from "@/actions/vod";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Play } from "lucide-react";
import Image from "next/image";

interface VOD {
  videoUrl: string;
  imageUrl: string;
  gamesPlayed: {
    id: string;
    thumbnailExists: boolean;
  }[];
  clips: {
    id: string;
  }[];
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  length: number;
  createdAt: Date;
  updatedAt: Date;
  streamId: string;
}

const VodPage = async () => {
  const vods: VOD[] = await getVODs();
  if (vods.length === 0) {
    return null;
  }

  const formatSecondsToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad each value with leading zeros to ensure it's at least two digits
    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <div className="flex flex-col p-10 space-y-6">
      {vods.map((vod: VOD) => {
        return (
          <>
            <div key={vod.id} className="w-full flex space-x-6">
              <div className="relative aspect-video w-72">
                <Image
                  src={vod.imageUrl}
                  alt={vod.name}
                  fill
                  sizes="w-full h-full"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="justify-between space-y-2 max-w-screen-xl flex flex-col flex-grow">
                <div>
                  <Hint label={vod.name} delayDuration={400}>
                    <div className="max-w-screen-xl ">
                      <p className="font-semibold text-4xl truncate cursor-default">
                        {vod.name}
                      </p>
                    </div>
                  </Hint>
                </div>
                <div className="flex flex-grow">
                  <div className="flex flex-col justify-between">
                    <div className="flex space-x-4 pt-1">
                      {vod.gamesPlayed?.map((game) => {
                        return (
                          <div
                            key={game.id}
                            className="relative aspect-9/16 w-10 border-2 rounded-md"
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/CategoryThumbnails/${game.id}`}
                              alt={"GamePlayed"}
                              sizes="w-full h-full"
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex space-x-6">
                      <div className="flex self-end  space-x-2">
                        <div className="flex space-x-1">
                          <Calendar className="w-4 h-4 self-center" />
                          <p className="text-xl">
                            {new Date(vod.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Clock className="w-4 h-4 self-center" />
                          <p className="text-xl">
                            {formatSecondsToHHMMSS(vod.length)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-grow relative">
                    <div className="flex space-x-2 absolute right-0 bottom-0">
                      <Button
                        variant="primary"
                        className="w-20 flex space-x-4 "
                      >
                        <Play className="w-4 h-4" />
                        Play
                      </Button>
                      <a href={vod.videoUrl} download={vod.name}>
                        <Button
                          variant="outline"
                          className="w-20 flex space-x-4"
                        >
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
          </>
        );
      })}
    </div>
  );
};

export default VodPage;
