import { useState } from "react";
import './projects.css'

export default function Projects() {
    const [openProject, setOpenProject] = useState(null);
    const [openTools, setOpenTools] = useState(false);

    const projects = [
        {
            id: 1,
            title: "Grand Forge Games",
            type: "Website",
            organization: "Grand Forge Games",
            descriptor: "Company Website",
            team: "solo",
            teamSize: 1,
            status: "ongoing",
            madeWith: [
                "React",
                "TypeScript",
                "GitHub",
                "Inkscape (Logo Design)"
            ],
            description: [
                "The official company website for Grand Forge Games, an independent game studio based in Yorktown, Virginia. It showcases the Grand Forge Games brand, team members, and projects. Users can see content for upcoming games, including slideshows of in-game screenshots, concept art, and other assets. Users can also download playtests and give feedback.",
                "The visual design is cohesive and responsive, ensuring usability across devices.",
            ],
            links: [
                {text: "View Site", url: "https://grandforgegames.com"},
                {text: "GitHub Repo", url: "https://github.com/bdutt001/grandforgegames.git"},
            ]
        },
        {
            id: 2,
            title: "Benjamin Dutton Photography",
            type: "Website",
            organization: null,
            descriptor: "Photography Portfolio",
            team: "solo",
            teamSize: 1,
            status: "ongoing",
            madeWith: [
                "React",
                "TypeScript",
                "GitHub",
                "Inkscape (Logo Design)"
            ],
            description: [
                "My photography portfolio featuring a masonry layout gallery and slideshow components.",
            ],
            links: [
                {text: "View Site", url: "https://bdutt001.github.io/photography/"},
                {text: "GitHub Repo", url: "https://github.com/bdutt001/photography"},
            ]
        },
        {
            id: 3,
            title: "MingleMap",
            type: "Mobile Application",
            organization: "Old Dominion University",
            descriptor: "CS410/411 Capstone Project",
            team: "team",
            teamSize: 8,
            status: "completed",
            madeWith: [
                "React",
                "TypeScript",
                "Expo",
                "Node.js",
                "Express",
                "PostgreSQL",
                "Prisma",
                "GitHub"
            ],
            description: [
                "MingleMap is a mobile application that helps people form real-life social connections in nearby public spaces by matching users based on proximity and shared interests.",
                "Users only see others who are nearby, reducing endless scrolling and encouraging in-person interaction. Each user can set their visibility and select up to 10 interests from a predefined list to guide conversations. Profiles are ranked based on shared interests, prioritizing more relevant matches. Conversations are temporary and automatically disappear once users leave a shared location, reinforcing real-world engagement.",
                "Users can browse nearby locations, view how many people are present, and see venue details such as category, rating, events, and exclusive offers for MingleMap users. Safety features include user reporting, moderation review, and account bans for inappropriate behavior."
            ],
            links: [
                {text: "Demo", url: "https://github.com/bdutt001/f25-Iron.git"},
                {text: "GitHub Repo", url: "https://github.com/bdutt001/f25-Iron.git"},
                {text: "Documentation", url: "https://drive.google.com/drive/folders/1TahLLeh38Z2o95-4c3TNyfYTKyVLz-Dm?usp=sharing"},
            ]
        },
        {
            id: 4,
            title: "Employee Monitoring Software",
            type: "Web Application",
            organization: "Old Dominion University",
            descriptor: "COMM305 Literature Review Presentation",
            team: "solo",
            teamSize: 1,
            status: "completed",
            madeWith: [
                "React",
                "TypeScript",
                "Node.js",
                "Express",
                "Render",
                "PostrgreSQL",
                "Clever Cloud",
                "GitHub"
            ],
            description: [
                "A full-stack web application that presents a literature review on employee monitoring software.",
                "The site tracks actions (mouse movements and clicks) and idle time within your session. These metrics are recorded in the database in order to calculate and display global counts."
            ],
            links: [
                {text: "View Site", url: "https://bdutt001.github.io/ems-presentation/"},
                {text: "GitHub Repo", url: "https://github.com/bdutt001/ems-presentation.git"}
            ]
        },
        {
            id: 5,
            title: "Course Advising Portal",
            type: "Web Application",
            organization: "Old Dominion University",
            descriptor: "CS418 Semester Project",
            team: "solo",
            teamSize: 1,
            status: "completed",
            madeWith: [
                "React",
                "JavaScript",
                "Firebase",
                "Node.js",
                "Express",
                "Render",
                "MySQL",
                "Clever Cloud",
                "GitHub"
            ],
            description: [
                "A full-stack web application that allows students to create, submit, and manage semester course plans, with advisor approval workflows.",
                "Features include email verification on signup, two-factor authentication on login, password encryption, password reset, conditional submission based on course selection rules, and conditional editing based on approval status."
            ],
            links: [
                {text: "View Site", url: "https://course-advising-a2b6e.web.app/login"},
                {text: "GitHub Repo", url: "https://github.com/bdutt001/cs418518-s26.git"},
            ]
        },        
    ];

    const [filters, setFilters] = useState({
        organization: "all",
        team: "all",
        status: "all"
    });

    const filteredProjects = projects.filter(project => {
    return (
            (filters.organization === "all" || project.organization === filters.organization) &&
            (filters.team === "all" || project.team === filters.team) &&
            (filters.status === "all" || project.status === filters.status)
        );
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (a.id === openProject) return -1;
        if (b.id === openProject) return 1;
        return 0;
    });

    return (
        <div>
            <div className="projects">
                <div className="row">
                    <h1>Projects</h1>
                </div>

                <div className="projects__list">
                    {sortedProjects.map((project) => (
                        <div
                            className={`project ${openProject === project.id ? "open" : ""}`}
                            key={project.id}
                            onClick={() =>
                                setOpenProject(
                                    openProject === project.id ? null : project.id
                                )
                            }
                        >
                            <h2 className='arrow-center'>{openProject === project.id ? "⌄" : "⌃"}</h2>
                            <div className="project__header">
                                
                                <div className="col">
                                    <h2 className="project__title">{project.title}</h2>
                                    <div className={`${openProject === project.id ? "row--nowrap" : "col"}`}>
                                        {project.organization && (<h3>{project.organization}</h3>)}
                                        <p>{project.descriptor}</p>
                                    </div>
                                </div>
                                <div className={`tags ${openProject === project.id ? "open" : ""}`}>
                                    <p className="row--nowrap tag">{project.type}</p>
                                    <p className="row--nowrap tag">
                                        {project.team === "solo" ? "Solo" : `Team (${project.teamSize})`}
                                    </p>
                                    <p className={`row--nowrap tag ${project.status === "ongoing" ? "ongoing" : ""}`}>
                                        {project.status === "ongoing" ? "Ongoing" : "Completed"}
                                    </p>
                                </div>
                            </div>
                            
                            <div    
                                className={`expandable-wrapper__projects ${
                                    openProject === project.id ? "open" : ""
                                }`}
                            >
                                <div className="expandable-content__projects">
                                    <div className="project__description">
                                        {project.description.map((text, i) => (
                                            <p key={i}>{text}</p>
                                        ))}
                                    </div>
                                    {project.links && project.links.length > 0 && (
                                        <div className="row">
                                            {project.links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="icon-button"
                                                >
                                                    {link.text}
                                                </a>
                                            ))}
                                        </div>
                                    )} 
                                    <div className="col list">
                                        <h4 
                                            className="tools__toggle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenTools(prev => !prev);
                                            }}
                                        >
                                            Technologies {openTools ? "⌃" : "⌄"}
                                        </h4>
                                        <div    
                                            className={`expandable-wrapper__tools ${
                                                openTools ? "open" : ""
                                            }`}
                                        >
                                            <div className="expandable-content__tools">
                                                <ul className="made-with">
                                                    {project.madeWith.map((tech, index) => (
                                                        <li key={index}>{tech}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}