"use client";

import { useEffect, useState } from "react";
import { BottomNav, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("gradPartyUserId");
    const guestName = localStorage.getItem("gradPartyGuestName");
    fetch(`/api/home${userId ? `?userId=${userId}` : ""}`)
      .then((response) => response.json())
      .then((homeData) => {
        if (!userId && guestName) {
          homeData.user = { name: guestName, photo: guestName.slice(0, 2).toUpperCase(), points: 0, drinks: 0, badges: 0, rank: "-" };
        }
        setData(homeData);
      })
      .catch(() => {});
  }, []);

  const user = data?.user || { name: "New Grad", photo: "NG", points: 0, drinks: 0, badges: 0, rank: "-" };

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top flex min-h-svh flex-col justify-center">
        <header className="mb-10 text-center">
          <RansomTitle size="text-4xl">GRAD PARTY</RansomTitle>
        </header>
        <TornPaperCard className="p-6 text-center">
          <p className="text-xs font-black uppercase text-uga-red">Welcome</p>
          <h2 className="hand mt-2 text-4xl font-black">Hey, {user.name}</h2>
          <p className="mt-4 text-sm font-bold">Ready when you are.</p>
        </TornPaperCard>
        <RedTornButton href="/submit" className="mt-6 w-full">Submit Proof</RedTornButton>
      </section>
      <BottomNav />
    </main>
  );
}
