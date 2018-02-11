import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './Header.scss';

class Header extends Component {
    render () {
        return (
            <div styleName="header">
                <h1 styleName="title">Simulateur emprunt immobilier</h1>
            </div>
        );
    }
}

export default CSSModules(Header, styles);