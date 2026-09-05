import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesProps {
  params: Promise<{
    slug: string[];
  }>;
}
export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const category = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, tag: category }],
    queryFn: () =>
      fetchNotes({ search: "", page: 1, perPage: 12, tag: category }),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient category={category} />
      </HydrationBoundary>
    </>
  );
}
