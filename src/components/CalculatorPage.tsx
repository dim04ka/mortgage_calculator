import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
import { formatMoney, formatPercent, parseNumber, yearsFromMonths } from '../mortgage/format';
import {
  expandOverpaymentPeriods,
  generateSchedule,
  summarizeSchedule,
  type OverpaymentPeriod,
  type PaymentType,
} from '../mortgage/mortgageCalculator';
import { faqItems, seo } from '../seo';

const StyledPage = styled.div`
  padding: 32px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1024px) {
    padding: 20px 16px 32px;
    gap: 18px;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTitle = styled.h1`
  margin: 0;
  font-size: 40px;
  letter-spacing: -1.2px;

  @media (max-width: 1024px) {
    font-size: 28px;
  }
`;

const StyledSubtitle = styled.p`
  color: var(--text);
  max-width: 720px;
`;

const StyledSection = styled.section`
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--social-bg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 16px;
  }
`;

const StyledSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledSectionTitle = styled.h2`
  margin: 0;
`;

const StyledSwitch = styled.div`
  display: flex;
  width: fit-content;
  padding: 4px;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
`;

const StyledSwitchButton = styled.button<{ $isActive: boolean }>`
  border: 0;
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? 'var(--accent)' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : 'var(--text-h)')};
  font: inherit;
  font-size: 14px;
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive ? 'var(--accent)' : 'var(--accent-bg)'};
  }
`;

const StyledHint = styled.p`
  color: var(--text);
  font-size: 15px;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StyledField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  font-size: 14px;
  color: var(--text);
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text-h);
  font: inherit;
  padding: 10px 12px;
  outline: none;

  &:focus {
    border-color: var(--accent-border);
    box-shadow: 0 0 0 3px var(--accent-bg);
  }
`;

const StyledFieldNote = styled.span`
  font-size: 13px;
  color: var(--text);
`;

const StyledError = styled.p`
  margin: 0;
  color: #dc2626;
  font-size: 14px;
`;

const StyledOverpayForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StyledButton = styled.button`
  border: 0;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  padding: 10px 16px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.05);
  }
`;

const StyledGhostButton = styled.button`
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font: inherit;
  font-size: 14px;
  padding: 6px 10px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--accent-bg);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const StyledPeriodList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledPeriod = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text-h);

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

const StyledPeriodLabel = styled.span`
  flex: 1 1 160px;
`;

const StyledPeriodAmountWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-size: 13px;
`;

const StyledPeriodAmount = styled(StyledInput)`
  width: 140px;
  padding: 8px 10px;
`;

const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StyledStat = styled.article`
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledStatLabel = styled.span`
  font-size: 13px;
  color: var(--text);
`;

const StyledStatValue = styled.strong`
  font-size: 22px;
  color: var(--text-h);
  letter-spacing: -0.4px;
`;

const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: var(--text);
`;

const StyledLegendItem = styled.span<{ $tone: 'grace' | 'overpay' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: ${({ $tone }) =>
      $tone === 'grace' ? 'var(--accent-bg)' : 'rgba(22, 163, 74, 0.18)'};
    border: 1px solid
      ${({ $tone }) =>
        $tone === 'grace' ? 'var(--accent-border)' : 'rgba(22, 163, 74, 0.45)'};
  }
`;

const StyledTableWrap = styled.div`
  overflow: auto;
  max-height: 640px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: right;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: var(--code-bg);
    color: var(--text);
    font-weight: 600;
    text-align: right;
    z-index: 1;
  }

  th:first-child,
  td:first-child {
    text-align: left;
    position: sticky;
    left: 0;
  }

  th:first-child {
    background: var(--code-bg);
  }

  tfoot td {
    font-weight: 600;
    color: var(--text-h);
    background: var(--code-bg);
  }
`;

const StyledRow = styled.tr<{ $isGrace: boolean; $hasOverpay: boolean }>`
  background: ${({ $isGrace, $hasOverpay }) =>
    $hasOverpay
      ? 'rgba(22, 163, 74, 0.12)'
      : $isGrace
        ? 'var(--accent-bg)'
        : 'var(--bg)'};

  td:first-child {
    background: ${({ $isGrace, $hasOverpay }) =>
      $hasOverpay
        ? 'rgba(22, 163, 74, 0.12)'
        : $isGrace
          ? 'var(--accent-bg)'
          : 'var(--bg)'};
  }
`;

const StyledFaqList = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFaqItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledFaqQuestion = styled.dt`
  margin: 0;
  font-weight: 600;
  color: var(--text-h);
`;

const StyledFaqAnswer = styled.dd`
  margin: 0;
  color: var(--text);
`;

const StyledFooter = styled.footer`
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  font-size: 14px;
  color: var(--text);
`;

const StyledFooterLink = styled.a`
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

type FormValues = {
  principal: string;
  totalMonths: string;
  graceMonths: string;
  rateFirstYear: string;
  rateAfterward: string;
};

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

type PeriodAmountFieldProps = {
  amount: number;
  onChange: (amount: number) => void;
};

function PeriodAmountField({ amount, onChange }: PeriodAmountFieldProps) {
  const [draft, setDraft] = useState(String(amount));

  const commit = () => {
    const parsed = parseNumber(draft);

    if (parsed > 0) {
      onChange(parsed);
      setDraft(String(parsed));
      return;
    }

    setDraft(String(amount));
  };

  return (
    <StyledPeriodAmount
      type="number"
      min="0"
      step="100"
      aria-label="Сумма досрочного погашения"
      value={draft}
      onChange={(event) => {
        const nextValue = event.target.value;
        setDraft(nextValue);
        const parsed = parseNumber(nextValue);
        if (parsed > 0) onChange(parsed);
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }
      }}
    />
  );
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

  const formatPeriodLabel = (period: OverpaymentPeriod): string => {
    if (period.fromMonth === period.toMonth) {
      return `${period.fromMonth} мес.`;
    }

    return `${period.fromMonth}–${period.toMonth} мес.`;
  };

  return (
    <StyledPage>
      <StyledHeader>
        <StyledTitle>Калькулятор ипотеки</StyledTitle>
        <StyledSubtitle>{seo.description}</StyledSubtitle>
        <StyledHint>
          {isAnnuity
            ? 'График аннуитета Беларусбанка: льготный год, затем равный платёж и пересчёт при досрочном погашении.'
            : 'Дифференцированный график: льготный год, затем равные доли тела кредита и уменьшающиеся проценты.'}
        </StyledHint>
      </StyledHeader>

      <StyledSection>
        <StyledSectionTitle>Параметры кредита</StyledSectionTitle>
        <StyledField>
          Тип графика
          <StyledSwitch role="radiogroup" aria-label="Тип графика">
            <StyledSwitchButton
              type="button"
              role="radio"
              aria-checked={isAnnuity}
              $isActive={isAnnuity}
              onClick={() => setPaymentType('annuity')}
            >
              Аннуитет
            </StyledSwitchButton>
            <StyledSwitchButton
              type="button"
              role="radio"
              aria-checked={!isAnnuity}
              $isActive={!isAnnuity}
              onClick={() => setPaymentType('differentiated')}
            >
              Дифференцированный
            </StyledSwitchButton>
          </StyledSwitch>
        </StyledField>
        <StyledGrid>
          <StyledField>
            Сумма кредита, BYN
            <StyledInput
              type="number"
              min="0"
              step="1000"
              value={values.principal}
              onChange={onFieldChange('principal')}
            />
          </StyledField>
          <StyledField>
            Срок, месяцев
            <StyledInput
              type="number"
              min="1"
              step="1"
              value={values.totalMonths}
              onChange={onFieldChange('totalMonths')}
            />
            <StyledFieldNote>
              {Number.isFinite(parseNumber(values.totalMonths))
                ? yearsFromMonths(parseNumber(values.totalMonths))
                : ''}
            </StyledFieldNote>
          </StyledField>
          <StyledField>
            Льготный период, месяцев
            <StyledInput
              type="number"
              min="0"
              step="1"
              value={values.graceMonths}
              onChange={onFieldChange('graceMonths')}
            />
          </StyledField>
          <StyledField>
            Ставка льготного периода, %
            <StyledInput
              type="number"
              min="0"
              step="0.01"
              value={values.rateFirstYear}
              onChange={onFieldChange('rateFirstYear')}
            />
          </StyledField>
          <StyledField>
            Ставка после льготного периода, %
            <StyledInput
              type="number"
              min="0"
              step="0.01"
              value={values.rateAfterward}
              onChange={onFieldChange('rateAfterward')}
            />
          </StyledField>
        </StyledGrid>
        {error ? <StyledError>{error}</StyledError> : null}
      </StyledSection>

      <StyledSection>
        <StyledSectionHeader>
          <StyledSectionTitle>Досрочное погашение</StyledSectionTitle>
          <StyledGhostButton
            type="button"
            onClick={clearPeriods}
            disabled={periods.length === 0}
          >
            Очистить все
          </StyledGhostButton>
        </StyledSectionHeader>
        <StyledHint>
          Добавляй периоды по одному: сначала 1–12, затем 13–24 и так дальше.
          Сумма — сверх обязательного платежа. Сумму уже добавленного периода
          можно поменять в его строке. Если периоды пересекаются, действует
          последний добавленный.
        </StyledHint>
        <StyledOverpayForm onSubmit={addOverpayments}>
          <StyledField>
            С месяца
            <StyledInput
              type="number"
              min="1"
              step="1"
              value={fromMonth}
              onChange={(event) => setFromMonth(event.target.value)}
            />
          </StyledField>
          <StyledField>
            По месяц
            <StyledInput
              type="number"
              min="1"
              step="1"
              value={toMonth}
              onChange={(event) => setToMonth(event.target.value)}
            />
          </StyledField>
          <StyledField>
            Сумма сверху, BYN
            <StyledInput
              type="number"
              min="0"
              step="100"
              value={overpayAmount}
              onChange={(event) => setOverpayAmount(event.target.value)}
            />
          </StyledField>
          <StyledButton type="submit">Добавить период</StyledButton>
        </StyledOverpayForm>
        {overpayError ? <StyledError>{overpayError}</StyledError> : null}
        {periods.length > 0 ? (
          <StyledPeriodList>
            {periods.map((period) => (
              <StyledPeriod key={period.id}>
                <StyledPeriodLabel>{formatPeriodLabel(period)}</StyledPeriodLabel>
                <StyledPeriodAmountWrap>
                  Сумма, BYN
                  <PeriodAmountField
                    amount={period.amount}
                    onChange={(amount) => updatePeriodAmount(period.id, amount)}
                  />
                </StyledPeriodAmountWrap>
                <StyledGhostButton
                  type="button"
                  onClick={() => removePeriod(period.id)}
                >
                  Удалить
                </StyledGhostButton>
              </StyledPeriod>
            ))}
          </StyledPeriodList>
        ) : null}
      </StyledSection>

      {summary ? (
        <StyledSummaryGrid>
          <StyledStat>
            <StyledStatLabel>
              {isAnnuity
                ? 'Обязательный платёж после льготы'
                : 'Первый платёж после льготы'}
            </StyledStatLabel>
            <StyledStatValue>{formatMoney(summary.requiredAnnuity)} BYN</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>Всего выплатите</StyledStatLabel>
            <StyledStatValue>{formatMoney(summary.totalPaid)} BYN</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>Проценты банку</StyledStatLabel>
            <StyledStatValue>{formatMoney(summary.totalInterest)} BYN</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>Фактический срок</StyledStatLabel>
            <StyledStatValue>
              {summary.monthsPaid} мес.
              {summary.monthsSaved > 0 ? ` (−${summary.monthsSaved})` : ''}
            </StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>Досрочно внесено</StyledStatLabel>
            <StyledStatValue>{formatMoney(summary.totalOverpaid)} BYN</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>Экономия на процентах</StyledStatLabel>
            <StyledStatValue>{formatMoney(summary.interestSaved)} BYN</StyledStatValue>
          </StyledStat>
        </StyledSummaryGrid>
      ) : null}

      {schedule.length > 0 ? (
        <StyledSection>
          <StyledSectionTitle>График платежей</StyledSectionTitle>
          <StyledLegend>
            <StyledLegendItem $tone="grace">льготный период</StyledLegendItem>
            <StyledLegendItem $tone="overpay">месяц с досрочкой</StyledLegendItem>
          </StyledLegend>
          <StyledTableWrap>
            <StyledTable>
              <thead>
                <tr>
                  <th>Месяц</th>
                  <th>Ставка</th>
                  <th>Остаток на начало</th>
                  <th>Тело кредита</th>
                  <th>Досрочка</th>
                  <th>Проценты</th>
                  <th>Платёж всего</th>
                  <th>Остаток на конец</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <StyledRow
                    key={row.month}
                    $isGrace={row.month <= parseNumber(values.graceMonths)}
                    $hasOverpay={row.overpayment > 0}
                  >
                    <td>{row.month}</td>
                    <td>{formatPercent(row.rate)}</td>
                    <td>{formatMoney(row.startDebt)}</td>
                    <td>{formatMoney(row.mainDebtPayment)}</td>
                    <td>{formatMoney(row.overpayment)}</td>
                    <td>{formatMoney(row.interestPayment)}</td>
                    <td>{formatMoney(row.totalPayment)}</td>
                    <td>{formatMoney(row.endDebt)}</td>
                  </StyledRow>
                ))}
              </tbody>
              {summary ? (
                <tfoot>
                  <tr>
                    <td>Итого</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{formatMoney(summary.totalOverpaid)}</td>
                    <td>{formatMoney(summary.totalInterest)}</td>
                    <td>{formatMoney(summary.totalPaid)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              ) : null}
            </StyledTable>
          </StyledTableWrap>
        </StyledSection>
      ) : null}

      <StyledSection>
        <StyledSectionTitle>Частые вопросы</StyledSectionTitle>
        <StyledFaqList>
          {faqItems.map((item) => (
            <StyledFaqItem key={item.question}>
              <StyledFaqQuestion>{item.question}</StyledFaqQuestion>
              <StyledFaqAnswer>{item.answer}</StyledFaqAnswer>
            </StyledFaqItem>
          ))}
        </StyledFaqList>
      </StyledSection>

      <StyledFooter>
        Вопросы и правки:
        <StyledFooterLink
          href="https://www.linkedin.com/in/dmitry-suhotsky"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </StyledFooterLink>
        <StyledFooterLink href="mailto:dmitry.suhotsky@gmail.com">
          dmitry.suhotsky@gmail.com
        </StyledFooterLink>
      </StyledFooter>
    </StyledPage>
  );
}
