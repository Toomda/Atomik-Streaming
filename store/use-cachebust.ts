import { create } from "zustand";

interface CachebustStore {
  userCacheBust: number;
  setUserCacheBust: () => void;
  streamCacheBust: number;
  setStreamCacheBust: () => void;
  categoryCachebust: number;
  setCategoryCacheBust: () => void;
}

export const useCachebust = create<CachebustStore>((set) => ({
  userCacheBust: Date.now(),
  streamCacheBust: Date.now(),
  categoryCachebust: Date.now(),
  setUserCacheBust: () => set(() => ({ userCacheBust: Date.now() })),
  setStreamCacheBust: () => set(() => ({ streamCacheBust: Date.now() })),
  setCategoryCacheBust: () => set(() => ({ categoryCachebust: Date.now() })),
}));
