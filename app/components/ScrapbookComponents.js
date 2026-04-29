"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RansomTitle({ children, size = "text-5xl", className = "" }) {
  return (
    <h1 className={`${size} font-black leading-none tracking-normal ${className}`} aria-label={children}>
      {String(children).split("").map((letter, index) =>
        letter === " " ? (
          <span key={index} className="inline-block w-3" />
        ) : (
          <span key={index} className="mag-letter">{letter}</span>
        )
      )}
    </h1>
  );
}

export function TapeCorner({ corners = ["tl", "tr"], className = "" }) {
  return (
    <>
      {corners.map((corner) => (
        <span key={corner} className={`tape ${corner} ${className}`} aria-hidden="true" />
      ))}
    </>
  );
}

export function TornPaperCard({ children, dark = false, rotate = "", className = "" }) {
  return (
    <section className={`torn-soft relative ${dark ? "bg-zinc-950 text-uga-paper chalk-border" : "bg-uga-paper text-zinc-950"} shadow-paper ${rotate} ${className}`}>
      {children}
    </section>
  );
}

export function RedTornButton({ children, href, className = "", onClick, type = "button" }) {
  const classes = `torn relative inline-flex min-h-12 items-center justify-center bg-uga-red px-6 py-3 text-center font-black uppercase text-white shadow-paper transition hover:scale-[1.02] active:scale-95 ${className}`;
  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }
  return <button type={type} onClick={onClick} className={classes}>{children}</button>;
}

export function PolaroidCard({ label, sublabel, initials, photoUrl, color = "from-red-700 to-zinc-950", rotate = "", className = "", children }) {
  return (
    <figure className={`relative bg-uga-paper p-3 pb-8 text-zinc-950 shadow-taped ${rotate} ${className}`}>
      <TapeCorner corners={["tl", "tr"]} />
      <div className={`photo-gradient flex aspect-square items-center justify-center bg-gradient-to-br ${color} text-4xl font-black text-white`}>
        {photoUrl && (photoUrl.startsWith("http") || photoUrl.startsWith("data:")) ? (
          <img src={photoUrl} alt={label || "Uploaded photo"} className="h-full w-full object-cover" />
        ) : (
          children || photoUrl || initials
        )}
      </div>
      {label && <figcaption className="hand mt-2 text-center text-sm font-bold leading-tight">{label}</figcaption>}
      {sublabel && <p className="mt-1 text-center text-[10px] font-black uppercase text-uga-red">{sublabel}</p>}
    </figure>
  );
}

export function BadgeIcon({ icon, label, locked = false, large = false }) {
  return (
    <div className={`relative grid place-items-center ${large ? "h-16 w-16 text-2xl" : "h-12 w-12 text-xl"} rounded-full border-2 border-uga-red bg-zinc-950 font-black text-uga-paper shadow-paper ${locked ? "opacity-40 grayscale" : ""}`} aria-label={label}>
      <span>{icon}</span>
      {locked && <span className="absolute -rotate-12 bg-uga-paper px-1 text-[9px] text-uga-red">LOCKED</span>}
    </div>
  );
}

export function LeaderboardRow({ user, emphasis = false }) {
  return (
    <li className={`torn-soft grid grid-cols-[44px_48px_1fr_82px_70px] items-center gap-2 px-3 py-2 text-zinc-950 shadow-paper ${emphasis ? "bg-uga-paper text-lg font-black" : "bg-uga-paper/95"} ${user.rank % 2 ? "-rotate-1" : "rotate-1"}`}>
      <span className={`grid h-9 w-9 place-items-center font-black ${emphasis ? "bg-uga-red text-white" : "bg-zinc-950 text-white"}`}>{user.rank}</span>
      <span className="grid h-11 w-11 place-items-center bg-zinc-900 text-xs font-black text-white">{user.photo}</span>
      <span className="hand truncate text-xl font-bold">{user.name}</span>
      <span className="text-right font-black text-uga-red">{user.points}</span>
      <span className="text-right font-black">{user.drinks} CUP</span>
    </li>
  );
}

export function LiveFeedItem({ item, index = 0, compact = false }) {
  return (
    <article className={`torn-soft grid grid-cols-[44px_1fr_48px] items-center gap-2 bg-uga-paper px-3 py-3 text-zinc-950 shadow-paper ${index % 2 ? "rotate-1" : "-rotate-1"}`}>
      <span className="grid h-11 w-11 place-items-center border-4 border-white bg-zinc-900 text-xs font-black text-white shadow-paper">{item.photo}</span>
      <p className={`${compact ? "text-xs" : "text-sm"} leading-tight`}>
        <b>{item.user}</b> {item.action}
        <span className="block text-[10px] font-bold text-zinc-600">{item.time}</span>
      </p>
      <span className="text-right font-black text-uga-red">{item.points ? `+${item.points}` : item.icon}</span>
    </article>
  );
}

export function PhotoUploadBox({ helper = "Click to upload or take a selfie!", small = false, onPhoto }) {
  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file || !onPhoto) return;
    const reader = new FileReader();
    reader.onload = () => onPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <label className={`relative block bg-uga-paper p-4 text-zinc-950 shadow-taped ${small ? "w-full" : "mx-auto w-[76%] max-w-72"}`}>
      <TapeCorner corners={["tl", "tr", "bl", "br"]} />
      <input className="sr-only" type="file" accept="image/*" aria-label={helper} onChange={handleChange} />
      <div className={`${small ? "h-44" : "h-64"} grid place-items-center border-2 border-zinc-300 bg-zinc-100`}>
        <span className="text-7xl font-black text-uga-red">+</span>
      </div>
      <p className="hand mt-2 text-center text-sm font-bold">{helper}</p>
    </label>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    ["/home", "HM", "Home"],
    ["/quests", "Q", "Quests"],
    ["/submit", "+", "Submit"],
    ["/tv", "#", "Leaderboard"],
    ["/profile", "ME", "Profile"],
  ];
  return (
    <nav className="nav-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] bg-black/95 px-3 pt-2 text-uga-paper shadow-[0_-12px_30px_rgba(0,0,0,.45)]">
      <div className="flex items-center justify-between">
        {items.map(([href, icon, label]) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`grid min-w-14 place-items-center gap-1 text-[10px] font-bold ${active ? "text-uga-red" : "text-uga-paper"}`}>
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Confetti({ className = "" }) {
  const pieces = [
    ["8%", "18%", "-18deg"], ["22%", "72%", "38deg"], ["72%", "12%", "18deg"], ["88%", "64%", "-42deg"],
    ["12%", "88%", "61deg"], ["56%", "82%", "-8deg"], ["77%", "38%", "72deg"], ["36%", "11%", "-55deg"],
  ];
  return (
    <div className={`confetti pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {pieces.map(([left, top, r], index) => <span key={index} style={{ left, top, "--r": r }} />)}
    </div>
  );
}
