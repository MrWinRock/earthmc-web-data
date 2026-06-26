import type { ReactNode } from "react";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Pagination,
  SearchInput,
  SkeletonCards,
  Spinner,
} from "../ui";
import type { EntityBrowser } from "../../hooks/useEntityBrowser";

interface BrowserPageProps<
  TBasic extends { name: string; uuid: string },
  TDetailed extends { name: string; uuid: string }
> {
  title: ReactNode;
  subtitle: ReactNode;
  noun: string; // plural noun, e.g. "towns"
  browser: EntityBrowser<TBasic, TDetailed>;
  searchPlaceholder: string;
  renderResult: (item: TDetailed, open: () => void) => ReactNode;
  renderListItem: (item: TBasic, open: () => void) => ReactNode;
  modal: ReactNode;
}

export function BrowserPage<
  TBasic extends { name: string; uuid: string },
  TDetailed extends { name: string; uuid: string }
>({
  title,
  subtitle,
  noun,
  browser: b,
  searchPlaceholder,
  renderResult,
  renderListItem,
  modal,
}: BrowserPageProps<TBasic, TDetailed>) {
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{subtitle}</p>
      </div>

      <div className="toolbar">
        <SearchInput
          value={b.searchInput}
          onChange={b.setSearchInput}
          onSubmit={b.runSearch}
          placeholder={searchPlaceholder}
          ariaLabel={`Search ${noun}`}
        />
        <Button variant="primary" onClick={b.runSearch} disabled={b.searchLoading}>
          {b.searchLoading ? <Spinner /> : "Search"}
        </Button>
        {b.results && (
          <Button variant="ghost" onClick={b.clearSearch}>
            Clear
          </Button>
        )}
      </div>

      {/* ---- Search results ---- */}
      {b.searchError && !b.searchLoading && (
        <Card>
          <ErrorState message={b.searchError.message} />
        </Card>
      )}

      {b.results && !b.searchLoading && (
        <>
          {b.results.length === 0 ? (
            <Card>
              <EmptyState
                icon="🔍"
                title={`No ${noun} found`}
                message={`Nothing matched “${b.searchInput}”.`}
              />
            </Card>
          ) : (
            <div className="card-grid card-grid--wide">
              {b.results.map((item) =>
                renderResult(item, () => b.openWith(item))
              )}
            </div>
          )}
        </>
      )}

      {/* ---- Default: full list ---- */}
      {!b.results && (
        <>
          <div className="toolbar toolbar--between">
            <SearchInput
              value={b.filter}
              onChange={b.setFilter}
              placeholder={`Filter ${noun} by name…`}
              ariaLabel={`Filter ${noun}`}
            />
            {!b.listLoading && !b.listError && (
              <span className="pager__info">
                {b.filteredCount.toLocaleString()} of{" "}
                {b.totalCount.toLocaleString()} {noun}
              </span>
            )}
          </div>

          {b.listLoading && <SkeletonCards count={12} />}

          {b.listError && !b.listLoading && (
            <Card>
              <ErrorState message={b.listError.message} onRetry={b.reloadList} />
            </Card>
          )}

          {!b.listLoading && !b.listError && (
            <>
              {b.filteredCount === 0 ? (
                <Card>
                  <EmptyState title={`No ${noun} to show`} />
                </Card>
              ) : (
                <>
                  <div className="card-grid">
                    {b.pageItems.map((item) =>
                      renderListItem(item, () => b.openDetail(item.uuid))
                    )}
                  </div>
                  <Pagination
                    page={b.page}
                    totalPages={b.totalPages}
                    onChange={b.setPage}
                  />
                </>
              )}
            </>
          )}
        </>
      )}

      {b.modalLoading && (
        <div className="modal-overlay">
          <div className="card card--pad">
            <Spinner label="Loading details…" />
          </div>
        </div>
      )}
      {b.modalError && (
        <Card style={{ marginTop: "1rem" }}>
          <ErrorState message={b.modalError.message} />
        </Card>
      )}
      {modal}
    </div>
  );
}
