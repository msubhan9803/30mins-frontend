import useTranslation from 'next-translate/useTranslation';
import PaginationButton from './PaginationButton';

export default function UsersPagination({
  currentPage,
  setCurrentPage,
  searchHandler,
  resultsPerPage,
  totalOrgCount,
  totalMembersCount,
  totalServiceCount,
  totalEventCount,
  usrs,
  srvs,
  orgs,
  events,
}) {
  const handlePageChange = async (page: number) => {
    await searchHandler(page, resultsPerPage);
    setCurrentPage(page);
  };

  let usrsLimit = 6;
  let srvsLimit = 3;
  let orgsLimit = 3;
  let eventsLimit = 3;

  if (!usrs && !srvs && !orgs && !events) {
    usrsLimit = 0;
    srvsLimit = 0;
    orgsLimit = 0;
    eventsLimit = 0;
  }

  if (usrs && !srvs && !orgs && !events) {
    usrsLimit = 12;
    srvsLimit = 0;
    orgsLimit = 0;
    eventsLimit = 0;
  }
  if (!usrs && srvs && !orgs && !events) {
    srvsLimit = 12;
    orgsLimit = 0;
    usrsLimit = 0;
    eventsLimit = 0;
  }
  if (!usrs && !srvs && orgs && !events) {
    orgsLimit = 12;
    usrsLimit = 0;
    srvsLimit = 0;
    eventsLimit = 0;
  }
  if (!usrs && !srvs && !orgs && events) {
    orgsLimit = 0;
    usrsLimit = 0;
    srvsLimit = 0;
    eventsLimit = 12;
  }

  if (usrs && srvs && !orgs && !events) {
    usrsLimit = 6;
    srvsLimit = 6;
    orgsLimit = 0;
    eventsLimit = 0;
  }
  if (usrs && !srvs && orgs && !events) {
    usrsLimit = 6;
    orgsLimit = 6;
    srvsLimit = 0;
    eventsLimit = 0;
  }
  if (usrs && !srvs && !orgs && events) {
    usrsLimit = 6;
    orgsLimit = 0;
    srvsLimit = 0;
    eventsLimit = 6;
  }
  if (!usrs && srvs && orgs && !events) {
    srvsLimit = 6;
    orgsLimit = 6;
    usrsLimit = 0;
    eventsLimit = 0;
  }
  if (!usrs && srvs && !orgs && events) {
    srvsLimit = 6;
    orgsLimit = 0;
    usrsLimit = 0;
    eventsLimit = 6;
  }
  if (!usrs && !srvs && orgs && events) {
    srvsLimit = 0;
    orgsLimit = 6;
    usrsLimit = 0;
    eventsLimit = 6;
  }

  let totalPages: number;
  if (
    totalOrgCount >= totalMembersCount &&
    totalOrgCount >= totalServiceCount &&
    totalOrgCount >= totalEventCount
  ) {
    totalPages = Math.ceil(totalOrgCount / orgsLimit);
  } else if (
    totalMembersCount >= totalOrgCount &&
    totalMembersCount >= totalServiceCount &&
    totalMembersCount >= totalEventCount
  ) {
    totalPages = Math.ceil(totalMembersCount / usrsLimit);
  } else if (
    totalEventCount >= totalMembersCount &&
    totalEventCount >= totalOrgCount &&
    totalEventCount >= totalServiceCount
  ) {
    totalPages = Math.ceil(totalEventCount / eventsLimit);
  } else {
    totalPages = Math.ceil(totalServiceCount / srvsLimit);
  }

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
            disabled={!hasPrev}
            title={t(`common:txt_Prev`)}
            onClick={() => {
              handlePageChange(prevPage);
            }}
          />

          {pageNumbersArray.map(pageNumber => (
            <PaginationButton
              key={pageNumber}
              active={pageNumber === currentPage}
              disabled={false}
              onClick={() => handlePageChange(pageNumber)}
              title={pageNumber}
            />
          ))}

          <PaginationButton
            active={false}
            disabled={!hasNext}
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
    <div className='p-4 bg-white w-full flex justify-center rounded-md'>
      <Buttons />
    </div>
  );
}
