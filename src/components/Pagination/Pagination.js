import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ currentPage, totalPages, maxPagesToShow = 5, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(...[1, 2, 3, 4, 5], '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          ...[totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages],
        )
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  return (
    <CPagination>
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        role="button"
      >
        Previous
      </CPaginationItem>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <CPaginationItem key={index} disabled>
            ...
          </CPaginationItem>
        ) : (
          <CPaginationItem
            key={index}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            role="button"
          >
            {page}
          </CPaginationItem>
        ),
      )}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        role="button"
      >
        Next
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
