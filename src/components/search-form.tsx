"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { BackendClient } from "@/lib/request";
import { isErrorResponse, Suggestion } from "@/types/request";
import { useAlertContext } from "./provider/alert-provider";
import { useLoadingContext } from "./provider/loading-provider";
import Image from "next/image";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const client = new BackendClient();
  const setAlert = useAlertContext();
  const setLoading = useLoadingContext();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Suggestion[]>([]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (searchQuery.length < 3) {
      return;
    }

    const response = await client.searchSong(searchQuery);

    if (isErrorResponse(response)) {
      setLoading(false);
      setAlert("ผิดพลาด", response.message, 0, true);
      return;
    }

    setResults(response.results.suggestions)
  };

  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>

          {query && (
            <div className="absolute top-14 left-0 right-0 bg-primary-foreground shadow-md max-h-60 overflow-y-auto rounded-md">
              <ul className="p-2">
                {results.length > 0 ? (
                  results.filter((v) => v.kind == "topResults" && v.content?.type == "songs").map((result) => (
                    <li
                      key={result.content?.id}
                      className="py-2 px-4 hover:bg-accent cursor-pointer flex items-center gap-4"
                    >
                      <Image src={(result.content?.attributes.artwork.url ?? "").replace("{w}", "120").replace("{h}", "120").replace("{f}", "jpg")} alt={result.content?.attributes.name ?? ""} width={40} height={40} className="rounded-md"  />
                      <div>
                        <div className="text-md">{result.content?.attributes.name}</div>
                        <div className="text-sm text-gray-400">{result.content?.attributes.artistName}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-4">No results found</li>
                )}
              </ul>
            </div>
          )}

          <SidebarInput
            id="search"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
            className="pl-8 h-12"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
