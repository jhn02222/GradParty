"use client";

import { useState } from "react";
import { useEffect } from "react";
import { BottomNav, PhotoUploadBox, RansomTitle, RedTornButton, TapeCorner } from "../components/ScrapbookComponents";
import { drinks, quests } from "../data/mockData";

export default function SubmitPage() {
  const [selected, setSelected] = useState(drinks[2]);
  const [liveQuests, setLiveQuests] = useState(quests);
  const [quest, setQuest] = useState(null);
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/quests")
      .then((response) => response.json())
      .then((data) => {
        const all = data.quests || quests;
        setLiveQuests(all);
        setQuest(all.find((item) => item.category === "Photo") || all[0]);
      })
      .catch(() => setQuest(quests.find((item) => item.category === "Photo")));
  }, []);

  async function submitProof() {
    const userId = localStorage.getItem("gradPartyUserId");
    const activeQuest = liveQuests.find((item) => item.category === "Drinks") || quest;
    if (!activeQuest?.id) return;
    setStatus("Submitting...");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        questId: activeQuest.id,
        caption,
        photoUrl,
        points: selected.points,
        drinks: selected.drinks,
      }),
    });
    setStatus(response.ok ? "Pending review!" : "Could not submit. Try again.");
  }

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-2xl" className="mb-6 text-center">CHOOSE YOUR DRINK // SUBMIT PROOF</RansomTitle>
        <div className="grid grid-cols-2 gap-4">
          {drinks.map((drink, index) => (
            <button
              key={drink.title}
              onClick={() => setSelected(drink)}
              className={`relative bg-uga-paper p-3 pb-4 text-zinc-950 shadow-paper ${selected.title === drink.title ? "outline outline-4 outline-uga-red" : ""} ${index % 2 ? "rotate-2" : "-rotate-2"}`}
              aria-pressed={selected.title === drink.title}
            >
              <TapeCorner corners={["tl", "tr", "bl", "br"]} />
              <div className={`photo-gradient mb-3 grid aspect-square place-items-center bg-gradient-to-br ${drink.tone === "amber" ? "from-amber-300 to-zinc-950" : drink.tone === "silver" ? "from-zinc-100 to-zinc-700" : drink.tone === "gold" ? "from-yellow-200 to-orange-500" : "from-uga-red to-zinc-950"} text-3xl font-black text-white`}>CUP</div>
              <h2 className="font-black uppercase text-uga-red">{drink.title}</h2>
              <p className="text-xs font-black">+{drink.points} pts</p>
              <p className="text-xs font-black">+{drink.drinks} drink</p>
            </button>
          ))}
        </div>
        <section className="mt-7 space-y-4">
          <p className="hand text-center text-lg font-bold">Also works for: {quest?.title || "photo quests"}</p>
          <PhotoUploadBox helper="Upload proof photo" small onPhoto={setPhotoUrl} />
          <label className="sr-only" htmlFor="caption">Caption</label>
          <input id="caption" value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Add a caption (optional)" className="torn-soft w-full bg-uga-paper px-4 py-3 text-zinc-950 placeholder:text-zinc-500" />
          <RedTornButton onClick={submitProof} className="w-full">SUBMIT +{selected.points} PTS</RedTornButton>
          <p className="hand text-center text-xs">Your photo will be reviewed.</p>
          {status && <p className="hand text-center text-sm font-bold text-uga-red">{status}</p>}
        </section>
      </section>
      <BottomNav />
    </main>
  );
}
