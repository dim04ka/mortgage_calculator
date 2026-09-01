import styled from 'styled-components';

export const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledStat = styled.article`
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledStatLabel = styled.span`
  font-size: 12px;
  color: var(--text);
`;

export const StyledStatValue = styled.strong`
  font-size: 16px;
  color: var(--text-h);
  letter-spacing: -0.3px;
`;
