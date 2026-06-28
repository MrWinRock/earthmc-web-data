import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isCancel, toError } from "../api/client";
import { useDebounce } from "./useDebounce";
import { useFetch } from "./useFetch";

interface BrowserConfig<TBasic, TDetailed> {
  /** Loads the full basic {name, uuid} list. */
  list: (signal: AbortSignal) => Promise<TBasic[]>;
  /** Queries detailed records by name/uuid. */
  query: (ids: string[], signal?: AbortSignal) => Promise<TDetailed[]>;
  nameOf: (item: TBasic) => string;
  pageSize?: number;
  /** When true, the list is not fetched until `loadList()` is called. */
  lazyList?: boolean;
}

export interface EntityBrowser<TBasic, TDetailed> {
  // list
  listLoading: boolean;
  listError: Error | null;
  reloadList: () => void;
  loadList: () => void;
  listRequested: boolean;
  totalCount: number;
  // filter + pagination
  filter: string;
  setFilter: (value: string) => void;
  pageItems: TBasic[];
  filteredCount: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  // search
  searchInput: string;
  setSearchInput: (value: string) => void;
  runSearch: () => void;
  clearSearch: () => void;
  results: TDetailed[] | null;
  searchLoading: boolean;
  searchError: Error | null;
  // modal
  entity: TDetailed | null;
  modalLoading: boolean;
  modalError: Error | null;
  openDetail: (id: string) => void;
  openWith: (detail: TDetailed) => void;
  closeModal: () => void;
}

/**
 * Shared logic for the list + filter + paginate + search + detail-modal pattern
 * used by the Towns, Nations and Quarters pages.
 */
export function useEntityBrowser<
  TBasic extends { name: string; uuid: string },
  TDetailed extends { name: string; uuid: string }
>(config: BrowserConfig<TBasic, TDetailed>): EntityBrowser<TBasic, TDetailed> {
  const { list, query, nameOf, pageSize = 12, lazyList = false } = config;

  // ---- Basic list (optionally lazy) -------------------------------------
  const [listRequested, setListRequested] = useState(!lazyList);
  const listState = useFetch<TBasic[]>(
    (signal) => (listRequested ? list(signal) : Promise.resolve([])),
    [listRequested]
  );
  const items = useMemo(() => listState.data ?? [], [listState.data]);

  // ---- Filter + pagination ----------------------------------------------
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const debouncedFilter = useDebounce(filter, 200);

  const filtered = useMemo(() => {
    const q = debouncedFilter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => nameOf(i).toLowerCase().includes(q));
  }, [items, debouncedFilter, nameOf]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  const setFilterAndReset = useCallback((value: string) => {
    setFilter(value);
    setPage(1);
  }, []);

  // ---- Search (POST query) ----------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamVal = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParamVal);
  const [results, setResults] = useState<TDetailed[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // ---- Detail modal ------------------------------------------------------
  const [entity, setEntity] = useState<TDetailed | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<Error | null>(null);

  const openWith = useCallback((detail: TDetailed) => setEntity(detail), []);
  const closeModal = useCallback(() => {
    setEntity(null);
    setModalError(null);
  }, []);

  const openDetail = useCallback(
    async (id: string) => {
      setModalLoading(true);
      setModalError(null);
      setEntity(null);
      try {
        const data = await query([id]);
        if (data?.length) setEntity(data[0]);
        else setModalError(new Error(`No details found for "${id}".`));
      } catch (e) {
        if (!isCancel(e)) setModalError(toError(e));
      } finally {
        setModalLoading(false);
      }
    },
    [query]
  );

  // Synchronize searchInput state with searchParamVal during render (avoids useEffect cascading render)
  const [prevSearchParamVal, setPrevSearchParamVal] = useState(searchParamVal);
  if (searchParamVal !== prevSearchParamVal) {
    setPrevSearchParamVal(searchParamVal);
    setSearchInput(searchParamVal);
  }

  // Run search when URL search param changes. All state updates are deferred
  // after a microtask to avoid synchronous state changes inside the effect body.
  useEffect(() => {
    let active = true;

    const startFetch = async () => {
      await Promise.resolve();
      if (!active) return;

      if (!searchParamVal) {
        setResults(null);
        setSearchError(null);
        return;
      }

      setSearchLoading(true);
      setSearchError(null);
      setResults(null);
      try {
        const data = await query([searchParamVal]);
        if (!active) return;
        setResults(data ?? []);
        if (data?.length === 1) setEntity(data[0]);
      } catch (e) {
        if (!active) return;
        if (!isCancel(e)) setSearchError(toError(e));
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    };

    startFetch();
    return () => {
      active = false;
    };
  }, [searchParamVal, query]);

  const runSearch = useCallback(() => {
    const q = searchInput.trim();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q) {
        next.set("search", q);
      } else {
        next.delete("search");
      }
      return next;
    });
  }, [searchInput, setSearchParams]);

  const clearSearch = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      return next;
    });
  }, [setSearchParams]);

  return {
    // list
    listLoading: listState.loading && listRequested,
    listError: listState.error,
    reloadList: listState.reload,
    loadList: () => setListRequested(true),
    listRequested,
    totalCount: items.length,
    // filter + pagination
    filter,
    setFilter: setFilterAndReset,
    pageItems,
    filteredCount: filtered.length,
    page: safePage,
    totalPages,
    setPage,
    // search
    searchInput,
    setSearchInput,
    runSearch,
    clearSearch,
    results,
    searchLoading,
    searchError,
    // modal
    entity,
    modalLoading,
    modalError,
    openDetail,
    openWith,
    closeModal,
  };
}
