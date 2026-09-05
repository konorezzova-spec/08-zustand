//npm install use-debounce
//npm install react-hot-toast
"use client";
import { useEffect, useState } from "react";

import css from "./NotesPage.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster, toast } from "react-hot-toast";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
// import { useParams } from "next/navigation";

interface NotesClientProps {
  category: undefined | string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  // const { slug } = useParams<{
  //   slug: ("all" | "Todo" | "Work" | "Personal" | "Meeting" | "Shopping")[];
  // }>();

  // const category = slug[0] === "all" ? undefined : slug[0];

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: [
      "notes",
      { search: debouncedQuery, page: currentPage, tag: category },
    ],
    queryFn: () =>
      fetchNotes({
        search: debouncedQuery,
        page: currentPage,
        perPage: 12,
        tag: category,
      }),
    enabled: true,
    retry: 1,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const updateSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast.error("No notes found.");
    }
  }, [data]);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={updateSearchQuery} />

          {isSuccess && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          <button type="button" className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && <ErrorMessage message={error.message} />}

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

        <Toaster />

        {modalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
}
