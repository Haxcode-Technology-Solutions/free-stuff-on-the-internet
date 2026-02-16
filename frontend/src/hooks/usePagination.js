import { useState, useCallback } from 'react'

export default function usePagination(initialPage = 1, initialPerPage = 20) {
  const [page, setPage] = useState(initialPage)
  const [perPage] = useState(initialPerPage)
  const [totalPages, setTotalPages] = useState(1)

  const goToPage = useCallback(
    (p) => {
      if (p >= 1 && p <= totalPages) {
        setPage(p)
      }
    },
    [totalPages]
  )

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage])
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage])

  return {
    page,
    perPage,
    totalPages,
    setTotalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
