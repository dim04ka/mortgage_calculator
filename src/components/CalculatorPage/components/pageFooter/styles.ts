import styled from 'styled-components';

export const StyledFooter = styled.footer`
  padding-top: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  font-size: 13px;
  color: var(--text);
`;

export const StyledFooterLink = styled.a`
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
