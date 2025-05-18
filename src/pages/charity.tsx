import React, {useMemo, useState, useCallback, useRef} from 'react';
import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import Table from 'components/PreLogin/Charity/Table';
import SearchForm from 'components/PreLogin/Charity/SearchForm';
import axios from 'axios';
import classNames from 'classnames';
import headerImage from '../../public/assets/charity_header.svg';

const Charity = () => {
  const {t} = useTranslation('common');
  const [charities, setCharities] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNotResults] = useState(false);
  const [sort, setSort] = useState({
    key: 'name',
    order: 1,
  });
  const [searchFilter, setSearchFilter] = useState({
    keywords: '',
    newSearch: false,
  });
  const queryIdRef = useRef(0);

  const websiteColumn = ({value}) => (
    <a href={value} target='_blank' rel='noreferrer'>
      {value}
    </a>
  );
  const descriptionColumn = ({value}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isClamp, setIsClamp] = useState(true);
    const toggleClamp = () => {
      setIsClamp(!isClamp);
    };
    return (
      <>
        <p
          className={classNames('text-sm mt-1 leading-tight text-mainText break-words', {
            'line-clamp-3': isClamp,
          })}
        >
          {value}
        </p>
        {value.length >= 100 && (
          <span className='text-xs text-mainBlue font-medium cursor-pointer' onClick={toggleClamp}>
            {isClamp ? t('show_more') : t('show_less')}
          </span>
        )}
      </>
    );
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Charity Name',
        accessor: 'name',
        sortable: true,
      },
      {
        Header: 'Tax ID',
        accessor: 'taxID',
      },
      {
        Header: 'Website',
        accessor: 'website',
        Cell: websiteColumn,
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: descriptionColumn,
      },
    ],
    []
  );
  const queryCharities = useCallback(async (userSearchParams, pageNumber, pageSize, sortFilter) => {
    const queryId = ++queryIdRef.current;
    const searchPayload = userSearchParams;
    delete searchPayload.newSearch;
    if (queryId === queryIdRef.current) {
      setIsLoading(true);
      axios
        .get(
          `/api/charity?pageNumber=${pageNumber}&resultsPerPage=${pageSize}&keywords=${searchPayload.keywords.trim()}&sortKey=${
            sortFilter.key
          }&sortValue=${sortFilter.order}`
        )
        .then(response => {
          const charityCount = response?.data?.charityCount || 0;
          const charityData = response?.data?.charityData || [];
          setCharities(charityData);
          setPageCount(Math.ceil(charityCount / pageSize));
          setIsLoading(false);
          setNotResults(
            response?.data?.charityData && response?.data?.charityData.length > 0 ? false : true
          );
        })
        .catch(e => console.log(e));
    }
  }, []);
  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/charity/'}
        description={t('page:charity_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Charity')} | 30mins`}
      />
      <div className='px-8 py-12 flex flex-col gap-0'>
        <CenteredContainer className='containerCenter gap-8'>
          <div className='col-span-8 m-auto'>
            <Image
              src={headerImage}
              alt='People shaking hands after transaction'
              width={800}
              height={300}
            />
          </div>
          <h1 className='headerLg font-bold'>{t('page:charity_header')}</h1>
          <div className='flex flex-col gap-4'>
            <p>{t('page:charity_description')}</p>
          </div>
        </CenteredContainer>
        <SearchForm setSearchFilter={setSearchFilter} isLoading={isLoading} />
        <Table
          columns={columns}
          data={charities}
          pageCount={pageCount}
          searchFilter={searchFilter}
          sort={sort}
          setSort={setSort}
          query={queryCharities}
          isLoading={isLoading}
          noResults={noResults}
        />
      </div>
    </Layout>
  );
};

export default Charity;
