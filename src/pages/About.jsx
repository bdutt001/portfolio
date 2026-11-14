import './about.css'
import { useState, useEffect } from "react";

import BackgroundBlue from '../components/BackgroundBlue';

export default function About()  {
    const [openJob, setOpenJob] = useState(null);
    const [openSkill, setOpenSkill] = useState(null);
    const [openSchool, setOpenSchool] = useState(null);

    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        setIsTouch(mediaQuery.matches);

        const handler = (e) => setIsTouch(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <div>
            <BackgroundBlue></BackgroundBlue>
            <div className="about">
                <div className="about-grid">
                    <div className="about-col">
                        <h1>Education</h1>
                        <div className="education">
                            <div
                                id="school--odu"
                                className="ed-item"
                            >
                                <div className="row-apart --column-mobile">
                                    <h2>B.S. in Computer Science</h2>
                                    <p className="date">May 2026</p>
                                </div>
                                <div className="row-apart --column-mobile">
                                    <h3>Old Dominion University</h3>
                                    <p>Norfolk, Virginia</p>
                                </div>
                            </div>
                             <div
                                id="school--wbhs"
                                className="ed-item"
                            >
                                <div className="row-apart --column-mobile">
                                    <h2>Advanced Diploma</h2>
                                    <p className="date">May 2019</p>
                                </div>
                                <div className="row-apart --column-mobile">
                                    <h3>Western Branch High School</h3>
                                    <p>Chesapeake, Virginia</p>
                                </div>
                            </div>
                        </div>
            
                    </div>
                    <div className="about-col">
                        <h1>Experience</h1>
                        <div className="timeline">
                            <div
                                id="job--wr"
                                className="timeline-item"
                                onClick={() =>
                                    setOpenJob(openJob === "wr" ? null : "wr")
                                }
                            >
                                <div className="row-apart --column-mobile">
                                    <h2>Software Engineer</h2>
                                    <p className="date">July 2026 - Current</p>
                                </div>
                                <div className="row-apart --column-mobile">
                                    <h3>WR Systems</h3>
                                    <p>Virginia Beach, Virginia</p>
                                </div>
                                <p>
                                    Developing navigation software for U.S. Navy systems
                                </p>
                                <div
                                    className={`expandable-wrapper__job ${
                                        openJob === "wr" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__job'>
                                        <h3>Responsibilities</h3>
                                        <ul>
                                            <li>
                                                Develop and maintain C and C++ software for naval navigation systems
                                            </li>
                                            <li>
                                                Write and run unit tests to verify software against system requirements
                                            </li>
                                            <li>
                                                Troubleshoot and resolve defects in collaboration with systems and test engineers
                                            </li>
                                            <li>
                                                Follow Agile Scrum development practices
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openJob === "wr" ? "⌃" : "⌄"}</h2>
                            </div>
                            <div
                                id="job--gfg"
                                className="timeline-item"
                                onClick={() =>
                                    setOpenJob(openJob === "gfg" ? null : "gfg")
                                }
                            >
                                <div className="row-apart --column-mobile">
                                    <h2>Web Developer</h2>
                                    <p className="date">January 2026 - Current</p>
                                </div>
                                <div className='row-apart --column-mobile'>
                                    <h3>Grand Forge Games</h3>
                                    <p>Remote</p>
                                </div>
                                <div className='row-apart --column-mobile'>
                                    <p>Developer of the company website</p>
                                    <a
                                        href="https://grandforgegames.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Site ↗
                                    </a>
                                </div>
                                <div
                                    className={`expandable-wrapper__job ${
                                        openJob === "gfg" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__job'>
                                        <h3>Responsibilities</h3>
                                        <ul>
                                            <li>
                                                Create a cohesive visual design that reflects the brand
                                            </li>
                                            <li>
                                                Update website content with new game assets and company personnel
                                            </li>
                                            <li>
                                                Ensure website responsiveness across various devices and browsers
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openJob === "gfg" ? "⌃" : "⌄"}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="about-col">
                        <h1>Skills</h1>
                        <div className="skills">
                            <div
                                id="skill--languages"
                                className={`skill-item ${openSkill === "languages" ? "open" : ""}`}
                                onClick={() =>
                                    setOpenSkill(openSkill === "languages" ? null : "languages")
                                }
                            >
                                <h2>Programming Languages</h2>
                                <p>C++, C and more</p>
                                <div
                                    className={`expandable-wrapper__skill ${
                                        openSkill === "languages" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__skill'>
                                        <div className='skill-sub-item'>
                                            <div className='row-apart'>
                                                <h3>Programming</h3>
                                                <h3>Proficiency</h3>
                                            </div>
                                            <ul>
                                                
                                                <li>
                                                    <div className="row-apart">
                                                        <p>C++</p>
                                                        <p>Advanced</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>C</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Java</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
            
                                        <div className='skill-sub-item'>
                                            <h3>Scripting</h3>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Bash</p>
                                                        <p>Advanced</p>
                                                    </div>
                                                </li>
                                                 <li>
                                                    <div className="row-apart">
                                                        <p>JavaScript</p>
                                                        <p>Advanced</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>TypeScript</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Lua</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openSkill === "languages" ? "⌃" : "⌄"}</h2>
                            </div>
            
                            {/*<div
                                id="skill--tools"
                                className={`skill-item ${openSkill === "tools" ? "open" : ""}`}
                                onClick={() =>
                                    setOpenSkill(openSkill === "tools" ? null : "tools")
                                }
                            >
                                <h2>Developer Tools</h2>
                                <p>GitHub, Docker and more</p>
                                <div
                                    className={`expandable-wrapper__skill ${
                                        openSkill === "tools" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__skill'>
                                        {/* <div className="skill-sub-item">
                                            <h3>Containerization</h3>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Docker</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Podman</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div> 
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openSkill === "tools" ? "⌃" : "⌄"}</h2>
                            </div> */}
                            <div
                                id="skill--web"
                                className={`skill-item ${openSkill === "web" ? "open" : ""}`}
                                onClick={() =>
                                    setOpenSkill(openSkill === "web" ? null : "web")
                                }
                            >
                                <h2>Web & Mobile Development</h2>
                                <p>React, Node.js and more</p>
                                <div
                                    className={`expandable-wrapper__skill ${
                                        openSkill === "web" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__skill'>
                                        <div className="skill-sub-item">
                                            <div className='row-apart'>
                                                <h3>Frontend</h3>
                                                <h3>Proficiency</h3>
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>React</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>React Native</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>HTML</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>CSS</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="skill-sub-item">
                                            <h3>Backend</h3>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Node.js</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Express</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openSkill === "web" ? "⌃" : "⌄"}</h2>
                            </div>
            
                            <div
                                id="skill--management"
                                className={`skill-item ${openSkill === "management" ? "open" : ""}`}
                                onClick={() =>
                                    setOpenSkill(openSkill === "management" ? null : "management")
                                }
                            >
                                <h2>Project Management</h2>
                                <p>Git, Jira and more</p>
                                <div
                                    className={`expandable-wrapper__skill ${
                                        openSkill === "management" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__skill'>
                                        <div className="skill-sub-item"> 
                                            <div className='row-apart'>
                                                <h3>Version Control</h3>
                                                <h3>Proficiency</h3>
                                            </div>
                                            <ul>
                                                
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Git</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>GitHub</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="skill-sub-item">
                                            <h3>Methodologies</h3>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Scrum</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="skill-sub-item">
                                            <h3>Task Management</h3>
                                            <ul>
                                                <li>
                                                    <div className='row-apart'>
                                                        <p>Jira</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>GitHub Issues</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>Trello</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openSkill === "management" ? "⌃" : "⌄"}</h2>
                            </div>
                            <div
                                id="skill--databases"
                                className={`skill-item ${openSkill === "databases" ? "open" : ""}`}
                                onClick={() =>
                                    setOpenSkill(openSkill === "databases" ? null : "databases")
                                }
                            >
                                <h2>Databases</h2>
                                <p>PostgreSQL & MySQL</p>
                                <div
                                    className={`expandable-wrapper__skill ${
                                        openSkill === "databases" ? "open" : ""
                                    }`}
                                >
                                    <div className='expandable-content__skill'>
                                        <div className="skill-sub-item">
                                            <div className='row-apart'>
                                                <h3>Databases</h3>
                                                <h3>Proficiency</h3>
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>PostgreSQL</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row-apart">
                                                        <p>MySQL</p>
                                                        <p>Proficient</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <h2 className='arrow-center'>{openSkill === "databases" ? "⌃" : "⌄"}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}