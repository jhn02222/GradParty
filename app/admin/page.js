"use client";

import { useEffect, useState } from "react";
import { PolaroidCard, RansomTitle, RedTornButton, TornPaperCard } from "../components/ScrapbookComponents";
import { submissions } from "../data/mockData";

export default function AdminPage() {
  const [items, setItems] = useState(submissions);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedPin = localStorage.getItem("gradPartyAdminPin") || "";
    setPin(savedPin);
    load(savedPin);
  }, []);

  function load(adminPin = pin) {
    fetch("/api/admin/submissions", { headers: adminPin ? { "x-admin-pin": adminPin } : {} })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          setItems([]);
          return;
        }
        setMessage("");
        setItems(data.submissions || []);
      })
      .catch(() => {});
  }

  async function review(id, status) {
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(pin ? { "x-admin-pin": pin } : {}) },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error || "Could not review submission");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="paper-bg min-h-svh px-4 py-8 md:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <RansomTitle size="text-4xl">ADMIN REVIEW</RansomTitle>
            <p className="hand mt-3 text-xl">Approve proof, reject blurry chaos, keep the board moving.</p>
          </div>
          <a href="/tv" className="torn-soft bg-uga-paper px-5 py-3 text-sm font-black uppercase text-zinc-950 shadow-paper">Open TV Board</a>
        </header>
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="Admin PIN"
            className="torn-soft flex-1 bg-uga-paper px-4 py-3 font-black text-zinc-950 placeholder:text-zinc-500"
          />
          <button
            onClick={() => {
              localStorage.setItem("gradPartyAdminPin", pin);
              load(pin);
            }}
            className="torn-soft bg-uga-red px-5 py-3 text-sm font-black uppercase text-white shadow-paper"
          >
            Unlock Queue
          </button>
        </div>
        {message && <p className="hand mb-5 text-center text-xl font-black text-uga-red">{message}</p>}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((submission, index) => (
            <TornPaperCard key={submission.user + submission.quest} className={`p-5 ${index % 2 ? "rotate-1" : "-rotate-1"}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center bg-zinc-950 text-xs font-black text-white">{submission.photo}</span>
                <div>
                  <h2 className="hand text-2xl font-black">{submission.user}</h2>
                  <p className="text-xs font-black uppercase text-uga-red">{submission.quest}</p>
                </div>
              </div>
              <PolaroidCard initials="PROOF" photoUrl={submission.photoUrl} label={submission.quest} color="from-red-800 to-zinc-900" className="mb-4" />
              <blockquote className="hand mb-4 border-l-4 border-uga-red pl-3 text-lg font-bold">"{submission.caption}"</blockquote>
              <div className="mb-4 flex justify-between text-sm font-black">
                <span>+{submission.points} pts</span>
                <span>{submission.drinks} drinks</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <RedTornButton onClick={() => review(submission.id, "APPROVED")} className="text-sm">Approve</RedTornButton>
                <button onClick={() => review(submission.id, "REJECTED")} className="torn-soft bg-zinc-950 px-4 py-3 text-sm font-black uppercase text-uga-paper shadow-paper">Reject</button>
              </div>
            </TornPaperCard>
          ))}
        </div>
        {items.length === 0 && <p className="hand mt-8 text-center text-2xl font-black">No pending submissions right now.</p>}
      </section>
    </main>
  );
}
