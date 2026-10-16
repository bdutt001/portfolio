import './home.css'

import { Link } from 'react-router-dom';

import Terminal from "../components/Terminal";

import Photo from "../assets/Ben_D.png";

import EmailIcon from "../assets/email.svg"
import EmailIconHover from "../assets/email-hover.svg"
import LinkedinIcon from "../assets/linkedin.svg";
import LinkedinIconHover from "../assets/linkedin-hover.svg";
import GithubIcon from "../assets/github.svg";
import GithubIconHover from "../assets/github-hover.svg";


export default function Home()  {
    return ( 
        <div className="landing">
            <div className="home">
                <div className="home left">
                    <Terminal></Terminal>
                </div>
                <div className="home right">
                    <div className="profile">
                        <div className="profile__content">
                            <img src={Photo} className="profile__photo"/>
                            <div className="profile__name">
                                <h2>Benjamin Dutton</h2>
                                <div className="job-row">
                                    <Link 
                                        to="/about#job--wr" 
                                        // className='job__role'
                                    >
                                        Software Engineer
                                    </Link>
                                    <p>at</p>
                                    <a href="https://wrsystems.com/">
                                        WR Systems
                                    </a>
                                </div>
                                <div className="job-row">
                                    <Link 
                                        to="/about#job--gfg" 
                                        // className='job__role'
                                    > 
                                            Web Developer
                                    </Link>
                                    <p>at</p>
                                    <a href="https://grandforgegames.com/">
                                        Grand Forge Games
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="row-center">
                            <a
                                href="mailto:bendutton9@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-button email"
                            >
                                <div className="icon-wrapper">
                                    <img src={EmailIcon} className="icon base"/>
                                    <img src={EmailIconHover} className="icon hover"/>
                                </div>
                                <span>Email</span>
                            </a>
                            <a
                                href="https://linkedin.com/in/benjamin-dutton-odu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-button linkedin"
                            >
                                <div className="icon-wrapper">
                                    <img src={LinkedinIcon} className="icon base"/>
                                    <img src={LinkedinIconHover} className="icon hover"/>
                                </div>
                                <span>LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com/bdutt001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-button github"
                            >
                                <div className="icon-wrapper">
                                    <img src={GithubIcon} className="icon base"/>
                                    <img src={GithubIconHover} className="icon hover"/>
                                </div>
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            
            </div>
              
        </div>
          );
}