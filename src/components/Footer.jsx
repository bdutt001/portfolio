import './footer.css';

import EmailIcon from "../assets/email.svg"
import EmailIconHover from "../assets/email-hover.svg"
import LinkedinIcon from "../assets/linkedin.svg";
import LinkedinIconHover from "../assets/linkedin-hover.svg";
import GithubIcon from "../assets/github.svg";
import GithubIconHover from "../assets/github-hover.svg";

export default function Footer() {
    return (
        <div className="footer">
            <div className='row-apart'>
                <p className='copyright'>© 2026 Benjamin Dutton. All rights reserved.</p>
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
                        <span>Email ↗</span>
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
                        <span>LinkedIn ↗</span>
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
                        <span>GitHub ↗</span>
                    </a>
                </div>
            </div>
        </div>
    );
}