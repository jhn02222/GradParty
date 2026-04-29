"use client";

import { useEffect, useState } from "react";
import { BottomNav, PolaroidCard, RansomTitle, TornPaperCard } from "../components/ScrapbookComponents";
import { currentUser } from "../data/mockData";

export default function ProfilePage() {
  const [profile, setProfile] = useState(currentUser);
  useEffect(() => {
    const userId = localStorage.getItem("gradPartyUserId");
    fetch(`/api/profile${userId ? `?userId=${userId}` : ""}`)
      .then((response) => response.json())
      .then((data) => data.user && setProfile(data.user))
      .catch(() => {});
  }, []);

  const stats = [
    ["Drinks", profile.drinks],
    ["Points", profile.points],
    ["Rank", profile.rank ? `${profile.rank}` : currentUser.rank],
    ["Badges", profile.badges],
  ];
  const menu = ["My Submissions", "My Badges", "My Stats", "Settings"];

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-6 text-center">PROFILE</RansomTitle>
        <div className="relative mx-auto mb-3 w-56">
          <PolaroidCard initials={profile.photo} photoUrl={profile.photoUrl} color="from-zinc-200 to-red-800" label={profile.name} />
          <button className="absolute bottom-10 right-1 grid h-10 w-10 place-items-center rounded-full border-2 border-zinc-950 bg-uga-paper text-sm font-black text-zinc-950" aria-label="Edit profile photo">CAM</button>
        </div>
        <TornPaperCard className="mx-auto mb-6 w-56 p-3 text-center">
          <h2 className="hand text-3xl font-black">{profile.name}</h2>
        </TornPaperCard>
        <div className="grid grid-cols-4 gap-2">
          {stats.map(([label, value]) => (
            <TornPaperCard key={label} dark className="p-3 text-center">
              <p className="text-[10px] font-black uppercase">{label}</p>
              <b className="text-xl text-uga-red">{value}</b>
            </TornPaperCard>
          ))}
        </div>
        <div className="mt-7 space-y-3">
          {menu.map((item, index) => (
            <button key={item} className={`torn-soft flex w-full items-center justify-between border border-uga-paper/50 bg-zinc-950 px-4 py-4 text-left font-black text-uga-paper shadow-paper ${index % 2 ? "rotate-1" : "-rotate-1"}`}>
              <span>{item}</span>
              <span aria-hidden="true">&gt;</span>
            </button>
          ))}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
