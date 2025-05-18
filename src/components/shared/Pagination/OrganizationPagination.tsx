import useTranslation from 'next-translate/useTranslation';
import PaginationButton from './PaginationButton';

type IProps = {
  currentPage;
  setCurrentPage;
  defaultItemsPerPage;
  memberSearchCount;
  searchHandler;
  disabled?: boolean;
};

export default function OrganizationPagination({
  currentPage,
  setCurrentPage,
  defaultItemsPerPage,
  memberSearchCount,
  searchHandler,
  disabled,
}: IProps) {
  const handlePageChange = async (page: number) => {
    await searchHandler(page, defaultItemsPerPage);
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(memberSearchCount / defaultItemsPerPage);

  const Buttons = () => {
    const {t} = useTranslation();

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    let hasPrev = false;
    let hasNext = false;

    if (currentPage >= totalPages) {
      hasNext = false;
    } else {
      hasNext = true;
    }

    if (currentPage !== 1) {
      hasPrev = true;
    }
    let pageNumbersArray = Array.from({length: 5}, (_, i) => i + 1);
    if (currentPage > 3) {
      pageNumbersArray = Array.from({length: 5}, (_, i) => i + currentPage - 2);
    }
    pageNumbersArray = pageNumbersArray.filter(pageNumbers => pageNumbers <= totalPages);

    return (
      <>
        <>
          <PaginationButton
            active={false}
            disabled={!hasPrev || disabled}
            title={t(`common:txt_Prev`)}
            onClick={() => {
              handlePageChange(prevPage);
            }}
          />

          {pageNumbersArray.map(pageNumber => (
            <PaginationButton
              key={pageNumber}
              active={pageNumber === currentPage}
              disabled={disabled}
              onClick={() => handlePageChange(pageNumber)}
              title={pageNumber}
            />
          ))}

          <PaginationButton
            active={false}
            disabled={!hasNext || disabled}
            title={t(`common:txt_Next`)}
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
      <Buttons />
    </div>
  );
}
