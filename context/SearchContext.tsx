"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearch must be used inside SearchProvider."
    );
  }

  return context;
}