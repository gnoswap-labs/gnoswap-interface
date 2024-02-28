import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const EarnDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  gap: 16px;
  overflow-x: auto;

  .card {
    display: flex;
    width: 100%;  
    padding: 16px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid var(--border2-dark_gray500Border2, #1C2230);
    background: var(--background-09-dark-black-opacity-07-hover-2, rgba(10, 14, 23, 0.70));

    .title-wrapper {
      ${fonts.body11}
      color: ${({ theme }) => theme.color.text05};
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .description-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      ${fonts.body11}
      color: ${({ theme }) => theme.color.text04};
      white-space: nowrap;

      .text::after {
        content: " ";
      }

      .highlight {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 18px;
        background: linear-gradient(308deg, #536cd7 0%, #a7b9f8 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .logo {
        display: inline-flex;
      }
    }

    .link-wrapper {
      display: flex;
      flex-direction: row;
      ${fonts.body11}
      background: linear-gradient(308deg, #536cd7 0%, #a7b9f8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
    }
  }
`;
