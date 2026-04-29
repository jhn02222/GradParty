"use client";

import { useState } from "react";
import { Confetti, PhotoUploadBox, RansomTitle, RedTornButton } from "../components/ScrapbookComponents";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    const response = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || "Chris J.", nickname, photoUrl }),
    });
    const data = await response.json();
    if (data.user?.id) {
      localStorage.setItem("gradPartyUserId", data.user.id);
    }
    window.location.href = "/home";
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
        <RedTornButton onClick={saveProfile} className="w-full text-lg">{saving ? "MAKING YOUR CARD..." : "LET'S GO! (Start the Quest)"}</RedTornButton>
      </section>
    </main>
  );
}
