import { keyframes } from "styled-components";

export const fadeDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const moveDown = keyframes`
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
`;

export const floatUpDown = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;
