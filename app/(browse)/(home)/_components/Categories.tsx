export const Categories = () => {
  return (
    <div className="h-44 flex overflow-hidden space-x-2 px-72">
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S2_1200x1600-9ebf575033287e2177106da5ff45c1d4"
          alt="Valorant"
          className="h-full w-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x465.jpg"
          alt="Minecraft"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://images.mein-mmo.de/medien/2020/12/TFT-Poro.jpg"
          alt="TFT"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://image.api.playstation.com/cdn/EP0700/CUSA03365_00/OFMeAw2KhrdaEZAjW1f3tCIXbogkLpTC.png"
          alt="DarkSouls"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://m.media-amazon.com/images/M/MV5BODkxMjI4OWMtMzZmMi00MmJiLWI3OWUtNzc0NmY1ZTY1NjI0XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_FMjpg_UX1000_.jpg"
          alt="SMM2"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/d/de/Lies_of_p_cover_art.jpg"
          alt="LiesOfP"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer aspect-[9/16]">
        <img
          src="https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg"
          alt="JustChatting"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      {/* <div className="flex-grow relative cursor-pointer">
        <img
          src="https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg"
          alt="Fortnite"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div>
      <div className="flex-grow relative cursor-pointer">
        <img
          src="https://static-cdn.jtvnw.net/ttv-boxart/32982_IGDB-285x380.jpg"
          alt="GTA"
          className="w-full h-full object-cover absolute rounded-xl border border-orange-400"
        />
      </div> */}
    </div>
  );
};
