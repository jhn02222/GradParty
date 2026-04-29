"use client";

import { useEffect, useState } from "react";
import { BottomNav, PolaroidCard, RansomTitle, RedTornButton } from "../components/ScrapbookComponents";
import { gallery } from "../data/mockData";

export default function GalleryPage() {
  const [shots, setShots] = useState(gallery);
  const tabs = ["All", "Drinks", "Photos", "Badges"];

  useEffect(() => {
    fetch("/api/gallery")
      .then((response) => response.json())
      .then((data) => setShots(data.gallery?.length ? data.gallery : gallery))
      .catch(() => {});
  }, []);

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-6 text-center">GALLERY</RansomTitle>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab, index) => (
            <button key={tab} className={`torn-soft shrink-0 px-4 py-2 text-xs font-black uppercase ${index === 0 ? "bg-uga-red text-white" : "bg-uga-paper text-zinc-950"}`}>{tab}</button>
          ))}
        </div>
        <div className="columns-2 gap-4">
          {shots.map((shot, index) => (
            <PolaroidCard
              key={shot.user + shot.quest}
              label={shot.user}
              sublabel={`${shot.quest} +${shot.points}`}
              initials={shot.user.split(" ").map((part) => part[0]).join("")}
              photoUrl={shot.photoUrl}
              color={shot.color}
              rotate={index % 3 === 0 ? "-rotate-3" : index % 3 === 1 ? "rotate-2" : "-rotate-1"}
              className={`mb-5 break-inside-avoid ${index % 2 ? "translate-y-6" : ""}`}
            />
          ))}
        </div>
        <RedTornButton className="fixed bottom-24 left-1/2 z-30 w-[min(340px,calc(100%-40px))] -translate-x-1/2">Upload Photo</RedTornButton>
      </section>
      <BottomNav />
    </main>
  );
}
