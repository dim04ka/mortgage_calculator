import { StyledFooter, StyledFooterLink } from './styles';

export function PageFooter() {
  return (
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
  );
}
