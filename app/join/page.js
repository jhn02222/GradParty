"use client";

import { useState } from "react";
import { Confetti, PhotoUploadBox, RansomTitle } from "../components/ScrapbookComponents";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function saveProfile() {
    if (saving) return;
    const guestName = name.trim() || "Chris J.";
    setSaving(true);
    setError("");
    localStorage.setItem("gradPartyGuestName", guestName);
    localStorage.setItem("gradPartyGuestNickname", nickname.trim());

    fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name: guestName,
          nickname,
          photoUrl: photoUrl.length < 650000 ? photoUrl : "",
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.user?.id) localStorage.setItem("gradPartyUserId", data.user.id);
      })
      .catch((joinError) => {
        console.error(joinError);
        setError("Could not save to the leaderboard yet, but you can still play.");
      });
  }

  return (
    <main className="paper-bg safe-top grid min-h-svh place-items-center px-5 py-8">
      <Confetti />
      <section className="mobile-page flex min-h-[760px] flex-col items-center justify-center gap-6 p-0">
        <RansomTitle size="text-5xl" className="-rotate-2 text-center">GRAD PARTY</RansomTitle>
        <PhotoUploadBox onPhoto={setPhotoUrl} />
        <div className="w-full space-y-4">
          <label className="sr-only" htmlFor="guest-name">What do we call you?</label>
          <input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="What do we call you?"
            className="torn-soft w-full bg-uga-paper px-5 py-4 text-center font-black text-zinc-950 placeholder:text-zinc-600"
          />
          <label className="sr-only" htmlFor="nickname">Optional nickname</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Nickname (optional)"
            className="torn-soft w-full bg-uga-paper px-5 py-4 text-center font-black text-zinc-950 placeholder:text-zinc-600"
          />
        </div>
        <a
          href="/home"
          onClick={saveProfile}
          className="torn relative inline-flex min-h-12 w-full items-center justify-center bg-uga-red px-6 py-3 text-center text-lg font-black uppercase text-white shadow-paper transition hover:scale-[1.02] active:scale-95"
        >
          {saving ? "MAKING YOUR CARD..." : "LET'S GO! (Start the Quest)"}
        </a>
        <a href="/home" className="hand text-center text-sm font-bold underline">Skip profile and enter</a>
        {error && <p className="hand text-center text-sm font-bold text-uga-red">{error}</p>}
      </section>
    </main>
  );
}
