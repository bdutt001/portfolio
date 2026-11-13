import Nav from "./Nav";

import './header.css';

import Icon from "../assets/favicon.svg";

export default function Header() {
  return (
    <header className="header">
        <div className="header__title">
          <img src={Icon} className='header__icon'></img>
          <div className="header__column">
            <h1>Benjamin Dutton</h1>
            <p>Software Engineer & Web Developer</p>
          </div>
        </div>
        <Nav />
    </header>
  );
}