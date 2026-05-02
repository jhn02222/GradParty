"use client";

import { useEffect, useState } from "react";
import { PolaroidCard, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function TvPage() {
  const [data, setData] = useState(null);
  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const leaders = data?.users || [];
  const totalDrinks = data?.totals?.drinks ?? leaders.reduce((sum, user) => sum + user.drinks, 0);
  const totalPlayers = data?.totals?.players ?? leaders.length;
  const totalProofs = data?.totals?.proofs ?? 0;
  const partyCam = data?.gallery || [];
  const drinkShots = partyCam.filter((shot) => shot.label === "Drink proof");
  const photoShots = partyCam.filter((shot) => shot.label !== "Drink proof");
  const featuredShots = [
    ...drinkShots.slice(0, 2),
    ...photoShots.slice(0, 2),
    ...partyCam.filter((shot) => ![...drinkShots.slice(0, 2), ...photoShots.slice(0, 2)].some((featured) => featured.id === shot.id)),
  ].slice(0, 4);

  useEffect(() => {
    const savedPin = localStorage.getItem("gradPartyAdminPin") || "";
    setPin(savedPin);
    if (!savedPin) return;
    load(savedPin);
    const interval = setInterval(() => load(savedPin), 15000);
    return () => clearInterval(interval);
  }, []);

  async function load(adminPin = pin) {
    const response = await fetch("/api/tv", { headers: adminPin ? { "x-admin-pin": adminPin } : {} });
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
            <RansomTitle size="text-4xl" className="mb-5 -rotate-2">GRAD PARTY</RansomTitle>
            <TornPaperCard className="p-5 rotate-1">
              <p className="hand text-3xl font-black leading-tight">EAT. DRINK.</p>
              <p className="hand text-3xl font-black leading-tight text-uga-red">GO DAWGS.</p>
              <div className="mt-4 grid h-24 place-items-center border-2 border-dashed border-zinc-900 bg-white/35 font-black">DAWG DOODLE</div>
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

        <section className="relative min-h-0 px-2">
          <div className="mb-3 text-center">
            <p className="inline-block -rotate-2 bg-yellow-300 px-5 py-1 text-2xl font-black uppercase text-zinc-950 shadow-paper">LIVE</p>
            <RansomTitle size="text-5xl" className="-mt-1 text-center">LEADERBOARD</RansomTitle>
            <p className="hand mt-1 text-lg font-bold uppercase">Top grads ranking</p>
          </div>
          <ol className="space-y-2 overflow-hidden pr-1">
            {leaders.slice(0, 8).map((user, index) => <TvLeaderboardRow key={user.id || user.name} user={user} emphasis={index < 3} />)}
            {leaders.length === 0 && <TornPaperCard className="p-8 text-center text-3xl font-black">Waiting for the first guest to join.</TornPaperCard>}
          </ol>
        </section>

        <aside className="min-h-0 overflow-y-auto rounded-lg border border-uga-paper/30 bg-zinc-950/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
          <div className="mb-4 grid grid-cols-[1fr_132px] items-start gap-3">
            <div>
              <p className="inline-block rotate-2 bg-uga-red px-3 py-1 text-sm font-black uppercase text-white">New</p>
              <RansomTitle size="text-3xl" className="mt-1">PARTY CAM</RansomTitle>
              <p className="hand mt-2 text-lg font-black uppercase text-uga-paper">2 drinks // 2 photos</p>
            </div>
            <TornPaperCard className="relative p-2 text-center">
              <span className="absolute -top-2 left-7 h-5 w-20 -rotate-6 bg-yellow-300" />
              <div className="mx-auto grid h-20 w-20 grid-cols-3 grid-rows-3 gap-1 bg-zinc-950 p-1">
                {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? "bg-uga-paper" : "bg-uga-red"} />)}
              </div>
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

          <div className="mb-4 grid grid-cols-2 gap-3">
            {featuredShots.map((shot, index) => (
              <PolaroidCard
                key={shot.id || `${shot.user}-${index}`}
                initials={shot.user.slice(0, 2).toUpperCase()}
                photoUrl={shot.photoUrl}
                label={shot.label}
                sublabel={shot.user}
                color={shot.color}
                className="tv-polaroid p-2 pb-5"
                rotate={index % 2 ? "rotate-2" : "-rotate-2"}
              />
            ))}
            {featuredShots.length === 0 && (
              <TornPaperCard className="col-span-2 grid h-56 place-items-center p-5 text-center text-2xl font-black">
                Photos will show here after proofs are approved.
              </TornPaperCard>
            )}
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
    <li className={`tv-score-row grid grid-cols-[40px_48px_1fr_58px_72px] items-center gap-2 px-3 py-2 text-zinc-950 shadow-paper ${emphasis ? "bg-uga-paper text-lg font-black" : "bg-uga-paper/95"} ${user.rank % 2 ? "-rotate-1" : "rotate-1"}`}>
      <span className={`grid h-9 w-9 place-items-center font-black ${emphasis ? "bg-uga-red text-white" : "bg-zinc-950 text-white"}`}>{user.rank}</span>
      <span className="grid h-10 w-10 place-items-center overflow-hidden bg-zinc-900 text-xs font-black text-white">
        {user.photoUrl?.startsWith("/api/files") || user.photoUrl?.startsWith("http") ? <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : user.photo}
      </span>
      <span className="hand truncate text-xl font-bold">{user.name}</span>
      <span className="text-right font-black text-uga-red">{user.points}</span>
      <span className="flex items-center justify-end gap-1 font-black">
        {user.drinks}
        <RedCupIcon />
      </span>
    </li>
  );
}

function RedCupIcon() {
  return (
    <img src="/assets/red_cup.png" alt="cups" className="h-8 w-8 object-contain" />
  );
}
