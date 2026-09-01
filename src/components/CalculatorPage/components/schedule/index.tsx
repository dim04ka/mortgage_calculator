import { formatMoney, formatPercent } from '../../../../mortgage/format';
import type {
  BelarusbankAnnuityRow,
  ScheduleSummary,
} from '../../../../mortgage/mortgageCalculator';
import { StyledSection, StyledSectionHeader, StyledSectionTitle } from '../shared/styles';
import {
  StyledLegend,
  StyledLegendItem,
  StyledRow,
  StyledTable,
  StyledTableWrap,
} from './styles';

type ScheduleProps = {
  schedule: BelarusbankAnnuityRow[];
  graceMonths: number;
  summary: ScheduleSummary | null;
};

export function Schedule({ schedule, graceMonths, summary }: ScheduleProps) {
  return (
    <StyledSection>
      <StyledSectionHeader>
        <StyledSectionTitle>График платежей</StyledSectionTitle>
        <StyledLegend>
          <StyledLegendItem $tone="grace">льготный период</StyledLegendItem>
          <StyledLegendItem $tone="overpay">месяц с досрочкой</StyledLegendItem>
        </StyledLegend>
      </StyledSectionHeader>
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
                $isGrace={row.month <= graceMonths}
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
  );
}
