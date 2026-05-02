"use client";

import { useEffect, useState } from "react";
import { LeaderboardRow, LiveFeedItem, PolaroidCard, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function TvPage() {
  const [data, setData] = useState(null);
  const leaders = data?.users || [];
  const totalDrinks = data?.totals?.drinks ?? leaders.reduce((sum, user) => sum + user.drinks, 0);
  const totalPlayers = data?.totals?.players ?? leaders.length;
  const totalProofs = data?.totals?.proofs ?? 0;
  const liveFeed = data?.feed || [];
  const partyCam = data?.gallery || [];

  useEffect(() => {
    function load() {
      fetch("/api/tv").then((response) => response.json()).then(setData).catch(() => {});
    }
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="paper-bg min-h-svh overflow-hidden p-5">
      <section className="relative mx-auto grid aspect-video max-h-[calc(100svh-40px)] max-w-[177vh] grid-cols-[270px_1fr_330px] gap-5">
        <aside className="flex flex-col justify-between border-r-2 border-uga-paper/40 pr-4">
          <div>
            <RansomTitle size="text-4xl" className="mb-6">GRAD PARTY</RansomTitle>
            <TornPaperCard className="mb-5 p-5">
              <p className="hand text-3xl font-black leading-tight">EAT. DRINK.</p>
              <p className="hand text-3xl font-black leading-tight text-uga-red">GO DAWGS.</p>
              <div className="mt-5 grid h-28 place-items-center border-2 border-dashed border-zinc-900 font-black">DAWG DOODLE</div>
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
        <section className="px-2">
          <RansomTitle size="text-5xl" className="mb-2 text-center">LEADERBOARD</RansomTitle>
          <p className="hand mb-3 text-xl font-bold uppercase">Top grads ranking</p>
          <ol className="space-y-2">
            {leaders.map((user, index) => <LeaderboardRow key={user.id || user.name} user={user} emphasis={index < 3} />)}
            {leaders.length === 0 && <TornPaperCard className="p-8 text-center text-3xl font-black">Waiting for the first guest to join.</TornPaperCard>}
          </ol>
        </section>
        <aside className="space-y-4">
          <TornPaperCard className="p-5 text-center">
            <p className="text-sm font-black uppercase">Total Drinks</p>
            <b className="text-6xl text-uga-red">{totalDrinks}</b>
            <p className="font-black">CUP COUNT</p>
          </TornPaperCard>
          <section className="rounded-lg border border-uga-paper/35 bg-black/35 p-4">
            <RansomTitle size="text-2xl" className="mb-4">LIVE FEED</RansomTitle>
            <div className="space-y-3">
              {liveFeed.slice(0, 5).map((item, index) => <LiveFeedItem key={item.id || item.action} item={item} index={index} compact />)}
              {liveFeed.length === 0 && <p className="hand text-center text-uga-paper">No activity yet.</p>}
            </div>
          </section>
          <section className="rounded-lg border border-uga-paper/35 bg-black/35 p-4">
            <RansomTitle size="text-2xl" className="mb-4">PARTY CAM</RansomTitle>
            <div className="grid grid-cols-3 gap-2">
              {partyCam.slice(0, 3).map((shot, index) => (
                <PolaroidCard key={shot.id || shot.user} initials={shot.user.slice(0, 2).toUpperCase()} photoUrl={shot.photoUrl} label={shot.label} color={shot.color} className="p-2 pb-5" rotate={index % 2 ? "rotate-3" : "-rotate-3"} />
              ))}
            </div>
            <RedTornButton href="/gallery" className="mt-4 w-full text-sm">View Gallery</RedTornButton>
          </section>
          <TornPaperCard className="grid grid-cols-[70px_1fr] items-center gap-3 p-3">
            <div className="grid h-16 w-16 grid-cols-3 grid-rows-3 gap-1 bg-zinc-950 p-1">
              {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? "bg-uga-paper" : "bg-uga-red"} />)}
            </div>
            <p className="hand text-xl font-black">Scan QR Code to Join</p>
          </TornPaperCard>
        </aside>
        <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-uga-red py-2 text-2xl font-black uppercase text-white">
          <p className="ticker whitespace-nowrap">Keep Hydrating! // Submit your Best Fit Check photos // Scan QR Code to Join! // </p>
        </div>
      </section>
    </main>
  );
}
