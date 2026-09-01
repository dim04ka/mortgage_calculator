import { useState } from 'react';
import { parseNumber } from '../../../../../mortgage/format';
import { StyledPeriodAmount } from './styles';

type PeriodAmountFieldProps = {
  amount: number;
  onChange: (amount: number) => void;
};

export function PeriodAmountField({ amount, onChange }: PeriodAmountFieldProps) {
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
