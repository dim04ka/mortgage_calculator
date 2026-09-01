import styled from 'styled-components';

export const StyledSection = styled.section`
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--social-bg);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 1024px) {
    padding: 10px;
    gap: 8px;
  }
`;

export const StyledSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export const StyledSectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
`;

export const StyledHint = styled.p`
  margin: 0;
  color: var(--text);
  font-size: 13px;
`;

export const StyledField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  font-size: 13px;
  color: var(--text);
`;

export const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
  font: inherit;
  padding: 6px 8px;
  outline: none;

  &:focus {
    border-color: var(--accent-border);
    box-shadow: 0 0 0 2px var(--accent-bg);
  }
`;

export const StyledError = styled.p`
  margin: 0;
  color: #dc2626;
  font-size: 13px;
`;
