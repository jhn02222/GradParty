"use client";

import { useState } from "react";
import { useEffect } from "react";
import { BottomNav, PhotoUploadBox, RansomTitle, RedTornButton, TapeCorner } from "../components/ScrapbookComponents";

const drinks = [
  { title: "Beer", points: 5, drinks: 1, tone: "amber" },
  { title: "Seltzer", points: 5, drinks: 1, tone: "silver" },
  { title: "Cocktail", points: 10, drinks: 1, tone: "red" },
  { title: "Mocktail", points: 10, drinks: 0, tone: "gold" },
];

export default function SubmitPage() {
  const [selected, setSelected] = useState(drinks[2]);
  const [submissionTarget, setSubmissionTarget] = useState(null);
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoStatus, setPhotoStatus] = useState("");
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
    if (uploadingPhoto) {
      setStatus("Wait for the photo upload to finish.");
      return;
    }
    setStatus("Submitting...");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userName,
        questId: submissionTarget.id,
        caption,
        photoUrl,
        points: selected.points,
        drinks: selected.drinks,
      }),
    });
    setStatus(response.ok ? "Uploaded! Points added automatically." : "Could not submit. Try again.");
  }

  async function handleProofPhoto(file) {
    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    setPhotoStatus("Uploading proof...");
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "submissions");

    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
      setPhotoStatus("Proof photo saved!");
    } catch (uploadError) {
      console.error(uploadError);
      setPhotoUrl("");
      setPhotoStatus("Photo upload failed. Try another image.");
    } finally {
      setUploadingPhoto(false);
    }
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
          <p className="hand text-center text-lg font-bold">Add a photo proof for the board.</p>
          <PhotoUploadBox helper="Upload proof photo" small onPhoto={handleProofPhoto} previewUrl={photoPreview} uploading={uploadingPhoto} status={photoStatus} />
          <label className="sr-only" htmlFor="caption">Caption</label>
          <input id="caption" value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Add a caption (optional)" className="torn-soft w-full bg-uga-paper px-4 py-3 text-zinc-950 placeholder:text-zinc-500" />
          <RedTornButton onClick={submitProof} className="w-full">{uploadingPhoto ? "PHOTO UPLOADING..." : `SUBMIT +${selected.points} PTS`}</RedTornButton>
          <p className="hand text-center text-xs">Your photo will be reviewed.</p>
          {status && <p className="hand text-center text-sm font-bold text-uga-red">{status}</p>}
        </section>
      </section>
      <BottomNav />
    </main>
  );
}
