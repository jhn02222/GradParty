"use client";

import { useEffect, useState } from "react";
import { PolaroidCard, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function TvPage() {
  const [data, setData] = useState(null);
  const leaders = data?.users || [];
  const totalDrinks = data?.totals?.drinks ?? leaders.reduce((sum, user) => sum + user.drinks, 0);
  const totalPlayers = data?.totals?.players ?? leaders.length;
  const totalProofs = data?.totals?.proofs ?? 0;
  const partyCam = data?.gallery || [];
  const photoLoop = partyCam.length ? [...partyCam, ...partyCam, ...partyCam] : [];

  useEffect(() => {
    function load() {
      fetch("/api/tv").then((response) => response.json()).then(setData).catch(() => {});
    }
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="paper-bg h-svh overflow-hidden p-4">
      <section className="mx-auto grid h-full max-w-[1920px] grid-cols-[250px_minmax(560px,0.82fr)_minmax(430px,0.58fr)] grid-rows-[238px_minmax(0,1fr)_54px] gap-4">
        <aside className="row-span-2 flex min-h-0 flex-col justify-between border-r-2 border-uga-paper/40 pr-4">
          <div>
            <RansomTitle size="text-4xl" className="mb-5">GRAD PARTY</RansomTitle>
            <TornPaperCard className="p-5">
              <p className="hand text-3xl font-black leading-tight">EAT. DRINK.</p>
              <p className="hand text-3xl font-black leading-tight text-uga-red">GO DAWGS.</p>
              <div className="mt-4 grid h-24 place-items-center border-2 border-dashed border-zinc-900 font-black">DAWG DOODLE</div>
            </TornPaperCard>
          </div>
          <div className="space-y-3">
            {[
              ["Total Players", totalPlayers],
              ["Total Drinks", totalDrinks],
              ["Total Proofs", totalProofs],
            ].map(([label, value], index) => (
              <TornPaperCard key={label} rotate={index % 2 ? "rotate-1" : "-rotate-1"} className="p-4">
                <p className="text-sm font-black uppercase text-uga-red">{label}</p>
                <b className="text-4xl">{value}</b>
              </TornPaperCard>
            ))}
          </div>
        </aside>

        <section className="col-span-2 min-w-0 overflow-hidden rounded-lg border border-uga-paper/35 bg-black/35 p-4">
          <div className="mb-3 flex items-center justify-between gap-5">
            <RansomTitle size="text-4xl">PARTY CAM</RansomTitle>
            <RedTornButton href="/gallery" className="min-h-10 px-5 py-2 text-sm">View Gallery</RedTornButton>
          </div>
          <div className="relative overflow-hidden">
            <div className={`flex gap-5 ${photoLoop.length ? "party-photo-scroll" : ""}`}>
              {photoLoop.map((shot, index) => (
                <PolaroidCard
                  key={`${shot.id || shot.user}-${index}`}
                  initials={shot.user.slice(0, 2).toUpperCase()}
                  photoUrl={shot.photoUrl}
                  label={shot.user}
                  sublabel={shot.label}
                  color={shot.color}
                  className="w-36 shrink-0 p-2 pb-5"
                  rotate={index % 2 ? "rotate-2" : "-rotate-2"}
                />
              ))}
              {photoLoop.length === 0 && (
                <TornPaperCard className="grid h-36 w-full place-items-center p-5 text-center text-2xl font-black">
                  Photos will scroll here after the first proof is approved.
                </TornPaperCard>
              )}
            </div>
          </div>
        </section>

        <section className="min-h-0 px-1">
          <RansomTitle size="text-5xl" className="mb-2 text-center">LEADERBOARD</RansomTitle>
          <p className="hand mb-3 text-lg font-bold uppercase">Top grads ranking</p>
          <ol className="space-y-2 overflow-hidden pr-1">
            {leaders.slice(0, 8).map((user, index) => <TvLeaderboardRow key={user.id || user.name} user={user} emphasis={index < 3} />)}
            {leaders.length === 0 && <TornPaperCard className="p-8 text-center text-3xl font-black">Waiting for the first guest to join.</TornPaperCard>}
          </ol>
        </section>

        <aside className="min-h-0 space-y-4 overflow-hidden">
          <TornPaperCard className="p-5 text-center">
            <p className="text-sm font-black uppercase">Total Drinks</p>
            <b className="text-6xl text-uga-red">{totalDrinks}</b>
            <p className="font-black">CUP COUNT</p>
          </TornPaperCard>
          <TornPaperCard className="p-5 text-center">
            <p className="text-sm font-black uppercase">Approved Proofs</p>
            <b className="text-6xl text-uga-red">{totalProofs}</b>
            <p className="font-black">PHOTO COUNT</p>
          </TornPaperCard>
          <TornPaperCard className="grid grid-cols-[70px_1fr] items-center gap-3 p-3">
            <div className="grid h-16 w-16 grid-cols-3 grid-rows-3 gap-1 bg-zinc-950 p-1">
              {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? "bg-uga-paper" : "bg-uga-red"} />)}
            </div>
            <p className="hand text-xl font-black">Scan QR Code to Join</p>
          </TornPaperCard>
        </aside>

        <div className="col-span-3 self-end overflow-hidden bg-uga-red py-2 text-2xl font-black uppercase text-white">
          <p className="ticker whitespace-nowrap">Join! // Keep Hydrating! // Submit your best photos // Scan QR Code to Join! // </p>
        </div>
      </section>
    </main>
  );
}

function TvLeaderboardRow({ user, emphasis = false }) {
  return (
    <li className={`torn-soft grid grid-cols-[38px_46px_1fr_54px_68px] items-center gap-2 px-3 py-2 text-zinc-950 shadow-paper ${emphasis ? "bg-uga-paper text-lg font-black" : "bg-uga-paper/95"} ${user.rank % 2 ? "-rotate-1" : "rotate-1"}`}>
      <span className={`grid h-8 w-8 place-items-center font-black ${emphasis ? "bg-uga-red text-white" : "bg-zinc-950 text-white"}`}>{user.rank}</span>
      <span className="grid h-10 w-10 place-items-center overflow-hidden bg-zinc-900 text-xs font-black text-white">
        {user.photoUrl?.startsWith("/api/files") || user.photoUrl?.startsWith("http") ? <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : user.photo}
      </span>
      <span className="hand truncate text-xl font-bold">{user.name}</span>
      <span className="text-right font-black text-uga-red">{user.points}</span>
      <span className="text-right font-black">{user.drinks} CUP</span>
    </li>
  );
}
