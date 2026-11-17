/**
 * Interactive 8-stage Accounting Cycle explorer for Principles of Accounts (POA).
 * Students tap any stage (or step forward/backward) to see what happens at each
 * stage, which documents or books are used, and a concrete Jamaican business example.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {ChevronLeft, ChevronRight, RefreshCw} from 'lucide-react';
import styles from './AccountingCycle.module.css';

interface CycleStage {
  step: number;
  shortTitle: string;
  title: string;
  recordUsed: string;
  summary: string;
  jamaicanExample: string;
}

const ACCOUNTING_CYCLE_STAGES: CycleStage[] = [
  {
    step: 1,
    shortTitle: 'Source Documents',
    title: '1. Collect & Check Source Documents',
    recordUsed: 'Receipts, Invoices, Debit/Credit Notes, Cheque Counterfoils',
    summary:
      'Every accounting entry begins with physical or digital proof that a business transaction happened. Without a source document, nothing should be entered in the books.',
    jamaicanExample:
      'Kingston Hardware sells J$15,000 of paint for cash and writes out a numbered Cash Receipt (#402) for the customer, keeping the duplicate copy.',
  },
  {
    step: 2,
    shortTitle: 'Journalise',
    title: '2. Journalise in Books of Original Entry',
    recordUsed: 'Cash Book, Sales/Purchases/Returns Day Books, General Journal',
    summary:
      'Transactions are recorded first in chronological (date) order in the appropriate Book of Original Entry — also called Prime Entry books.',
    jamaicanExample:
      'Using Receipt #402, the accounts clerk enters J$15,000 on the debit (receipts) side of the Cash Book with the date and folio reference.',
  },
  {
    step: 3,
    shortTitle: 'Post to Ledgers',
    title: '3. Post to Ledgers (Double Entry: Debit & Credit)',
    recordUsed: 'General Ledger, Sales Ledger, Purchases Ledger',
    summary:
      'Amounts from the journals are posted into individual T-accounts using Double Entry: every transaction has an equal Debit (Dr) and Credit (Cr) so the books always stay balanced.',
    jamaicanExample:
      'Cash Account (Asset increases) is Debited J$15,000; Sales Account (Revenue increases) is Credited J$15,000. Total Dr = Total Cr.',
  },
  {
    step: 4,
    shortTitle: 'Trial Balance',
    title: '4. Prepare the Unadjusted Trial Balance',
    recordUsed: 'Unadjusted Trial Balance',
    summary:
      'At the end of the period, every ledger account is balanced off and listed in Debit and Credit columns to test arithmetical accuracy before adjustments.',
    jamaicanExample:
      'All Debit balances (Cash, Equipment, Debtors, Expenses) and all Credit balances (Sales, Capital, Creditors) are totalled — both columns equal J$840,000.',
  },
  {
    step: 5,
    shortTitle: 'Adjusting Entries',
    title: '5. Record Adjusting Entries',
    recordUsed: 'General Journal & Ledger Adjustments',
    summary:
      'Apply the Accrual, Matching, and Prudence concepts at period-end: record unpaid bills (accruals), prepaid expenses, depreciation on equipment, and provision for doubtful debts.',
    jamaicanExample:
      'JPS electricity for December (J$18,500) has been used but not yet paid. An adjusting journal entry debits Electricity Expense and credits Accrued Electricity.',
  },
  {
    step: 6,
    shortTitle: 'Adjusted Trial Balance',
    title: '6. Prepare the Adjusted Trial Balance',
    recordUsed: 'Adjusted Trial Balance',
    summary:
      'After posting all adjusting entries, list the updated ledger balances to confirm Total Debits still equal Total Credits before drafting final statements.',
    jamaicanExample:
      'Electricity Expense now reflects the full 12 months used, and Accrued Electricity appears as a Current Liability. Debit and Credit totals still match.',
  },
  {
    step: 7,
    shortTitle: 'Financial Statements',
    title: '7. Draft Financial Statements',
    recordUsed: 'Trading & Profit and Loss Account (Income Statement) & Balance Sheet',
    summary:
      'Prepare the Trading and Profit & Loss Account (Income Statement) to calculate Gross Profit and Net Profit (or Loss), followed by the Balance Sheet (Statement of Financial Position) showing Fixed Assets, Current Assets, Liabilities, and Capital.',
    jamaicanExample:
      'Kingston Hardware reports Net Profit of J$245,000 on its Income Statement and updates Owner’s Capital on its Balance Sheet so Assets = Capital + Liabilities.',
  },
  {
    step: 8,
    shortTitle: 'Closing Entries',
    title: '8. Closing Entries & Post-Closing Trial Balance',
    recordUsed: 'General Journal & Post-Closing Trial Balance',
    summary:
      'Transfer all temporary accounts (Sales, Purchases, Expenses, Drawings) to the Income Statement / Capital so they reset to J$0 for the new year. Only permanent accounts (Assets, Liabilities, Capital) carry forward.',
    jamaicanExample:
      'Sales and Expense accounts are closed to Profit & Loss, Net Profit is added to Capital, and Kingston Hardware opens January 1 with a clean Post-Closing Trial Balance.',
  },
];

export default function AccountingCycle(): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = ACCOUNTING_CYCLE_STAGES[activeIndex];

  const goPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? ACCOUNTING_CYCLE_STAGES.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === ACCOUNTING_CYCLE_STAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={styles.shell} aria-label="Interactive Accounting Cycle">
      <div className={styles.toolbar}>
        <div className={styles.titleWrap}>
          <span className={styles.badge}>Interactive Cycle</span>
          <h3 className={styles.title}>The 8-Stage Accounting Cycle</h3>
        </div>

        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goPrevious}
            aria-label="Previous accounting cycle stage">
            <ChevronLeft size={16} aria-hidden="true" />
            Prev
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goNext}
            aria-label="Next accounting cycle stage">
            Next
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.stepGrid} role="tablist" aria-label="Accounting cycle stages">
        {ACCOUNTING_CYCLE_STAGES.map((stage, index) => (
          <button
            key={stage.step}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={clsx(styles.stepBtn, index === activeIndex && styles.stepBtnActive)}>
            <span className={styles.stepNum}>STEP {stage.step}</span>
            <span className={styles.stepName}>{stage.shortTitle}</span>
          </button>
        ))}
      </div>

      <div className={styles.detailPanel} role="tabpanel">
        <div className={styles.detailTop}>
          <h4 className={styles.stageHeading}>{current.title}</h4>
          <span className={styles.bookPill}>{current.recordUsed}</span>
        </div>

        <p className={styles.detailDesc}>{current.summary}</p>

        <div className={styles.exampleBox}>
          <span className={styles.exampleLabel}>Jamaican Business Example</span>
          <div>{current.jamaicanExample}</div>
        </div>
      </div>

      <div className={styles.cycleLoopNote}>
        <RefreshCw size={14} aria-hidden="true" />
        <span>
          Stage {current.step} of {ACCOUNTING_CYCLE_STAGES.length} — After Step 8 (Closing Entries),
          the cycle loops straight back to Step 1 for the next accounting period.
        </span>
      </div>
    </section>
  );
}
