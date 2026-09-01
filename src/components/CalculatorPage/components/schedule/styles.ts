import styled from 'styled-components';

export const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 12px;
  color: var(--text);
`;

export const StyledLegendItem = styled.span<{ $tone: 'grace' | 'overpay' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${({ $tone }) =>
      $tone === 'grace' ? 'var(--accent-bg)' : 'rgba(22, 163, 74, 0.18)'};
    border: 1px solid
      ${({ $tone }) =>
        $tone === 'grace' ? 'var(--accent-border)' : 'rgba(22, 163, 74, 0.45)'};
  }
`;

export const StyledTableWrap = styled.div`
  overflow: auto;
  max-height: 560px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: right;

  th,
  td {
    padding: 4px 8px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: var(--code-bg);
    color: var(--text);
    font-weight: 600;
    text-align: right;
    z-index: 1;
  }

  th:first-child,
  td:first-child {
    text-align: left;
    position: sticky;
    left: 0;
  }

  th:first-child {
    background: var(--code-bg);
  }

  tfoot td {
    font-weight: 600;
    color: var(--text-h);
    background: var(--code-bg);
  }
`;

export const StyledRow = styled.tr<{ $isGrace: boolean; $hasOverpay: boolean }>`
  background: ${({ $isGrace, $hasOverpay }) =>
    $hasOverpay
      ? 'rgba(22, 163, 74, 0.12)'
      : $isGrace
        ? 'var(--accent-bg)'
        : 'var(--bg)'};

  td:first-child {
    background: ${({ $isGrace, $hasOverpay }) =>
      $hasOverpay
        ? 'rgba(22, 163, 74, 0.12)'
        : $isGrace
          ? 'var(--accent-bg)'
          : 'var(--bg)'};
  }
`;
