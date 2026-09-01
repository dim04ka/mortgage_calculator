import styled from 'styled-components';

export const StyledFaqList = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledFaqItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledFaqQuestion = styled.dt`
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-h);
`;

export const StyledFaqAnswer = styled.dd`
  margin: 0;
  font-size: 13px;
  color: var(--text);
`;
