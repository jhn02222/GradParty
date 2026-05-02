"use client";

import { useState } from "react";
import { Confetti, RansomTitle } from "../components/ScrapbookComponents";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveProfile(event) {
    event.preventDefault();
    if (saving) return;
    const guestName = name.trim();
    if (!guestName) {
      setError("Add your name first.");
      return;
    }
    setSaving(true);
    setError("");
    localStorage.setItem("gradPartyGuestName", guestName);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not create user");
      if (data.user?.id) localStorage.setItem("gradPartyUserId", data.user.id);
      window.location.href = "/home";
    } catch (joinError) {
      console.error(joinError);
      setError("Could not save your profile. Check Railway variables/logs.");
      setSaving(false);
    }
  }

  return (
    <main className="paper-bg safe-top grid min-h-svh place-items-center px-5 py-8">
      <Confetti />
      <section className="mobile-page flex min-h-[760px] flex-col items-center justify-center gap-7 p-0">
        <RansomTitle size="text-5xl" className="-rotate-2 text-center">GRAD PARTY</RansomTitle>
        <p className="hand max-w-xs text-center text-2xl font-black">Put your name in and you are in.</p>
        <label className="sr-only" htmlFor="guest-name">Name</label>
        <input
          id="guest-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="torn-soft w-full bg-uga-paper px-5 py-4 text-center text-xl font-black text-zinc-950 placeholder:text-zinc-600"
        />
        <button
          type="button"
          onClick={saveProfile}
          className="torn relative inline-flex min-h-12 w-full items-center justify-center bg-uga-red px-6 py-3 text-center text-lg font-black uppercase text-white shadow-paper transition hover:scale-[1.02] active:scale-95"
        >
          {saving ? "SAVING..." : "JOIN"}
        </button>
        {error && <p className="hand text-center text-sm font-bold text-uga-red">{error}</p>}
      </section>
    </main>
  );
}
