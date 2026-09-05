import { Note } from "@/types/note";
import axios from "axios";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${myKey}`,
    Accept: "application/json",
  },
});

type NoteId = Note["id"];

interface fetchParams {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
  sortBy?: string;
}
interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

// має виконувати запит для отримання колекції нотаток із сервера. Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);

export const fetchNotes = async (
  fetchParams: fetchParams
): Promise<NotesHttpResponse> => {
  const response = await axiosInstance.get<NotesHttpResponse>(`/notes`, {
    params: fetchParams,
  });
  return response.data;
};

// має виконувати запит для створення нової нотатки на сервері. Приймає вміст нової нотатки та повертає створену нотатку у відповіді;

export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", note);
  return response.data;
};

// має виконувати запит для видалення нотатки за заданим ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};
