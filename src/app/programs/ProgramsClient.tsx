"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProgramsClientProps {
  initialSearch?: string;
  initialSort?: string;
  totalPrograms: number;
}

export default function ProgramsClient({
  initialSearch = "",
  initialSort = "created_at",
  totalPrograms,
}: ProgramsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    // Reset to page 1 when searching
    params.delete("page");

    router.push(`/programs?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/programs?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      {/* Results Count */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="text-gray-600">
          Menampilkan <span className="font-semibold">{totalPrograms}</span>{" "}
          program pelatihan
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Urutkan:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="created_at">Terbaru</option>
            <option value="title">Nama (A-Z)</option>
            <option value="price">Harga Terendah</option>
            <option value="views">Paling Populer</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari program pelatihan..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Cari
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                router.push(`/programs?${params.toString()}`);
              }}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
