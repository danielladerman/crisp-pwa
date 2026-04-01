import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crisp",
    short_name: "Crisp",
    description: "Daily communication practice",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7F4",
    theme_color: "#F8F7F4",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
