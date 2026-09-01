import styled from 'styled-components';

export const StyledPage = styled.div`
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1024px) {
    padding: 12px 12px 20px;
    gap: 10px;
  }
`;
