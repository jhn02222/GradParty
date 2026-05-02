"use client";

import { useState } from "react";
import { Confetti, PhotoUploadBox, RansomTitle } from "../components/ScrapbookComponents";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoStatus, setPhotoStatus] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handlePhoto(file) {
    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    setPhotoStatus("Uploading selfie...");
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "profiles");

    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
      setPhotoStatus("Selfie saved!");
    } catch (uploadError) {
      console.error(uploadError);
      setPhotoUrl("");
      setPhotoStatus("Photo upload failed. You can still join.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (saving) return;
    if (uploadingPhoto) {
      setError("Wait for your photo to finish uploading.");
      return;
    }
    const guestName = name.trim() || "Chris J.";
    setSaving(true);
    setError("");
    localStorage.setItem("gradPartyGuestName", guestName);
    localStorage.setItem("gradPartyGuestNickname", nickname.trim());

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName,
          nickname,
          photoUrl,
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
      <section className="mobile-page flex min-h-[760px] flex-col items-center justify-center gap-6 p-0">
        <RansomTitle size="text-5xl" className="-rotate-2 text-center">GRAD PARTY</RansomTitle>
        <PhotoUploadBox onPhoto={handlePhoto} previewUrl={photoPreview} uploading={uploadingPhoto} status={photoStatus} />
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
        <button
          type="button"
          onClick={saveProfile}
          className="torn relative inline-flex min-h-12 w-full items-center justify-center bg-uga-red px-6 py-3 text-center text-lg font-black uppercase text-white shadow-paper transition hover:scale-[1.02] active:scale-95"
        >
          {saving ? "MAKING YOUR CARD..." : "LET'S GO!"}
        </button>
        {error && <p className="hand text-center text-sm font-bold text-uga-red">{error}</p>}
      </section>
    </main>
  );
}
