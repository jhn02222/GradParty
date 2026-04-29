"use client";

import { useEffect, useState } from "react";
import { BadgeIcon, BottomNav, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function QuestsPage() {
  const [liveQuests, setLiveQuests] = useState([]);
  const tabs = ["All", "Drinks", "Photo", "Party", "Bonus"];

  useEffect(() => {
    fetch("/api/quests")
      .then((response) => response.json())
      .then((data) => setLiveQuests(data.quests || []))
      .catch(() => {});
  }, []);

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-6 text-center">QUESTS</RansomTitle>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab, index) => (
            <button key={tab} className={`torn-soft shrink-0 px-4 py-2 text-xs font-black uppercase ${index === 0 ? "bg-uga-red text-white" : "bg-uga-paper text-zinc-950"}`}>{tab}</button>
          ))}
          {liveQuests.length === 0 && <p className="hand text-center text-xl font-black">Quests are loading. If this stays empty, check the database migration.</p>}
        </div>
        <div className="space-y-4">
          {liveQuests.map((quest, index) => (
            <TornPaperCard key={quest.title} dark={index % 2 === 1} rotate={index % 2 ? "rotate-1" : "-rotate-1"} className="p-4">
              <div className="grid grid-cols-[54px_1fr_auto] items-center gap-3">
                <BadgeIcon icon={quest.icon} label={quest.title} />
                <div>
                  <h2 className="hand text-xl font-black">{quest.title}</h2>
                  <p className="text-xs font-bold opacity-80">{quest.description}</p>
                  <p className="mt-2 text-[10px] font-black uppercase text-uga-red">{quest.status}</p>
                </div>
                <div className="text-right text-sm font-black">
                  <p>+{quest.points} pts</p>
                  <p>{quest.drinks} drinks</p>
                </div>
              </div>
            </TornPaperCard>
          ))}
        </div>
        <RedTornButton href="/submit" className="mt-7 w-full">Submit Quest</RedTornButton>
      </section>
      <BottomNav />
    </main>
  );
}
