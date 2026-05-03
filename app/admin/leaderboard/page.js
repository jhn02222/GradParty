"use client";

import { useEffect, useState } from "react";
import { RansomTitle, RedTornButton, TornPaperCard } from "../../components/ScrapbookComponents";

const drinkIconAssets = [
  ["BEER", "/assets/Beer.png", "beer"],
  ["SELTZER", "/assets/Seltzer.png", "seltzer"],
  ["JELLO_SHOT", "/assets/jelloShots.png", "jello shot"],
  ["SHOT", "/assets/shots.png", "shot"],
];

export default function AdminLeaderboardPage() {
  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  const leaders = data?.users || [];

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
          <RansomTitle size="text-4xl" className="mb-7">LEADERBOARD</RansomTitle>
          <TornPaperCard className="p-6">
            <p className="mb-4 text-sm font-black uppercase text-uga-red">Admin Only</p>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Admin PIN"
              className="torn-soft mb-4 w-full bg-white px-4 py-3 text-center font-black text-zinc-950 placeholder:text-zinc-500"
            />
            <RedTornButton onClick={() => load(pin)} className="w-full">Open</RedTornButton>
            {message && <p className="hand mt-4 text-sm font-black text-uga-red">{message}</p>}
          </TornPaperCard>
        </section>
      </main>
    );
  }

  return (
    <main className="paper-bg min-h-svh px-4 py-6">
      <section className="mx-auto max-w-md pb-8">
        <header className="mb-5 text-center">
          <RansomTitle size="text-4xl">LEADERBOARD</RansomTitle>
          <p className="hand mt-2 text-lg font-black">Refreshes automatically</p>
        </header>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <TornPaperCard className="p-4 text-center">
            <p className="text-xs font-black uppercase text-uga-red">Total Drinks</p>
            <b className="text-4xl">{data?.totals?.drinks ?? 0}</b>
          </TornPaperCard>
          <TornPaperCard className="p-4 text-center">
            <p className="text-xs font-black uppercase text-uga-red">Photos</p>
            <b className="text-4xl">{data?.totals?.proofs ?? 0}</b>
          </TornPaperCard>
        </div>
        <ol className="space-y-3">
          {leaders.map((user) => (
            <TornPaperCard key={user.id || user.name} className="p-4">
              <div className="grid grid-cols-[42px_1fr_auto] items-center gap-3">
                <span className="text-center text-2xl font-black text-uga-red">{user.rank}</span>
                <div className="min-w-0">
                  <h2 className="hand truncate text-3xl font-black">{user.name}</h2>
                  <DrinkTypeIcons counts={user.drinkCounts || {}} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-uga-red">{user.points} pts</p>
                  <p className="flex items-center justify-end gap-1 text-2xl font-black">
                    {user.drinks}
                    <img src="/assets/red_cup.png" alt="cups" className="h-8 w-8 object-contain" />
                  </p>
                </div>
              </div>
            </TornPaperCard>
          ))}
        </ol>
      </section>
    </main>
  );
}

function DrinkTypeIcons({ counts }) {
  const icons = drinkIconAssets.flatMap(([type, src, label]) =>
    Array.from({ length: counts[type] || 0 }).map((_, index) => ({ key: `${type}-${index}`, src, label }))
  );
  const visible = icons.slice(0, 8);
  const hidden = Math.max(0, icons.length - visible.length);
  return (
    <div className="mt-2 flex items-center gap-1 overflow-hidden">
      {visible.map((icon) => (
        <img key={icon.key} src={icon.src} alt={icon.label} className="h-7 w-7 shrink-0 object-contain" />
      ))}
      {hidden > 0 && <b className="shrink-0 text-xs">+{hidden}</b>}
    </div>
  );
}
