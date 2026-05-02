"use client";

import { useState } from "react";
import { useEffect } from "react";
import { BottomNav, RansomTitle, RedTornButton, TapeCorner } from "../components/ScrapbookComponents";

const drinks = [
  { title: "Beer", type: "BEER", asset: "/assets/Beer.png", points: 5, drinks: 1 },
  { title: "Seltzer", type: "SELTZER", asset: "/assets/Seltzer.png", points: 5, drinks: 1 },
  { title: "Jello Shot", type: "JELLO_SHOT", asset: "/assets/jelloShots.png", points: 5, drinks: 1 },
  { title: "Shot", type: "SHOT", asset: "/assets/shots.png", points: 5, drinks: 1 },
];

export default function SubmitPage() {
  const [selected, setSelected] = useState(drinks[2]);
  const [submissionTarget, setSubmissionTarget] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/quests")
      .then((response) => response.json())
      .then((data) => {
        const all = data.quests || [];
        setSubmissionTarget(all.find((item) => item.category === "Drinks") || all[0]);
      })
      .catch(() => setSubmissionTarget(null));
  }, []);

  async function submitProof() {
    const userId = localStorage.getItem("gradPartyUserId");
    const userName = localStorage.getItem("gradPartyGuestName");
    if (!submissionTarget?.id) return;
    setStatus("Submitting...");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userName,
        questId: submissionTarget.id,
        drinkType: selected.type,
        points: selected.points,
        drinks: selected.drinks,
      }),
    });
    setStatus(response.ok ? `${selected.title} added!` : "Could not submit. Try again.");
  }

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-2xl" className="mb-6 text-center">CHOOSE YOUR DRINK</RansomTitle>
        <p className="hand mb-5 text-center text-lg font-black">Tap a drink. No photo needed.</p>
        <div className="grid grid-cols-2 gap-4">
          {drinks.map((drink, index) => (
            <button
              key={drink.title}
              onClick={() => setSelected(drink)}
              className={`relative bg-uga-paper p-3 pb-4 text-zinc-950 shadow-paper ${selected.title === drink.title ? "outline outline-4 outline-uga-red" : ""} ${index % 2 ? "rotate-2" : "-rotate-2"}`}
              aria-pressed={selected.title === drink.title}
            >
              <TapeCorner corners={["tl", "tr", "bl", "br"]} />
              <div className="mb-3 grid aspect-square place-items-center overflow-hidden bg-white/70">
                <img src={drink.asset} alt="" className="h-full w-full object-contain p-3" />
              </div>
              <h2 className="font-black uppercase text-uga-red">{drink.title}</h2>
              <p className="text-xs font-black">+{drink.points} pts</p>
              <p className="text-xs font-black">+{drink.drinks} drink</p>
            </button>
          ))}
        </div>
        <section className="mt-7 space-y-4">
          <RedTornButton onClick={submitProof} className="w-full">SUBMIT {selected.title}</RedTornButton>
          {status && <p className="hand text-center text-sm font-bold text-uga-red">{status}</p>}
        </section>
      </section>
      <BottomNav />
    </main>
  );
}
