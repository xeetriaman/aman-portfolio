import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aman Chhetri · Career",
    short_name: "Career",
    description: "Aman Chhetri's portfolio, projects and resume",
    start_url: "/",
    display: "standalone",
    background_color: "#fafbfd",
    theme_color: "#1e2f8a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
