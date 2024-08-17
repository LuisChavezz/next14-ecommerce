
// ? This function generates the numbers that will be displayed in the pagination component
export const generatePaginationNumbers = ( currentPage: number, totalPages: number ) => {
  // If the total numbers of pages is less than 7, then we don't need to show the ellipsis

  if ( totalPages <= 7 ) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is between the first 3 pages, show the first 3 pages and the ellipsis and the two last pages
  if ( currentPage <= 3 ) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is between the last 3 pages, show the first 2 pages and the ellipsis and the last 3 pages
  if ( currentPage >= totalPages - 2 ) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is in middle of the pages, show the first page, the ellipsis, the current page -1, the current page, the current page + 1, the ellipsis and the last page
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}