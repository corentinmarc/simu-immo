/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { sansSerif } from 'styles/fonts';

const headerCSS = css`
  width: 100%;
  height: 80px;
  background: #2dc5ff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const titleCSS = css`
  color: #fff;
  font-size: 40px;
  font-weight: normal;
  font-family: ${sansSerif};
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3);
`;

const Header = () => (
  <div css={headerCSS}>
    <h1 css={titleCSS}>Simulateur emprunt immobilier</h1>
  </div>
);

export default Header;
