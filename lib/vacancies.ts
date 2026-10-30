/**
 * Sumber data lowongan untuk section "Join the Movement" di homepage.
 *
 * Aturan:
 *  - Isi HANYA dengan lowongan asli. Array kosong = section menampilkan "coming soon".
 *  - `applyUrl` harus link lamaran yang sungguhan: "https://..." (form / LinkedIn / dll)
 *    atau "mailto:alamat-asli@domain.com?subject=...". Jangan isi alamat tebakan.
 *  - Career.tsx (route /career) belum memakai file ini dan tidak diubah.
 *
 * Contoh bentuk satu lowongan:
 *   {
 *     id: "content-creator",
 *     title: "Content Creator",
 *     type: "Full-time",
 *     blurb: "Deskripsi singkat posisi (1–2 kalimat).",
 *     applyUrl: "https://...",
 *   }
 */
export type Vacancy = {
  id: string;
  title: string;
  type: string;
  blurb: string;
  applyUrl: string;
};

export const vacancies: Vacancy[] = [];