import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { parseNumber } from '../../mortgage/format';
import {
  expandOverpaymentPeriods,
  generateSchedule,
  summarizeSchedule,
  type OverpaymentPeriod,
  type PaymentType,
} from '../../mortgage/mortgageCalculator';
import {
  Faq,
  LoanParams,
  Overpayments,
  PageFooter,
  PageHeader,
  Schedule,
  Summary,
} from './components';
import { StyledPage } from './styles';
import type { FormValues } from './types';

const defaultValues: FormValues = {
  principal: '333000',
  totalMonths: '240',
  graceMonths: '12',
  rateFirstYear: '6.75',
  rateAfterward: '14.40',
};

function getError(values: FormValues): string | null {
  const principal = parseNumber(values.principal);
  const totalMonths = parseNumber(values.totalMonths);
  const graceMonths = parseNumber(values.graceMonths);
  const rateFirstYear = parseNumber(values.rateFirstYear);
  const rateAfterward = parseNumber(values.rateAfterward);

  if (!(principal > 0)) return 'Сумма кредита должна быть больше 0';
  if (!(totalMonths >= 1) || !Number.isInteger(totalMonths)) {
    return 'Срок указывай целым числом месяцев';
  }
  if (!(graceMonths >= 0) || !Number.isInteger(graceMonths)) {
    return 'Льготный период указывай целым числом месяцев';
  }
  if (graceMonths >= totalMonths) {
    return 'Льготный период должен быть меньше общего срока';
  }
  if (!(rateFirstYear >= 0)) return 'Ставка льготного периода не может быть отрицательной';
  if (!(rateAfterward >= 0)) return 'Ставка после льготного периода не может быть отрицательной';

  return null;
}

export function CalculatorPage() {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [paymentType, setPaymentType] = useState<PaymentType>('annuity');
  const [periods, setPeriods] = useState<OverpaymentPeriod[]>([]);
  const [fromMonth, setFromMonth] = useState('1');
  const [toMonth, setToMonth] = useState('12');
  const [overpayAmount, setOverpayAmount] = useState('1000');
  const [overpayError, setOverpayError] = useState<string | null>(null);

  const error = getError(values);
  const isAnnuity = paymentType === 'annuity';

  const parsedInput = useMemo(() => {
    if (error) return null;

    return {
      principal: parseNumber(values.principal),
      totalMonths: parseNumber(values.totalMonths),
      graceMonths: parseNumber(values.graceMonths),
      rateFirstYear: parseNumber(values.rateFirstYear),
      rateAfterward: parseNumber(values.rateAfterward),
      overpayments: expandOverpaymentPeriods(periods),
      paymentType,
    };
  }, [error, paymentType, periods, values]);

  const baseline = useMemo(() => {
    if (!parsedInput) return [];
    return generateSchedule({ ...parsedInput, overpayments: [] });
  }, [parsedInput]);

  const schedule = useMemo(() => {
    if (!parsedInput) return [];
    return generateSchedule(parsedInput);
  }, [parsedInput]);

  const summary = useMemo(() => {
    if (!parsedInput) return null;

    return summarizeSchedule(
      schedule,
      parsedInput.totalMonths,
      parsedInput.graceMonths,
      baseline.reduce((sum, row) => sum + row.interestPayment, 0),
    );
  }, [baseline, parsedInput, schedule]);

  const onFieldChange =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const addOverpayments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const from = parseNumber(fromMonth);
    const to = parseNumber(toMonth);
    const amount = parseNumber(overpayAmount);
    const maxMonth = parseNumber(values.totalMonths);

    if (!Number.isInteger(from) || from < 1) {
      setOverpayError('Укажи месяц начала целым числом от 1');
      return;
    }
    if (!Number.isInteger(to) || to < 1) {
      setOverpayError('Укажи месяц окончания целым числом от 1');
      return;
    }
    if (!(amount > 0)) {
      setOverpayError('Сумма досрочки должна быть больше 0');
      return;
    }

    const start = Math.max(1, Math.min(from, to));
    const end = Math.min(
      Number.isFinite(maxMonth) ? maxMonth : Math.max(from, to),
      Math.max(from, to),
    );

    setPeriods((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        fromMonth: start,
        toMonth: end,
        amount,
      },
    ]);
    setOverpayError(null);
    setFromMonth(String(end + 1));
    setToMonth('');
  };

  const removePeriod = (id: string) => {
    setPeriods((current) => current.filter((period) => period.id !== id));
  };

  const updatePeriodAmount = (id: string, amount: number) => {
    setPeriods((current) =>
      current.map((period) => (period.id === id ? { ...period, amount } : period)),
    );
  };

  const clearPeriods = () => {
    setPeriods([]);
    setFromMonth('1');
    setToMonth('12');
    setOverpayError(null);
  };

  return (
    <StyledPage>
      <PageHeader isAnnuity={isAnnuity} />
      <LoanParams
        values={values}
        paymentType={paymentType}
        error={error}
        onFieldChange={onFieldChange}
        onPaymentTypeChange={setPaymentType}
      />
      <Overpayments
        periods={periods}
        fromMonth={fromMonth}
        toMonth={toMonth}
        overpayAmount={overpayAmount}
        overpayError={overpayError}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        onOverpayAmountChange={setOverpayAmount}
        onAdd={addOverpayments}
        onClear={clearPeriods}
        onRemove={removePeriod}
        onUpdateAmount={updatePeriodAmount}
      />
      {summary ? <Summary isAnnuity={isAnnuity} summary={summary} /> : null}
      {parsedInput && schedule.length > 0 ? (
        <Schedule
          schedule={schedule}
          graceMonths={parsedInput.graceMonths}
          summary={summary}
        />
      ) : null}
      <Faq />
      <PageFooter />
    </StyledPage>
  );
}
