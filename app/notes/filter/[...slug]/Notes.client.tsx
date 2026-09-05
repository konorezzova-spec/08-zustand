"use client";
import { useState } from "react";

import css from "./NotesPage.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
// import { Toaster, toast } from "react-hot-toast";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
import { useRouter } from "next/navigation";

interface NotesClientProps {
  tag: undefined | string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // const [modalOpen, setModalOpen] = useState(false);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: [
      "notes",
      { search: debouncedQuery, page: currentPage, tag: tag },
    ],
    queryFn: () =>
      fetchNotes({
        search: debouncedQuery,
        page: currentPage,
        perPage: 12,
        tag: tag,
      }),
    enabled: true,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const updateSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 0;

  // useEffect(() => {
  //   if (data && data.notes.length === 0) {
  //     toast.error("No notes found.");
  //   }
  // }, [data]);

  // const openModal = () => {
  //   setModalOpen(true);
  // };
  // const closeModal = () => {
  //   setModalOpen(false);
  // };

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
          <button
            type="button"
            className={css.button}
            onClick={() => router.push("/notes/action/create")}
          >
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && <ErrorMessage message={error.message} />}

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

        {data && data.notes.length === 0 && <p>No notes found.</p>}

        {/* <Toaster /> */}

        {/* {modalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )} */}
      </div>
    </>
  );
}
