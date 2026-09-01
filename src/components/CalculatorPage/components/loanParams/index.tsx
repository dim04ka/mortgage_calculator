import type { ChangeEvent } from 'react';
import { parseNumber, yearsFromMonths } from '../../../../mortgage/format';
import type { PaymentType } from '../../../../mortgage/mortgageCalculator';
import type { FormValues } from '../../types';
import {
  StyledError,
  StyledField,
  StyledInput,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
} from '../shared/styles';
import {
  StyledFieldNote,
  StyledGrid,
  StyledSwitch,
  StyledSwitchButton,
} from './styles';

type LoanParamsProps = {
  values: FormValues;
  paymentType: PaymentType;
  error: string | null;
  onFieldChange: (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  onPaymentTypeChange: (type: PaymentType) => void;
};

export function LoanParams({
  values,
  paymentType,
  error,
  onFieldChange,
  onPaymentTypeChange,
}: LoanParamsProps) {
  const isAnnuity = paymentType === 'annuity';

  return (
    <StyledSection>
      <StyledSectionHeader>
        <StyledSectionTitle>Параметры кредита</StyledSectionTitle>
        <StyledSwitch role="radiogroup" aria-label="Тип графика">
          <StyledSwitchButton
            type="button"
            role="radio"
            aria-checked={isAnnuity}
            $isActive={isAnnuity}
            onClick={() => onPaymentTypeChange('annuity')}
          >
            Аннуитет
          </StyledSwitchButton>
          <StyledSwitchButton
            type="button"
            role="radio"
            aria-checked={!isAnnuity}
            $isActive={!isAnnuity}
            onClick={() => onPaymentTypeChange('differentiated')}
          >
            Дифференцированный
          </StyledSwitchButton>
        </StyledSwitch>
      </StyledSectionHeader>
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
  );
}
