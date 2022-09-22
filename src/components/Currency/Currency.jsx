import { useEffect, useState } from 'react';
import getCurrency from 'services/privat-bank-api';
import PropTypes from 'prop-types';
import Media from 'react-media';
import {
  CurrencyTable,
  TableHeader,
  HeadCell,
  TableBody,
  TableRow,
  TableData,
  TableFooter,
} from './Currency.styled';
import { useTranslation } from 'react-i18next';
import { TailSpin } from 'react-loader-spinner';

export const Currency = () => {
  const [currency, setCurrency] = useState([]);
  const [status, setStatus] = useState('idle');
  const { t } = useTranslation();

  useEffect(() => {
    const localCurrency = JSON.parse(localStorage.getItem('currency'));

    (async () => {
      setStatus('pending');
      if (Date.now() - localCurrency?.time < 3600000) {
        // 3600000 = 1 hour
        setCurrency(localCurrency.data);
        setStatus('success');
      } else {
        setStatus('pending');

        try {
          const response = await getCurrency();

          if (response.ok) {
            const data = await response.json();

            localStorage.setItem(
              'currency',
              JSON.stringify({ data, time: Date.now() }),
            );

            setCurrency(data);
            setStatus('success');
          } else {
            setStatus('error');
          }
        } catch (error) {
          setStatus('error');
        }
      }
    })();
  }, []);

  return (
    <CurrencyTable>
      <TableHeader>
        <TableRow>
          <HeadCell>{t('ccy')}</HeadCell>
          <HeadCell>{t('buy')}</HeadCell>
          <HeadCell>{t('sale')}</HeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {status === 'success' &&
          currency.map(({ ccy, buy, sale }) => (
            <TableRow key={ccy}>
              <TableData>{ccy}</TableData>
              <TableData>{parseFloat(buy).toFixed(2)}</TableData>
              <TableData>{parseFloat(sale).toFixed(2)}</TableData>
            </TableRow>
          ))}
        {status === 'pending' && (
          <TailSpin
            ariaLabel="loading-indicator"
            color="var(--color-white)"
            height={80}
            width={80}
          />
        )}
      </TableBody>
      <Media query="(min-width: 1280px)" render={() => <TableFooter />} />
    </CurrencyTable>
  );
};

Currency.propTypes = {
  currency: PropTypes.arrayOf(
    PropTypes.shape({
      ccy: PropTypes.string.isRequired,
      buy: PropTypes.number.isRequired,
      sale: PropTypes.number.isRequired,
    }),
  ),
};
