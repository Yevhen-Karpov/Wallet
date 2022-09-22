import { useDispatch } from 'react-redux';
import EllipsisText from 'react-ellipsis-text';
import { useTranslation } from 'react-i18next';
import {
  TableMain,
  TableHeader,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  TableCellColor,
  ButtonDelete,
  NoTransactions,
} from './Table.styled';
import sprite from 'images/sprite.svg';
import { operations } from '../../redux/transactions/transactions-operations';
/*компонент отримує масив для рендеру як по ТЗ*/

function Table({ data }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.slice(0, 2);
  const dispatch = useDispatch();

  const onDelete = _id => {
    dispatch(operations.deleteTransaction(_id));
  };

  return (
    <>
      {data.length === 0 ? (
        <NoTransactions>{t('no_transactions')}.</NoTransactions>
      ) : (
        <TableMain>
          <TableHeader>
            <TableHeaderRow>
              <TableHeadCell>{t('date')}</TableHeadCell>
              <TableHeadCell>{t('type')}</TableHeadCell>
              <TableHeadCell>{t('category')}</TableHeadCell>
              <TableHeadCell>{t('description')}</TableHeadCell>
              <TableHeadCell>{t('sum')}</TableHeadCell>
              <TableHeadCell>{t('balance')}</TableHeadCell>
              <TableHeadCell>{''}</TableHeadCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {data.map(
              ({
                _id,
                date,
                typeTransaction,
                category,
                description,
                sum,
                categoryUA,
                balance,
              }) => (
                <TableRow key={_id}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{typeTransaction === true ? '+' : '-'}</TableCell>
                  <TableCell>
                    {currentLanguage === 'en'
                      ? category ?? 'Income'
                      : categoryUA ?? 'Дохід'}
                  </TableCell>
                  <TableCell>
                    <EllipsisText
                      text={description ?? '-'}
                      length={14}
                    ></EllipsisText>
                  </TableCell>
                  <TableCellColor
                    type={typeTransaction === true ? 'income' : 'costs'}
                  >
                    {sum}
                  </TableCellColor>
                  <TableCell>{balance}</TableCell>
                  <TableCell>
                    <ButtonDelete onClick={() => onDelete(_id)}>
                      <svg width="16" height="16">
                        <use href={`${sprite}#bin`} />
                      </svg>
                    </ButtonDelete>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </TableMain>
      )}
    </>
  );
}

export default Table;
