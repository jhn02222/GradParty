"use client";

import { useEffect, useState } from "react";
import { BottomNav, LiveFeedItem, RansomTitle } from "../components/ScrapbookComponents";
import { feed } from "../data/mockData";

export default function FeedPage() {
  const [items, setItems] = useState(feed);

  useEffect(() => {
    fetch("/api/feed").then((response) => response.json()).then((data) => setItems(data.feed || feed)).catch(() => {});
  }, []);

  return (
    <main className="paper-bg">
      <section className="mobile-page safe-top">
        <RansomTitle size="text-4xl" className="mb-8 text-center">LIVE FEED</RansomTitle>
        <div className="space-y-4">
          {items.map((item, index) => <LiveFeedItem key={item.id || item.action} item={item} index={index} />)}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
