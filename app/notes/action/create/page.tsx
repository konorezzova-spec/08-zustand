import CreateNote from "@/components/CreateNote/CreateNote";
import { Metadata } from "next";

export const metadats: Metadata = {
  title: "Create note",
  description: "Create a new note",
  metadataBase: "https://08-zustand-coral-two.vercel.app/",
  openGraph: {
    title: "Create note",
    description: "Create a new note",
    url: "/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};
export default function CreateNotePage() {
  return <CreateNote />;
}
