export const filesystem = {
    type: "directory",
    children: {
        about: {
            type: "directory",
            children: {
                "education.txt": {
                    type: "file",
                    content: "Your education information here."
                },
                "experience.txt": {
                    type: "file",
                    content: "Your experience information here."
                },
                skills: {
                    type: "directory",
                    children: {
                        "frontend.txt": {
                            type: "file",
                            content: "React, CSS, JavaScript"
                        },
                        "backend.txt": {
                            type: "file",
                            content: "Node.js, Express, PostgreSQL"
                        }
                    }
                }
            }
        },
    
        projects: {
            type: "directory",
            children: {
                "grandforgegames.txt": {
                    type: "file",
                    content: "Grand Forge Games project information."
                },
                "minglemap.txt": {
                    type: "file",
                    content: "MingleMap project information."
                }
            }
        }
    }
}