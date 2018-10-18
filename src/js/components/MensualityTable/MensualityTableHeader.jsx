import React from 'react';
import classnames from 'classnames';

import styles from './MensualityTable.scss';

const MensualityTableHeader = () => (
  <div className={classnames(styles.line, styles['line-header'])}>
    <div className={classnames(styles['line-month'])}>Mensualité n°</div>
    <div className={classnames(styles['line-cost-capital'])}>Capital remboursé</div>
    <div className={classnames(styles['line-cost-interest'])}>Coût intérêt</div>
    <div className={classnames(styles['line-cost-insurance'])}>Coût assurance</div>
    <div className={classnames(styles['line-cost-cumul'])}>Coût cumulé</div>
    <div className={classnames(styles['line-total-cost-cumul'])}>
      Coût cumulé total
      <sub>(notaire et frais intercalaires inclus)</sub>
    </div>
  </div>
);

export default MensualityTableHeader;
