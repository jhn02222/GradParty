"use client";

import { useState } from "react";
import { useEffect } from "react";
import { BottomNav, RansomTitle, TapeCorner } from "../components/ScrapbookComponents";

const drinks = [
  { title: "Beer", type: "BEER", asset: "/assets/Beer.png", points: 5, drinks: 1 },
  { title: "Seltzer", type: "SELTZER", asset: "/assets/Seltzer.png", points: 5, drinks: 1 },
  { title: "Jello Shot", type: "JELLO_SHOT", asset: "/assets/jelloShots.png", points: 5, drinks: 1 },
  { title: "Shot", type: "SHOT", asset: "/assets/shots.png", points: 5, drinks: 1 },
];

export default function SubmitPage() {
  const [submissionTarget, setSubmissionTarget] = useState(null);
  const [submittingType, setSubmittingType] = useState("");
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

  async function submitDrinkProof(drink, file) {
    const userId = localStorage.getItem("gradPartyUserId");
    const userName = localStorage.getItem("gradPartyGuestName");
    if (!submissionTarget?.id || submittingType) return;
    if (!file) return;

    const signature = `${file.name}:${file.size}:${file.lastModified}`;
    const submittedPhotos = JSON.parse(localStorage.getItem("gradPartySubmittedProofs") || "[]");
    if (submittedPhotos.includes(signature)) {
      setStatus("Use a new photo for this drink.");
      return;
    }

    setSubmittingType(drink.type);
    setStatus(`Uploading ${drink.title} proof...`);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "submissions");
      const uploadResponse = await fetch("/api/upload", { method: "POST", body: form });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error || "Upload failed");

      setStatus(`Submitting ${drink.title}...`);
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          questId: submissionTarget.id,
          drinkType: drink.type,
          photoUrl: uploadData.url,
          points: drink.points,
          drinks: drink.drinks,
        }),
      });
      if (!response.ok) throw new Error("Could not submit");
      localStorage.setItem("gradPartySubmittedProofs", JSON.stringify([...submittedPhotos, signature].slice(-100)));
      setStatus(`${drink.title} added!`);
    } catch (submitError) {
      console.error(submitError);
      setStatus("Could not submit. Try another photo.");
    } finally {
      setSubmittingType("");
    }
  }

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-2xl" className="mb-6 text-center">CHOOSE YOUR DRINK</RansomTitle>
        <p className="hand mb-5 text-center text-lg font-black">Tap a drink, then upload/take its photo proof.</p>
        <div className="grid grid-cols-2 gap-4">
          {drinks.map((drink, index) => (
            <label
              key={drink.title}
              className={`relative block bg-uga-paper p-3 pb-4 text-center text-zinc-950 shadow-paper ${submittingType === drink.type ? "outline outline-4 outline-uga-red" : ""} ${index % 2 ? "rotate-2" : "-rotate-2"}`}
            >
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                disabled={Boolean(submittingType)}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  submitDrinkProof(drink, file);
                }}
              />
              <TapeCorner corners={["tl", "tr", "bl", "br"]} />
              <div className="mb-3 grid aspect-square place-items-center overflow-hidden bg-white/70">
                <img src={drink.asset} alt="" className="h-full w-full object-contain p-3" />
              </div>
              <h2 className="font-black uppercase text-uga-red">{drink.title}</h2>
              <p className="text-xs font-black">+{drink.points} pts</p>
              <p className="text-xs font-black">{submittingType === drink.type ? "Submitting..." : "Tap to add photo"}</p>
            </label>
          ))}
        </div>
        {status && <p className="hand mt-7 text-center text-sm font-bold text-uga-red">{status}</p>}
      </section>
      <BottomNav />
    </main>
  );
}
