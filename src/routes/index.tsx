import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daulatram's — Ayurveda in a Modern Era" },
      { name: "description", content: "Three generations of Ayurvedic wisdom — pure, natural, FSSAI approved. Shop trusted Ayurvedic wellness for the whole family." },
      { property: "og:title", content: "Daulatram's — Ayurveda in a Modern Era" },
      { property: "og:description", content: "Three generations of Ayurvedic wisdom — pure, natural, FSSAI approved." },
      { property: "og:type", content: "website" },
      { "http-equiv": "refresh", content: "0; url=/site/home.html" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/home.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6EF", fontFamily: "system-ui, sans-serif", color: "#0B5132" }}>
      <p>Loading Daulatram's…</p>
    </div>
  );
}
