"use client";

import { useEffect, useState } from "react";
import { BottomNav, LiveFeedItem, RansomTitle } from "../components/ScrapbookComponents";

export default function FeedPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/feed").then((response) => response.json()).then((data) => setItems(data.feed || [])).catch(() => {});
  }, []);

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-8 text-center">LIVE FEED</RansomTitle>
        <div className="space-y-4">
          {items.map((item, index) => <LiveFeedItem key={item.id || item.action} item={item} index={index} />)}
          {items.length === 0 && <p className="hand text-center text-2xl font-black">No live activity yet.</p>}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
