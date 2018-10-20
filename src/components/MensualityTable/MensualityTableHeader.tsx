import React, { SFC } from 'react';
import classnames from 'classnames';

import styles from './MensualityTable.scss';

interface Props {};

const MensualityTableHeader: SFC<Props> = () => (
  <div className={classnames(styles.line, styles['line-header'])}>
    <div className={classnames(styles['line-month'])}>Mensualit&eacute; n°</div>
    <div className={classnames(styles['line-cost-capital'])}>Capital rembours&eacute;</div>
    <div className={classnames(styles['line-cost-interest'])}>Co&ucirc;t int&eacute;r&ecirc;t</div>
    <div className={classnames(styles['line-cost-insurance'])}>Co&ucirc;t assurance</div>
    <div className={classnames(styles['line-cost-cumul'])}>Co&ucirc;t cumul&eacute;</div>
    <div className={classnames(styles['line-total-cost-cumul'])}>
      Co&ucirc;t cumul&eacute; total
      <sub>(notaire et frais intercalaires inclus)</sub>
    </div>
  </div>
);

export default MensualityTableHeader;
