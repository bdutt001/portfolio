import './about.css'
import { useState, useEffect } from "react";

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
        <div className="about">
            <div className="about-grid">
                <div className="about-col">
                    <h1>Education</h1>
                    <div className="education">
                        <div 
                            id="school--odu"
                            className="ed-item"
                            onClick={() =>
                                setOpenSchool(openSchool === "odu" ? null : "odu")
                            }
                        >
                            <div className="row-apart --column-mobile">
                                <h2>B.S. in Computer Science</h2>
                                <p className="date">May 2026</p>
                            </div>
                            <div className="row-apart --column-mobile">
                                <h3>Old Dominion University</h3>
                                <p>Norfolk, Virginia</p>
                            </div>
                            <div className='row-apart --column-mobile'>
                                <p>Studied coding fundamentals</p>
                                <a
                                    href="/portfolio/odu-diploma.pdf"
                                    target="_blank"
                                    rel="noopener"
                                    onClick={(e) => e.stopPropagation()}
                                    className='about-link'
                                >
                                    View Diploma ↗
                                </a>
                            </div>
                            <div    
                                className={`expandable-wrapper__job ${
                                    openSchool === "odu" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__job'>
                                    <h3 style={{color: "#9ca3af"}}>GPA</h3> 
                                    <p>3.11</p>
                                    <p>3.73 (in-major)</p>
                                </div>
                            </div>
                            <h2 className='arrow-center'>{openSchool === "odu" ? "⌃" : "⌄"}</h2>
                        </div>
                         <div
                            id="school--wbhs"
                            className="ed-item"
                            onClick={() =>
                                setOpenSchool(openSchool === "wbhs" ? null : "wbhs")
                            }
                        >
                            <div className="row-apart --column-mobile">
                                <h2>Advanced Diploma</h2>
                                <p className="date">May 2019</p>
                            </div>
                            <div className="row-apart --column-mobile">
                                <h3>Western Branch High School</h3>
                                <p>Chesapeake, Virginia</p>
                            </div>
                            <div    
                                className={`expandable-wrapper__job ${
                                    openSchool === "wbhs" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__job'>
                                    <h3 style={{color: "#9ca3af"}}>GPA</h3> 
                                    <p>4.67</p>
                                </div>
                            </div>
                            <h2 className='arrow-center'>{openSchool === "wbhs" ? "⌃" : "⌄"}</h2>
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
                                <p>Norfolk, Virginia</p>
                            </div>
                            <p>Contributing to mission-critical software</p>
                            <div    
                                className={`expandable-wrapper__job ${
                                    openJob === "wr" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__job'>
                                    <h3 style={{color: "#9ca3af"}}>Responsibilities</h3>
                                    <ul>
                                        <li>
                                            Develop and maintain software within an established production codebase
                                        </li>
                                        <li>
                                            Implement and test software features based on project requirements
                                        </li>
                                        <li>
                                            Troubleshoot software issues and identify the root cause of defects
                                        </li>
                                        <li>
                                            Collaborate with engineers through code reviews, debugging, and development workflows
                                        </li>
                                        <li>
                                            Follow established software development, testing, and documentation practices
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
                                <p>Sole developer of the company website</p>
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
                                    <h3 style={{color: "#9ca3af"}}>Responsibilities</h3>
                                    <ul>
                                        <li>
                                            Create an intutive and cohesive visual design that reflects the brand
                                        </li>
                                        <li>
                                            Implement interactive UI elements including animation, hero banners, and dynamic content sections
                                        </li>
                                        <li>
                                            Build scalable React components for team members and projects
                                        </li>
                                        <li>
                                            Ensure website responsiveness across various devices and browsers using modern CSS and media queries
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
                            <p>Over 9 years of experience</p>
                            <div 
                                className={`expandable-wrapper__skill ${
                                    openSkill === "languages" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__skill'>
                                    <div className='skill-sub-item'>
                                        <div className='row-apart'>
                                            <h3 style={{color: "#9ca3af"}}>Programming</h3>
                                            <h3 style={{color: "#9ca3af"}}>Years Experience</h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Java</p>
                                                    <p>9</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>C++</p>
                                                    <p>9</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>C</p>
                                                    <p>2</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                        
                                    <div className='skill-sub-item'>
                                        <h3 style={{color: "#9ca3af"}}>Scripting</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Python</p>
                                                    <p>3</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Bash</p>
                                                    <p>2</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>JavaScript</p>
                                                    <p>2</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>TypeScript</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Lua</p>
                                                    <p>{"<"}1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <h2 className='arrow-center'>{openSkill === "languages" ? "⌃" : "⌄"}</h2>
                        </div>
                        
                        <div
                            id="skill--tools" 
                            className={`skill-item ${openSkill === "tools" ? "open" : ""}`}
                            onClick={() =>
                                setOpenSkill(openSkill === "tools" ? null : "tools")
                            }
                        >
                            <h2>Developer Tools</h2>
                            <p>4 years of experience</p>
                            <div 
                                className={`expandable-wrapper__skill ${
                                    openSkill === "tools" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__skill'>
                                    <div className="skill-sub-item">
                                        <div className='row-apart'>
                                            <h3 style={{color: "#9ca3af"}}>Version Control</h3>
                                            <h3 style={{color: "#9ca3af"}}>Years Experience</h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>GitHub</p>
                                                    <p>6</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Git</p>
                                                    <p>4</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Containerization</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Docker</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Hosting</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>GitHub Pages</p>
                                                    <p>3</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Firebase</p>
                                                    <p>{"< "}1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Render</p>
                                                    <p>{"< "}1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Clever Cloud</p>
                                                    <p>{"< "}1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <h2 className='arrow-center'>{openSkill === "tools" ? "⌃" : "⌄"}</h2>
                        </div>
                        <div 
                            id="skill--web"
                            className={`skill-item ${openSkill === "web" ? "open" : ""}`}
                            onClick={() =>
                                setOpenSkill(openSkill === "web" ? null : "web")
                            }
                        >
                            <h2>Web & Mobile Development</h2>
                            <p>3 years of experience</p>
                            <div 
                                className={`expandable-wrapper__skill ${
                                    openSkill === "web" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__skill'>
                                    <div className="skill-sub-item">
                                        <div className='row-apart'>
                                            <h3 style={{color: "#9ca3af"}}>Frontend</h3>
                                            <h3 style={{color: "#9ca3af"}}>Years Experience</h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>HTML</p>
                                                    <p>3</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>CSS</p>
                                                    <p>3</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>React</p>
                                                    <p>2</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Backend</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Node.js</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Express</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Rest APIs</p>
                                                    <p>{"< "}1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Mobile</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>React Native</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Expo</p>
                                                    <p>1</p>
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
                            <p>2 years of experience</p>
                            <div 
                                className={`expandable-wrapper__skill ${
                                    openSkill === "management" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__skill'>
                                    <div className="skill-sub-item">
                                        <div className='row-apart'>
                                            <h3 style={{color: "#9ca3af"}}>Methodologies</h3>
                                            <h3 style={{color: "#9ca3af"}}>Years Experience</h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Agile (Scrum)</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Sprint planning</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Task Management</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>GitHub Issues</p>
                                                    <p>2</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Trello</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>Documentation</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Markdown</p>
                                                    <p>2</p>
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
                            <p>1 year of experience</p>
                            <div 
                                className={`expandable-wrapper__skill ${
                                    openSkill === "databases" ? "open" : ""
                                }`}
                            >
                                <div className='expandable-content__skill'>
                                    <div className="skill-sub-item">
                                        <div className='row-apart'>
                                            <h3 style={{color: "#9ca3af"}}>Databases</h3>
                                            <h3 style={{color: "#9ca3af"}}>Years Experience</h3>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>PostgreSQL</p>
                                                    <p>1</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row-apart">
                                                    <p>MySQL</p>
                                                    <p>{"< "}1</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="skill-sub-item">
                                        <h3 style={{color: "#9ca3af"}}>ORM</h3>
                                        <ul>
                                            <li>
                                                <div className="row-apart">
                                                    <p>Prisma</p>
                                                    <p>1</p>
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
    );
}