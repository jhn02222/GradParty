"use client";

import { useEffect, useState } from "react";
import { RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function TvPage() {
  const [data, setData] = useState(null);
  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const leaders = data?.users || [];
  const lowerLeaders = leaders.slice(3);
  const totalDrinks = data?.totals?.drinks ?? leaders.reduce((sum, user) => sum + user.drinks, 0);
  const totalPlayers = data?.totals?.players ?? leaders.length;
  const totalProofs = data?.totals?.proofs ?? 0;
  const partyCam = data?.gallery || [];
  const photoWall = partyCam.length > 6 ? [...partyCam, ...partyCam] : partyCam;

  useEffect(() => {
    const savedPin = localStorage.getItem("gradPartyAdminPin") || "";
    setPin(savedPin);
    if (!savedPin) return;
    load(savedPin);
    const interval = setInterval(() => load(savedPin), 2000);
    return () => clearInterval(interval);
  }, []);

  async function load(adminPin = pin) {
    const response = await fetch("/api/tv", {
      cache: "no-store",
      headers: adminPin ? { "x-admin-pin": adminPin } : {},
    });
    const tvData = await response.json().catch(() => ({}));
    if (!response.ok) {
      setAuthorized(false);
      setMessage(tvData.error || "Admin PIN required");
      return;
    }
    localStorage.setItem("gradPartyAdminPin", adminPin);
    setAuthorized(true);
    setMessage("");
    setData(tvData);
  }

  if (!authorized) {
    return (
      <main className="paper-bg grid min-h-svh place-items-center px-5">
        <section className="w-full max-w-sm text-center">
          <RansomTitle size="text-4xl" className="mb-7">TV BOARD</RansomTitle>
          <TornPaperCard className="p-6">
            <p className="mb-4 text-sm font-black uppercase text-uga-red">Admin Only</p>
            <label className="sr-only" htmlFor="admin-pin">Admin PIN</label>
            <input
              id="admin-pin"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Admin PIN"
              className="torn-soft mb-4 w-full bg-white px-4 py-3 text-center font-black text-zinc-950 placeholder:text-zinc-500"
            />
            <RedTornButton onClick={() => load(pin)} className="w-full">Open Leaderboard</RedTornButton>
            {message && <p className="hand mt-4 text-sm font-black text-uga-red">{message}</p>}
          </TornPaperCard>
        </section>
      </main>
    );
  }

  return (
    <main className="tv-collage-bg h-svh overflow-hidden p-4">
      <section className="mx-auto grid h-full max-w-[1920px] grid-cols-[250px_minmax(560px,0.85fr)_minmax(440px,0.55fr)] grid-rows-[minmax(0,1fr)_54px] gap-4">
        <aside className="relative flex min-h-0 flex-col justify-between pr-4">
          <div>
            <RansomTitle size="text-3xl" className="mb-5 -rotate-2 whitespace-nowrap">GRAD PARTY</RansomTitle>
            <TornPaperCard className="p-5 rotate-1">
              <p className="hand text-3xl font-black leading-tight">EAT. DRINK.</p>
              <p className="hand text-3xl font-black leading-tight text-uga-red">GO DAWGS.</p>
              <div className="mt-4 grid h-40 place-items-center border-2 border-dashed border-zinc-900 bg-white/35">
                <img src="/assets/DawgGrad.png" alt="Dawg grad" className="max-h-full max-w-full object-contain p-2" />
              </div>
            </TornPaperCard>
          </div>
          <div className="space-y-3">
            {[
              ["Total Players", totalPlayers],
              ["Total Drinks", totalDrinks],
              ["Total Proofs", totalProofs],
            ].map(([label, value], index) => (
              <TornPaperCard key={label} rotate={index % 2 ? "rotate-1" : "-rotate-1"} className="relative p-4">
                <span className={`absolute -top-2 left-7 h-5 w-16 ${index % 2 ? "rotate-6" : "-rotate-6"} ${index === 0 ? "bg-yellow-300" : index === 1 ? "bg-sky-400" : "bg-uga-red"}`} />
                <p className="text-sm font-black uppercase text-uga-red">{label}</p>
                <b className="text-4xl">{value}</b>
              </TornPaperCard>
            ))}
          </div>
        </aside>

        <section className="relative grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] px-2">
          <div className="mb-3 text-center">
            <p className="inline-block -rotate-2 bg-yellow-300 px-5 py-1 text-2xl font-black uppercase text-zinc-950 shadow-paper">LIVE</p>
            <RansomTitle size="text-5xl" className="-mt-1 text-center">LEADERBOARD</RansomTitle>
            <p className="hand mt-1 text-lg font-bold uppercase">Top grads ranking</p>
          </div>
          <section className="mb-4 grid grid-cols-2 gap-3">
            {leaders[0] && <TopSpotlight user={leaders[0]} place="1st" large />}
            {leaders[1] && <TopSpotlight user={leaders[1]} place="2nd" />}
            {leaders[2] && <TopSpotlight user={leaders[2]} place="3rd" />}
          </section>
          <ol className="min-h-0 space-y-2 overflow-y-auto pr-2">
            {lowerLeaders.map((user) => <TvLeaderboardRow key={user.id || user.name} user={user} />)}
            {leaders.length === 0 && <TornPaperCard className="p-8 text-center text-3xl font-black">Waiting for the first guest to join.</TornPaperCard>}
          </ol>
        </section>

        <aside className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-uga-paper/30 bg-zinc-950/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
          <div className="mb-4 grid grid-cols-[1fr_132px] items-start gap-3">
            <div>
              <p className="inline-block rotate-2 bg-uga-red px-3 py-1 text-sm font-black uppercase text-white">New</p>
              <RansomTitle size="text-3xl" className="mt-1">PARTY CAM</RansomTitle>
              <p className="hand mt-2 text-lg font-black uppercase text-uga-paper">All approved photos</p>
            </div>
            <TornPaperCard className="relative p-2 text-center">
              <span className="absolute -top-2 left-7 h-5 w-20 -rotate-6 bg-yellow-300" />
              <img src="/assets/qrCode.png" alt="QR code to join" className="mx-auto h-24 w-24 object-contain" />
              <p className="hand mt-2 text-sm font-black leading-tight">Scan to Join</p>
            </TornPaperCard>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <TornPaperCard className="relative p-4 text-center">
              <span className="absolute -left-2 top-4 h-14 w-5 -rotate-6 bg-sky-400" />
              <p className="text-xs font-black uppercase">Total Drinks</p>
              <b className="text-5xl text-uga-red">{totalDrinks}</b>
              <p className="font-black">CUPS</p>
            </TornPaperCard>
            <TornPaperCard className="relative p-4 text-center">
              <span className="absolute -right-2 top-4 h-14 w-5 rotate-6 bg-yellow-300" />
              <p className="text-xs font-black uppercase">Total Photos</p>
              <b className="text-5xl text-uga-red">{totalProofs}</b>
              <p className="font-black">PHOTOS</p>
            </TornPaperCard>
          </div>

          <div className="min-h-0 overflow-hidden px-1 pt-2">
            <div className={`grid grid-cols-3 gap-x-5 gap-y-7 ${partyCam.length > 6 ? "tv-photo-wall-scroll" : ""}`}>
              {photoWall.map((shot, index) => (
                <TvPhotoCard
                  key={`${shot.id || shot.user}-${index}`}
                  shot={shot}
                  rotate={index % 2 ? "rotate-2" : "-rotate-2"}
                />
              ))}
              {partyCam.length === 0 && (
                <TornPaperCard className="col-span-3 grid h-56 place-items-center p-5 text-center text-2xl font-black">
                  Photos will show here after proofs are approved.
                </TornPaperCard>
              )}
            </div>
          </div>
        </aside>

        <div className="col-span-3 self-end overflow-hidden bg-uga-red py-2 text-2xl font-black uppercase text-white shadow-paper">
          <p className="ticker whitespace-nowrap">Join! // Keep Hydrating! // Submit your best photos // Scan QR Code to Join! // </p>
        </div>
      </section>
    </main>
  );
}

function TvLeaderboardRow({ user, emphasis = false }) {
  return (
    <li className="tv-score-row grid min-h-16 grid-cols-[34px_46px_minmax(420px,1fr)_48px_64px] items-center gap-2 bg-uga-paper/95 px-4 py-3 text-zinc-950 shadow-paper">
      <span className="text-center text-2xl font-black text-uga-red">{user.rank}</span>
      <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-zinc-900 text-xs font-black text-white">
        {user.photoUrl?.startsWith("/api/files") || user.photoUrl?.startsWith("http") ? <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : user.photo}
      </span>
      <span className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="hand whitespace-nowrap text-3xl font-black">{user.name}</span>
        <DrinkTypeIcons counts={user.drinkCounts || {}} />
      </span>
      <span className="text-right font-black text-uga-red">{user.points}</span>
      <span className="flex items-center justify-end gap-1 font-black">
        {user.drinks}
        <RedCupIcon />
      </span>
    </li>
  );
}

function TopSpotlight({ user, place, large = false }) {
  return (
    <article className={`relative bg-uga-paper text-zinc-950 shadow-paper ${large ? "col-span-2 p-5" : "p-4"} ${large ? "-rotate-1" : "rotate-1"}`}>
      <span className={`absolute -top-4 left-4 bg-uga-red px-3 py-1 font-black uppercase text-white ${large ? "text-lg" : "text-sm"}`}>{place}</span>
      <div className={`grid ${large ? "grid-cols-[76px_1fr]" : "grid-cols-[56px_1fr]"} items-center gap-3`}>
        <span className={`${large ? "h-20 w-20 text-xl" : "h-14 w-14 text-sm"} grid place-items-center overflow-hidden rounded-full bg-zinc-950 font-black text-white`}>
          {user.photoUrl?.startsWith("/api/files") || user.photoUrl?.startsWith("http") ? <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : user.photo}
        </span>
        <div className="min-w-0">
          <h2 className={`hand truncate font-black ${large ? "text-4xl" : "text-3xl"}`}>{user.name}</h2>
          <DrinkTypeIcons counts={user.drinkCounts || {}} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t-2 border-zinc-950/15 pt-2 font-black">
        <span className="text-uga-red">{user.points} pts</span>
        <span className="flex items-center gap-1 text-2xl">
          {user.drinks}
          <RedCupIcon />
        </span>
      </div>
    </article>
  );
}

function TvPhotoCard({ shot, rotate = "" }) {
  return (
    <figure className={`tv-polaroid relative bg-uga-paper p-2 pb-5 text-zinc-950 shadow-taped ${rotate}`}>
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-zinc-900 text-3xl font-black text-white">
        {shot.photoUrl ? (
          <img src={shot.photoUrl} alt={`${shot.user} proof`} className="h-full w-full object-cover" />
        ) : (
          shot.user.slice(0, 2).toUpperCase()
        )}
      </div>
      <figcaption className="hand mt-2 text-center text-sm font-black leading-tight">{shot.user}</figcaption>
      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-black uppercase text-uga-red">
        <DrinkTypePhotoIcon type={shot.drinkType} />
        <span>{formatPhotoTime(shot.createdAt)}</span>
      </div>
    </figure>
  );
}

function DrinkTypePhotoIcon({ type }) {
  const item = drinkIconAssets.find(([drinkType]) => drinkType === type);
  if (!item) return null;
  return <img src={item[1]} alt={item[2]} className="h-9 w-9 object-contain" />;
}

function formatPhotoTime(value) {
  if (!value) return "Just now";
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const drinkIconAssets = [
  ["BEER", "/assets/Beer.png", "beer"],
  ["SELTZER", "/assets/Seltzer.png", "seltzer"],
  ["JELLO_SHOT", "/assets/jelloShots.png", "jello shot"],
  ["SHOT", "/assets/shots.png", "shot"],
];

function DrinkTypeIcons({ counts }) {
  const icons = drinkIconAssets.flatMap(([type, src, label]) =>
    Array.from({ length: counts[type] || 0 }).map((_, index) => ({ key: `${type}-${index}`, src, label }))
  );
  const visible = icons.slice(0, 8);
  const hidden = Math.max(0, icons.length - visible.length);
  return (
    <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
      {visible.map((icon) => (
        <img key={icon.key} src={icon.src} alt={icon.label} className="h-9 w-9 shrink-0 object-contain" />
      ))}
      {hidden > 0 && <b className="shrink-0 text-sm">+{hidden}</b>}
    </span>
  );
}

function RedCupIcon() {
  return (
    <img src="/assets/red_cup.png" alt="cups" className="h-8 w-8 object-contain" />
  );
}
