import { faqItems } from '../../../../seo';
import { StyledSection, StyledSectionTitle } from '../shared/styles';
import {
  StyledFaqAnswer,
  StyledFaqItem,
  StyledFaqList,
  StyledFaqQuestion,
} from './styles';

export function Faq() {
  return (
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
  );
}
