"use client";

import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Flexbox from "./Flexbox";
import { useQueryParam } from "../_hooks/useQueryParam";
import styles from "@/app/_styles/Pagination.module.scss";
import { PAGE_SIZE } from "../_lib/env.client";

function Pagination({ resultCount }: { resultCount: number }) {
  const { queryParam: page, setQueryParam: setPage } = useQueryParam("page");
  const currentPage = !page ? 1 : Number(page);
  const pageCount = Math.ceil(resultCount / PAGE_SIZE);

  const pageNumbers = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];

  function firstPage() {
    if (currentPage !== 1) setPage("1");
  }

  function previousPage() {
    const previous = currentPage === 1 ? currentPage : currentPage - 1;
    setPage(previous.toString());
  }

  function lastPage() {
    if (currentPage !== pageCount) setPage(pageCount.toString());
  }

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    setPage(next.toString());
  }

  function goToPage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= pageCount) setPage(pageNumber.toString());
  }

  if (pageCount <= 1) return null;
  return (
    <Flexbox direction="vertical">
      <p className={styles.paginationText}>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>{currentPage === pageCount ? resultCount : PAGE_SIZE * currentPage}</span> (<span>{resultCount}</span>{" "}
        results)
      </p>
      <div className={styles.pagination}>
        {currentPage !== 1 && (
          <>
            <button className={styles.paginationButton} title="First" onClick={firstPage} disabled={currentPage === 1}>
              <HiChevronDoubleLeft />
            </button>
            <button
              className={styles.paginationButton}
              title="Previous"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              <HiChevronLeft />
            </button>
          </>
        )}
        {pageNumbers.map((num) => {
          if (num > 0 && num <= pageCount)
            return (
              <button
                className={`${styles.paginationButton} ${currentPage === num ? styles.current : ""}`}
                key={num}
                onClick={() => goToPage(num)}
                disabled={currentPage === num}
              >
                {num}
              </button>
            );
        })}
        {currentPage !== pageCount && (
          <>
            <button
              className={styles.paginationButton}
              title="Next"
              onClick={nextPage}
              disabled={currentPage === pageCount}
            >
              <HiChevronRight />
            </button>
            <button
              className={styles.paginationButton}
              title="Last"
              onClick={lastPage}
              disabled={currentPage === pageCount}
            >
              <HiChevronDoubleRight />
            </button>
          </>
        )}
      </div>
    </Flexbox>
  );
}

export default Pagination;
