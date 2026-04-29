"use client";

import { useEffect, useState } from "react";
import { BadgeIcon, BottomNav, RansomTitle, TornPaperCard } from "../components/ScrapbookComponents";

export default function AwardsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("gradPartyUserId");
    fetch(`/api/awards${userId ? `?userId=${userId}` : ""}`)
      .then((response) => response.json())
      .then((data) => setItems(data.badges || []))
      .catch(() => {});
  }, []);

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-7 text-center">AWARDS</RansomTitle>
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase">Your Badges</h2>
            <span className="text-xs font-black text-uga-red">View all</span>
          </div>
          <div className="flex justify-between gap-2">
            {items.map((badge) => (
              <div key={badge.name} className="grid place-items-center gap-2 text-center">
                <BadgeIcon icon={badge.icon} label={badge.name} locked={badge.locked} large />
                <span className="w-16 text-[9px] font-black uppercase leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
          {items.length === 0 && <p className="hand text-center text-lg font-black">Badges will appear after quests are submitted.</p>}
        </section>
        <h2 className="mb-3 text-xs font-black uppercase">Recently Earned</h2>
        <div className="space-y-4">
          {items.map((badge, index) => (
            <TornPaperCard key={badge.name} dark rotate={index % 2 ? "rotate-1" : "-rotate-1"} className={`p-4 ${badge.locked ? "opacity-55" : ""}`}>
              <div className="grid grid-cols-[54px_1fr_auto] items-center gap-3">
                <BadgeIcon icon={badge.icon} label={badge.name} locked={badge.locked} />
                <div>
                  <h3 className="hand text-lg font-black">{badge.name}</h3>
                  <p className="text-xs opacity-75">{badge.description}</p>
                </div>
                <span className="text-[10px] font-black text-uga-red">{badge.earned}</span>
              </div>
            </TornPaperCard>
          ))}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
