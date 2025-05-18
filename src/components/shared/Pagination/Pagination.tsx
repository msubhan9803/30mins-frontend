import PaginationButton from './PaginationButton';

export default function PaginationBar({
  itemCount,
  currentPage,
  setCurrentPage,
  searchHandler,
  itemsPerPage,
}) {
  const handlePageChange = async (page: number) => {
    await searchHandler(page, itemsPerPage);
    setCurrentPage(page);
  };

  const Buttons = () => {
    const numOfItems = itemCount;
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    let hasPrev = false;
    let hasNext = false;

    if (numOfItems >= itemsPerPage) {
      hasNext = true;
    }

    if (numOfItems <= itemsPerPage && currentPage !== 1) {
      hasPrev = true;
    }
    return (
      <>
        <>
          <PaginationButton
            active={false}
            disabled={!hasPrev}
            title={'Prev'}
            onClick={() => {
              handlePageChange(prevPage);
            }}
          />

          {currentPage === 2 && (
            <PaginationButton
              active={true}
              disabled={false}
              onClick={() => handlePageChange(currentPage - 1)}
              title={currentPage - 1}
            />
          )}
          {currentPage > 2 && (
            <>
              <PaginationButton
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage - 2)}
                title={currentPage - 2}
              />
              <PaginationButton
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage - 1)}
                title={currentPage - 1}
              />
            </>
          )}
          {/* {currentPage > 2 && (
            <>
              <PaginationButton
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage - 2)}
                title={currentPage - 2}
              />
              <PaginationButton
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage - 1)}
                title={currentPage - 1}
              />
            </>
          )} */}

          <PaginationButton active={false} disabled={false} onClick={null} title={currentPage} />

          {currentPage === 1 &&
            [1, 2, 3, 4].map(i => (
              <PaginationButton
                key={i}
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage + i)}
                title={currentPage + i}
              />
            ))}

          {currentPage === 2 &&
            [1, 2, 3].map(i => (
              <PaginationButton
                key={i}
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage + i)}
                title={currentPage + i}
              />
            ))}

          {currentPage > 2 &&
            [1, 2].map(i => (
              <PaginationButton
                key={i}
                active={true}
                disabled={false}
                onClick={() => handlePageChange(currentPage + i)}
                title={currentPage + i}
              />
            ))}

          <PaginationButton
            active={false}
            disabled={!hasNext}
            title={'Next'}
            onClick={() => {
              handlePageChange(nextPage);
            }}
          />
        </>
      </>
    );
  };

  return (
    <div className='p-4 bg-white w-full flex gap-2 justify-center rounded-md'>
      {itemCount !== 0 && <Buttons />}
    </div>
  );
}
