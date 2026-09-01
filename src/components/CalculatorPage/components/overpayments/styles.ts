import styled from 'styled-components';

export const StyledOverpayForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledButton = styled.button`
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  height: 32px;

  &:hover {
    filter: brightness(1.05);
  }
`;

export const StyledGhostButton = styled.button`
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text-h);
  font: inherit;
  font-size: 13px;
  padding: 4px 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--accent-bg);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const StyledPeriodList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledPeriod = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 13px;
  color: var(--text-h);

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

export const StyledPeriodLabel = styled.span`
  flex: 1 1 160px;
`;

export const StyledPeriodAmountWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text);
  font-size: 12px;
`;
