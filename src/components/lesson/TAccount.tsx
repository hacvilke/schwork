import React from 'react';
import styles from './TAccount.module.css';

export interface TAccountEntry {
  /** Short date label, e.g. "May 2" or "Dec 31" */
  date: string;
  /** Corresponding account name or description, e.g. "Sales", "Bank", "Balance c/d" */
  details: string;
  /** Formatted amount string, e.g. "54,000" */
  amount: string;
  /** Highlights carried-down or brought-down balance entries */
  isBalance?: boolean;
}

export interface TAccountProps {
  /** Ledger account name centered at the top of the T-account */
  title: string;
  /** Currency symbol shown in the Dr and Cr amount column headers (default: "J$") */
  currency?: string;
  /** Left-hand Debit (Dr) side entries */
  debit: TAccountEntry[];
  /** Right-hand Credit (Cr) side entries */
  credit: TAccountEntry[];
  /** Optional balancing total rendered with classic accounting double underline */
  total?: string;
  /** Optional Balance b/d entry shown below the double underline on the Debit side */
  debitBroughtDown?: TAccountEntry;
  /** Optional Balance b/d entry shown below the double underline on the Credit side */
  creditBroughtDown?: TAccountEntry;
  /** Optional kid-friendly interpretation note below the T-account */
  note?: string;
}

/**
 * Renders a classic British/Caribbean double-entry ledger T-account with
 * Dr on the left, Cr on the right, balancing totals, and Balance b/d rows.
 */
export default function TAccount({
  title,
  currency = 'J$',
  debit,
  credit,
  total,
  debitBroughtDown,
  creditBroughtDown,
  note,
}: TAccountProps): React.ReactElement {
  const rowCount = Math.max(debit.length, credit.length, 1);
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    dr: debit[i],
    cr: credit[i],
  }));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.sideTag}>Dr</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.sideTag}>Cr</span>
      </div>

      <div className={styles.scrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.dateCol}>Date</th>
              <th className={styles.detailsCol}>Details</th>
              <th className={`${styles.amountCol} ${styles.divider}`}>
                {currency}
              </th>
              <th className={styles.dateCol}>Date</th>
              <th className={styles.detailsCol}>Details</th>
              <th className={styles.amountCol}>{currency}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ dr, cr }, idx) => (
              <tr key={idx}>
                <td className={styles.dateCol}>{dr?.date ?? ''}</td>
                <td
                  className={`${styles.detailsCol} ${
                    dr?.isBalance ? styles.balanceCell : ''
                  }`}
                >
                  {dr?.details ?? ''}
                </td>
                <td
                  className={`${styles.amountCol} ${styles.divider} ${
                    dr?.isBalance ? styles.balanceCell : ''
                  }`}
                >
                  {dr?.amount ?? ''}
                </td>

                <td className={styles.dateCol}>{cr?.date ?? ''}</td>
                <td
                  className={`${styles.detailsCol} ${
                    cr?.isBalance ? styles.balanceCell : ''
                  }`}
                >
                  {cr?.details ?? ''}
                </td>
                <td
                  className={`${styles.amountCol} ${
                    cr?.isBalance ? styles.balanceCell : ''
                  }`}
                >
                  {cr?.amount ?? ''}
                </td>
              </tr>
            ))}

            {total && (
              <tr className={styles.totalRow}>
                <td />
                <td />
                <td className={`${styles.amountCol} ${styles.divider}`}>
                  {total}
                </td>
                <td />
                <td />
                <td className={styles.amountCol}>{total}</td>
              </tr>
            )}

            {(debitBroughtDown || creditBroughtDown) && (
              <tr className={styles.broughtDownRow}>
                <td className={styles.dateCol}>
                  {debitBroughtDown?.date ?? ''}
                </td>
                <td className={`${styles.detailsCol} ${styles.balanceCell}`}>
                  {debitBroughtDown?.details ?? ''}
                </td>
                <td
                  className={`${styles.amountCol} ${styles.divider} ${styles.balanceCell}`}
                >
                  {debitBroughtDown?.amount ?? ''}
                </td>

                <td className={styles.dateCol}>
                  {creditBroughtDown?.date ?? ''}
                </td>
                <td className={`${styles.detailsCol} ${styles.balanceCell}`}>
                  {creditBroughtDown?.details ?? ''}
                </td>
                <td className={`${styles.amountCol} ${styles.balanceCell}`}>
                  {creditBroughtDown?.amount ?? ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
