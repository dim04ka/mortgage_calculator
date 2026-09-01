import styled from 'styled-components';

export const StyledSwitch = styled.div`
  display: flex;
  width: fit-content;
  padding: 2px;
  gap: 2px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
`;

export const StyledSwitchButton = styled.button<{ $isActive: boolean }>`
  border: 0;
  border-radius: 6px;
  background: ${({ $isActive }) => ($isActive ? 'var(--accent)' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : 'var(--text-h)')};
  font: inherit;
  font-size: 13px;
  padding: 4px 10px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive ? 'var(--accent)' : 'var(--accent-bg)'};
  }
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledFieldNote = styled.span`
  font-size: 12px;
  color: var(--text);
`;
