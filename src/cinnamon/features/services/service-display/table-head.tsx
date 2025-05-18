import Row from '@components/table/row';
import Cell from '@components/table/cell';
import useTranslation from 'next-translate/useTranslation';

export default function TableHead({withoutType}: {withoutType?: boolean}) {
  const {t} = useTranslation('common');

  return (
    <thead>
      <Row styles='font-bold text-xs uppercase text-gray-500 !border-t-0'>
        <Cell styles='!py-3 font-bold text-black hidden md:table-cell'>{''}</Cell>
        <Cell styles='!py-3 font-bold text-black'>{t('service')}</Cell>
        {!withoutType && (
          <Cell styles='!py-3 font-bold text-black hidden lg:table-cell'>{t('type')}</Cell>
        )}
        <Cell styles='!py-3 font-bold text-black hidden lg:table-cell'>{t('price')}</Cell>
        <Cell styles='!py-3 font-bold text-black hidden lg:table-cell'>{t('visibility')}</Cell>
        <Cell styles='!py-3 font-bold text-black hidden lg:table-cell'>{''}</Cell>
      </Row>
    </thead>
  );
}
