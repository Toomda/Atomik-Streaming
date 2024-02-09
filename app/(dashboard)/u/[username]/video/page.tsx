import { getVODs } from "@/actions/vod";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Play } from "lucide-react";
import Image from "next/image";

const VodPage = async () => {
  //   const vods = await getVODs();
  const vods = [
    {
      id: 123,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/10/17/09/37/honey-bee-8320764_1280.jpg",
      timestamp: Date.now(),
      name: "Das ist ein sehr langer Titel für meinen Stream, was hab ich nur getan! Und was passiert, wenn ich den noch länger mache",
      length: 120340,
      gamesPlayed: [
        {
          id: "2fa6b754-0bc2-4398-a59a-fc8fda695bcf",
        },
        {
          id: "375f774c-9508-47b5-a8e9-1088e41a7b33",
        },
        {
          id: "3b3b50eb-8c54-4c4b-a131-2d3b6e2e1f67",
        },
        {
          id: "8ee49520-1869-407d-8d4a-0e6bf6fcd6a0",
        },
      ],
    },
    {
      id: 1234,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/11/09/11/50/cat-8377169_960_720.jpg",
      timestamp: Date.now(),
      name: "Crazy VOD",
      length: 200,
      gamesPlayed: [
        {
          id: "375f774c-9508-47b5-a8e9-1088e41a7b33",
        },
      ],
    },
    {
      id: 1235,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/09/01/23/33/motorcycles-8227939_1280.jpg",
      timestamp: Date.now(),
      name: "Crazy VOD",
      length: 200,
      gamesPlayed: [
        {
          id: "3b3b50eb-8c54-4c4b-a131-2d3b6e2e1f67",
        },
      ],
    },
    {
      id: 12356,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/09/01/23/33/motorcycles-8227939_1280.jpg",
      timestamp: Date.now(),
      name: "Crazy VOD",
      length: 200,
      gamesPlayed: [
        {
          id: "8ee49520-1869-407d-8d4a-0e6bf6fcd6a0",
        },
      ],
    },
    {
      id: 12357,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/09/01/23/33/motorcycles-8227939_1280.jpg",
      timestamp: Date.now(),
      name: "Crazy VOD",
      length: 200,
      gamesPlayed: [
        {
          id: "992b0c26-6055-4a9f-aa86-397f18849351",
        },
      ],
    },
    {
      id: 12358,
      thumbnail:
        "https://cdn.pixabay.com/photo/2023/09/01/23/33/motorcycles-8227939_1280.jpg",
      timestamp: Date.now(),
      name: "Crazy VOD",
      length: 200,
      gamesPlayed: [
        {
          id: "c10a9321-7985-4399-a384-c2dc35296f5b",
        },
      ],
    },
  ];

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
      {vods.map((vod) => {
        return (
          <>
            <div key={vod.id} className="w-full flex space-x-6">
              <div className="relative aspect-video w-72">
                <Image
                  src={vod.thumbnail}
                  alt={vod.timestamp.toString()}
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
                      {vod.gamesPlayed.map((game) => {
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
                            {new Date(vod.timestamp).toLocaleDateString()}
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
                      <Button variant="outline" className="w-20 flex space-x-4">
                        Downlad
                      </Button>
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
