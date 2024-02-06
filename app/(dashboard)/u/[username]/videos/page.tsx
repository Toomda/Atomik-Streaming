import { getVODs } from "@/actions/vod";

export const VodPage = async () => {
  const vods = await getVODs();
};
