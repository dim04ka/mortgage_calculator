import type { FormEvent } from 'react';
import type { OverpaymentPeriod } from '../../../../mortgage/mortgageCalculator';
import {
  StyledError,
  StyledField,
  StyledHint,
  StyledInput,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
} from '../shared/styles';
import { PeriodAmountField } from './periodAmountField';
import {
  StyledButton,
  StyledGhostButton,
  StyledOverpayForm,
  StyledPeriod,
  StyledPeriodAmountWrap,
  StyledPeriodLabel,
  StyledPeriodList,
} from './styles';

type OverpaymentsProps = {
  periods: OverpaymentPeriod[];
  fromMonth: string;
  toMonth: string;
  overpayAmount: string;
  overpayError: string | null;
  onFromMonthChange: (value: string) => void;
  onToMonthChange: (value: string) => void;
  onOverpayAmountChange: (value: string) => void;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
};

function formatPeriodLabel(period: OverpaymentPeriod): string {
  if (period.fromMonth === period.toMonth) {
    return `${period.fromMonth} мес.`;
  }

  return `${period.fromMonth}–${period.toMonth} мес.`;
}

export function Overpayments({
  periods,
  fromMonth,
  toMonth,
  overpayAmount,
  overpayError,
  onFromMonthChange,
  onToMonthChange,
  onOverpayAmountChange,
  onAdd,
  onClear,
  onRemove,
  onUpdateAmount,
}: OverpaymentsProps) {
  return (
    <StyledSection>
      <StyledSectionHeader>
        <StyledSectionTitle>Досрочное погашение</StyledSectionTitle>
        <StyledGhostButton type="button" onClick={onClear} disabled={periods.length === 0}>
          Очистить все
        </StyledGhostButton>
      </StyledSectionHeader>
      <StyledHint>
        Добавляй периоды по одному: сначала 1–12, затем 13–24 и так дальше. Сумма — сверх
        обязательного платежа. Сумму уже добавленного периода можно поменять в его строке. Если
        периоды пересекаются, действует последний добавленный.
      </StyledHint>
      <StyledOverpayForm onSubmit={onAdd}>
        <StyledField>
          С месяца
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={fromMonth}
            onChange={(event) => onFromMonthChange(event.target.value)}
          />
        </StyledField>
        <StyledField>
          По месяц
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={toMonth}
            onChange={(event) => onToMonthChange(event.target.value)}
          />
        </StyledField>
        <StyledField>
          Сумма сверху, BYN
          <StyledInput
            type="number"
            min="0"
            step="100"
            value={overpayAmount}
            onChange={(event) => onOverpayAmountChange(event.target.value)}
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
                  onChange={(amount) => onUpdateAmount(period.id, amount)}
                />
              </StyledPeriodAmountWrap>
              <StyledGhostButton type="button" onClick={() => onRemove(period.id)}>
                Удалить
              </StyledGhostButton>
            </StyledPeriod>
          ))}
        </StyledPeriodList>
      ) : null}
    </StyledSection>
  );
}
