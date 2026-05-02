"use client";

import { useState } from "react";
import { Confetti, PhotoUploadBox, RansomTitle } from "../components/ScrapbookComponents";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoStatus, setPhotoStatus] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFacePhoto(file) {
    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    setPhotoStatus("Uploading face photo...");
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "profiles");

    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
      setPhotoStatus("Face photo saved!");
    } catch (uploadError) {
      console.error(uploadError);
      setPhotoUrl("");
      setPhotoStatus("Photo upload failed. Try another image.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (saving) return;
    const guestName = name.trim();
    if (!guestName) {
      setError("Add your name first.");
      return;
    }
    if (uploadingPhoto) {
      setError("Wait for your face photo to finish uploading.");
      return;
    }
    if (!photoUrl) {
      setError("Add a face photo first.");
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
      <section className="mobile-page flex min-h-[760px] flex-col items-center justify-center gap-7 p-0">
        <RansomTitle size="text-5xl" className="-rotate-2 text-center">GRAD PARTY</RansomTitle>
        <p className="hand max-w-xs text-center text-2xl font-black">Add your name and a face photo.</p>
        <PhotoUploadBox helper="Upload face photo" onPhoto={handleFacePhoto} previewUrl={photoPreview} uploading={uploadingPhoto} status={photoStatus} />
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
          {saving ? "SAVING..." : uploadingPhoto ? "PHOTO UPLOADING..." : "JOIN"}
        </button>
        {error && <p className="hand text-center text-sm font-bold text-uga-red">{error}</p>}
      </section>
    </main>
  );
}
