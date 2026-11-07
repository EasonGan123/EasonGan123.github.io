"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export default function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: site.timezone.tz });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`label-mono tabular-nums ${className}`}>
      {site.timezone.city} <span className="text-ink">{time || " "}</span>
    </span>
  );
}
