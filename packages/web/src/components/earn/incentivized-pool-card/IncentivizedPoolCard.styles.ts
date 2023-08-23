import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const PoolCardWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  min-width: 290px;
  padding: 16px;
  gap: 8px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 10px;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.color.text02};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.color.background02};
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.08);
  }

  .pool-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${fonts.body5}
    gap: 16px;
    align-self: stretch;
  }

  .title-container {
    ${mixins.flexbox("column", "flex-end", "flex-start")};
    width: 100%;
    gap: 4px;
    align-self: stretch;
    .box-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
    .box-group {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 2px;
    }
  }

  .list-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    .list-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
    .list-content {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
  }

  .volume-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    align-self: stretch;
  }

  .volume-header {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    align-self: stretch;
    .volume-title {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
    .volume-content {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
  }

  .pool-content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    ${fonts.body8};
    background-color: ${({ theme }) => theme.color.backgroundOpacity};
    border-radius: 8px;
    padding: 16px;
    gap: 24px;
    align-self: stretch;
  }

  .label-text {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12};
    height: 18px;
  }
  .value-text {
    ${fonts.body10};
  }
`;
