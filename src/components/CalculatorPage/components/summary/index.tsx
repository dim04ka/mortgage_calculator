import { formatMoney } from '../../../../mortgage/format';
import type { ScheduleSummary } from '../../../../mortgage/mortgageCalculator';
import { StyledStat, StyledStatLabel, StyledStatValue, StyledSummaryGrid } from './styles';

type SummaryProps = {
  isAnnuity: boolean;
  summary: ScheduleSummary;
};

export function Summary({ isAnnuity, summary }: SummaryProps) {
  return (
    <StyledSummaryGrid>
      <StyledStat>
        <StyledStatLabel>
          {isAnnuity ? 'Обязательный платёж после льготы' : 'Первый платёж после льготы'}
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
  );
}
