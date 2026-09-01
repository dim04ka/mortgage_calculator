import { seo } from '../../../../seo';
import { StyledHint } from '../shared/styles';
import { StyledHeader, StyledSubtitle, StyledTitle } from './styles';

type PageHeaderProps = {
  isAnnuity: boolean;
};

export function PageHeader({ isAnnuity }: PageHeaderProps) {
  return (
    <StyledHeader>
      <StyledTitle>Калькулятор ипотеки</StyledTitle>
      <StyledSubtitle>{seo.description}</StyledSubtitle>
      <StyledHint>
        {isAnnuity
          ? 'График аннуитета Беларусбанка: льготный год, затем равный платёж и пересчёт при досрочном погашении.'
          : 'Дифференцированный график: льготный год, затем равные доли тела кредита и уменьшающиеся проценты.'}
      </StyledHint>
    </StyledHeader>
  );
}
