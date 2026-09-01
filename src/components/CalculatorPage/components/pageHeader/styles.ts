import styled from 'styled-components';

export const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.6px;

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

export const StyledSubtitle = styled.p`
  margin: 0;
  color: var(--text);
  max-width: 720px;
  font-size: 13px;
`;
