"use client";

import { useEffect, useState } from "react";
import { BottomNav, PolaroidCard, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";
import { currentUser, feed } from "../data/mockData";

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("gradPartyUserId");
    fetch(`/api/home${userId ? `?userId=${userId}` : ""}`)
      .then((response) => response.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const user = data?.user || currentUser;
  const liveFeed = data?.feed || feed;
  const nextBadge = data?.nextBadge || { name: "3-Peat", current: 2, target: 3 };
  const stats = [
    ["Drinks", data?.stats?.drinks ?? user.drinks],
    ["Points", data?.stats?.points ?? user.points],
    ["Rank", data?.stats?.rank ?? user.rank],
    ["Badges", data?.stats?.badges ?? user.badges],
  ];

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <header className="mb-8 flex items-center justify-between">
          <RansomTitle size="text-2xl">GRAD PARTY</RansomTitle>
          <div className="grid h-14 w-14 place-items-center overflow-hidden border-4 border-uga-paper bg-zinc-900 font-black text-white shadow-paper">{user.photoUrl?.startsWith("data:") || user.photoUrl?.startsWith("http") ? <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" /> : user.photo}</div>
        </header>
        <h2 className="hand mb-5 text-4xl font-black">Hey, {user.name}</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(([label, value], index) => (
            <TornPaperCard key={label} rotate={index % 2 ? "rotate-1" : "-rotate-1"} className="p-4 text-center">
              <p className="text-xs font-black uppercase text-uga-red">{label}</p>
              <b className="text-4xl">{value}</b>
            </TornPaperCard>
          ))}
        </div>
        <TornPaperCard className="mt-6 p-5">
          <p className="text-xs font-black uppercase text-uga-red">Next Badge</p>
          <div className="mt-2 flex items-center gap-4">
            <PolaroidCard initials="3" label={nextBadge.name} className="w-24 rotate-[-4deg]" />
            <div className="flex-1">
              <h3 className="hand text-2xl font-black">{nextBadge.name}</h3>
              <p className="text-sm font-bold">{nextBadge.current} of {nextBadge.target} quest proofs approved.</p>
              <div className="mt-3 h-3 bg-zinc-300"><span className="block h-full bg-uga-red" style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }} /></div>
            </div>
          </div>
        </TornPaperCard>
        <RedTornButton href="/quests" className="mt-6 w-full">Browse Quests</RedTornButton>
        <section className="mt-7">
          <h3 className="mb-3 text-sm font-black uppercase">Recent Activity</h3>
          <div className="space-y-3">
            {liveFeed.slice(0, 3).map((item, index) => (
              <TornPaperCard key={item.action} rotate={index % 2 ? "rotate-1" : "-rotate-1"} className="p-3 text-sm">
                <b>{item.user}</b> {item.action} <span className="font-black text-uga-red">+{item.points}</span>
              </TornPaperCard>
            ))}
          </div>
        </section>
      </section>
      <BottomNav />
    </main>
  );
}
