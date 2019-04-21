import * as React from 'react';
import brandLogo from './assets/images/brand-logo.png';
import './Header.scss';

class Header extends React.Component {
    public render() {
        return (
            <header className={"header"}>
                <a href={"/"}><img className={"header-brand-logo"} src={brandLogo} /></a>
                <a href={"/"}><h1 className={"header-brand-name"}>Rev</h1></a>
            </header>
        );
    }
}

export default Header;