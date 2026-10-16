import './terminal.css';

import { useEffect, useRef, useState } from "react"
import TypingText from "./TypingText"

const filesystem = {
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

function Terminal() {
    const [input, setInput] = useState("")
    const terminalRef = useRef(null)
    const [currentPath, setCurrentPath] = useState([])

    const [lines, setCommandHistory] = useState([
        {
            id: "boot-command",
            type: "command",
            text: "hello",
            path: [],
            animate: true,
        }
    ])

    const getCurrentDirectory = () => {
        let directory = filesystem

        for (const folder of currentPath) {
            directory = directory.children[folder]
        }

        return directory
    }

    const [historyIndex, setHistoryIndex] = useState(-1)

    function handleKeystrokes(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            handleCommand(input)
        }

        if (e.key === "ArrowUp") {
            e.preventDefault()

            const commands = lines.filter(line => line.type === "command")

            if (commands.length === 0) return

            const newIndex = historyIndex === -1
                ? commands.length - 1
                : Math.max(0, historyIndex - 1)

            setHistoryIndex(newIndex)
            setInput(commands[newIndex].text)
        }

        if (e.key === "ArrowDown") {
            e.preventDefault()

            if (historyIndex === -1) return

            const commands = lines.filter(line => line.type === "command")
            const newIndex = historyIndex + 1

            if (newIndex >= commands.length) {
                setHistoryIndex(-1)
                setInput("")
            } else {
                setHistoryIndex(newIndex)
                setInput(commands[newIndex].text)
            }
        }
    }

    const [bootComplete, setBootComplete] = useState(false)

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [lines])


    useEffect(() => {  
        const welcomeTimer = setTimeout(() => {
            setCommandHistory(prev => [
                ...prev,
                {
                    id: "welcome-message",
                    type: "welcome",
                }
            ])

            setBootComplete(true)
        }, 2000)        

        return () => {
            clearTimeout(welcomeTimer)
        }

    }, [])

    const getPromptPath = (path) => {
        if (!path || path.length === 0) {
            return "~"
        }

        return path[path.length - 1]
    }


    const handleCommand = (command) => {
       const trimmed = command.trim()

        if (!trimmed) return

        const [commandName, ...args] = trimmed.split(/\s+/)
        const argument = args.join(" ")

        const commandHistory = [
            {
                id: crypto.randomUUID(),
                type: "command",
                text: trimmed,
                path: [...currentPath],
                animate: false,
            }
        ]

        switch (commandName.toLowerCase()) {
            case "help":
            case "man":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "help",
                })
                break

            case "about":
            case "whoami":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "about",
                })
                break

            case "cd": {
                const target = argument

                if (!target || target === "~") {
                    setCurrentPath([])
                    break
                }

                if (target === "..") {
                    setCurrentPath(prev => prev.slice(0, -1))
                    break
                }

                const directory = getCurrentDirectory()
                const targetDirectory = directory.children[target]

                if (!targetDirectory) {
                    commandHistory.push({
                        id: crypto.randomUUID(),
                        type: "text",
                        text: `cd: ${target}: No such file or directory`
                    })
                    break
                }

                if (targetDirectory.type !== "directory") {
                    commandHistory.push({
                        id: crypto.randomUUID(),
                        type: "text",
                        text: `cd: ${target}: Not a directory`
                    })
                    break
                }

                setCurrentPath(prev => [...prev, target])
                break
            }


            case "contact":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "contact"
                })
                break

            case "hello":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "welcome"
                })
                break
                
            case "ls": {
                const directory = getCurrentDirectory()

                const contents = Object.entries(directory.children)
                    .map(([name, item]) => (
                        item.type === "directory" ? `${name}/` : name
                    ))
                    .join("  ")

                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "text",
                    text: contents,
                })

                break
            }

            case "pwd":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "text",
                    text: "/home/ben",
                })
                break

            case "fastfetch":
            case "neofetch":
            case "stack":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "fastfetch",
                })
                break
            

            case "clear":
                setCommandHistory([])
                setInput("")
                return

            default:
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "text",
                    text: `command not found: ${trimmed}`
                })
        }

        setCommandHistory(prev => [...prev, ...commandHistory])

        setInput("")
    }

    return (
        <div className="terminal" ref={terminalRef}>

            {lines.map((line) => {
                if (line.type === "command") {
                    return (
                        <div
                            key={line.id}
                            className="trow nowrap"
                        >
                            <p className="white">
                                [ben@studio {getPromptPath(line.path || [])}]$
                            </p>

                            {line.animate ? (
                                <TypingText text={line.text} />
                            ) : (
                                <p>{line.text}</p>
                            )}
                        </div>
                    )
                }
                if (line.type === "welcome") {
                    return (
                        <div
                            key={line.id}
                            className="terminal-welcome"
                        >
                            <pre className="ascii-2 gradient">
{`                          ████                                            
                         ░░███                                            
 █████ ███ █████  ██████  ░███   ██████   ██████  █████████████    ██████ 
░░███ ░███░░███  ███░░███ ░███  ███░░███ ███░░███░░███░░███░░███  ███░░███
 ░███ ░███ ░███ ░███████  ░███ ░███ ░░░ ░███ ░███ ░███ ░███ ░███ ░███████ 
 ░░███████████  ░███░░░   ░███ ░███  ███░███ ░███ ░███ ░███ ░███ ░███░░░  
  ░░████░████   ░░██████  █████░░██████ ░░██████  █████░███ █████░░██████ 
   ░░░░ ░░░░     ░░░░░░  ░░░░░  ░░░░░░   ░░░░░░  ░░░░░ ░░░ ░░░░░  ░░░░░░  `}
                            </pre>
                            <p className="center white">
                                Welcome to my portfolio.
                            </p>
                            

                            <p>
                                Enter <span className="accent">help</span> to view commands.
                            </p>
                        </div>
                    )
                }


                if (line.type === "contact") {
                    return (
                        <div key={line.id} className='output'>
                            <div className="help">
                                <div>
                                    <p>Email:</p>
                                    <p>Phone:</p>
                                </div>
                                <div>
                                    <p>bendutton9@gmail.com</p>
                                    <p>(757) 567-4771</p>
                                </div>
                            </div>
                        </div>
                    )
                }

                if (line.type === "help") {
                    return (
                        <div key={line.id} className='output'>
                            
                            <p>Available commands: </p>
                            <div className="help">
                                <div>
                                    <p className='accent'>about</p>
                                    <p className='accent'>cd</p>
                                    <p className="accent">clear</p>
                                    <p className="accent">contact</p>
                                    <p className='accent'>ls</p>
                                    <p className='accent'>pwd</p>
                                    <p className="accent">stack</p>
                                    <p className="accent">help</p>
                                </div>
                                <div>
                                    <p>print summary</p>
                                    <p>change working directory</p>
                                    <p>clear terminal history</p>
                                    <p>print contact information</p>
                                    <p>list directory contents</p>
                                    <p>print working directory</p>
                                    <p>print technology stack</p>
                                    <p>print available commands</p>
                                </div>
                            
                            </div>
                        </div>
                    )
                }

                if (line.type === "about") {
                    return (
                        <div key={line.id} className="output">
                            <p>About me:</p>

                            <p className="white">
                                I'm a programmer interested in building everything, from
                                web applications to embedded systems.
                            </p>
                            <p>
                                I enjoy working with React, C++
                                and Linux.
                            </p>
                        </div>
                    )
                }

                if (line.type === "fastfetch") {
                    return (
                        <div key={line.id} className='output'>
                            <div>
                            <div className="row">
                                <pre className="ascii">
                                    <span className="white">{`
                                                         .###+.
                                                       +##+   o+ 
                                                     o###       +
                                                     ###
                                                     `}</span>
                                                 {` `}<span className="white">{`'#`}</span>{`    ooooo.
                                                 `}
                                                 <span className="white">{`+###+`}</span> {`   ooo.  .oo
                                                `}
                                                <span className="white">{`#######`}</span>{`  ooo      ooo   `}<span className="white">{`
                                               ######### `}</span>{`.o'      'oooo. `}
                                              <span className="white">{`
                                              .#########.`}</span> o. <span className="white">{`####`}</span>{` .oooooo.`}
                                              <span className="white">{`
                                              o#########+`}</span>{` o. `}<span className="white">{`####`}</span>{` .oooooooo.     `}
                                              <span className="white">{`
                                              +#########+ `}</span>{`oo      oooooooooo.  `}
                                              <span className="white">{`
                                              .#########o`}</span>{` ooo   .oooooooooooo.  `}
                                              <span className="white">{`
                                               ######### `}</span>{`.oooooooooooooooooooo `}
                                               <span className="white">{`
                                                ####### `}</span>{` ooooooooooooooooooooo   `}
                                                {`
                                             `}{`.o`}<span className="white">{`  ##### `}</span>{`  ooo~~ooooooooooo'''
                                            .ooo       oooo.
                                           .ooooo.. .ooooooooo..         ...
                                          .ooooooooooooooooooooooooooooooo.
                                         .ooooooooooooooooooooooooooooooo
                                         oooooooo.  .oooooooooooooooooo
                                        ooooooo   ..   oooooooooo..
                                       .ooooo  .oooooo  ooooooooo.
                                       ooooo .ooooooooo ooooooooooo      `}<span className="white">{` oooooooooooooooooo `}  </span> {`
                                      oooo. ooooooooooo .ooooooooo.      `}<span className="white">{`+################## `}  </span> {`
                                      ooo..oooooooooooo .ooooooooo       `}<span className="white">{`##################   `}  </span> {`
                                     .ooooooooooooooooo ooooooooo       `}<span className="white">{`+##################                   `}  </span> {`
                                     ooooooooooooooooo. oooooooo.       `}<span className="white">{`##################.                          `}  </span> {`
                                     ooooooooooooooooo .o.ooo..        `}<span className="white">{`o##################                           `}  </span> {`
                                     oooooooooooooooo .oo              `}<span className="white">{`##################o                           `}  </span> {`
                                     oooooooooooooo.  oooo...oooo.    `}<span className="white">{`o##################                            `}  </span> {`
                                      ooooooooooo.    oooooooooo      `}<span className="white">{`##################o                            `}  </span> {`
                                      .oooo..          oooooo. .     `}<span className="white">{`o##################                             `}  </span> {`
                                       .oooo....                     `}<span className="white">{`##################o                             `}  </span> {`
                                         oooooooo....
                                           ..ooooo.        `}<span className="white">{`############################   `}</span>
                                </pre>
                                <div className="fetch">
                                    <div>
                                        <p className="accent">
                                            ben<span className="white">@</span>portfolio
                                        </p>
                                    </div>
                                    <div>
                                        <p className="white">----------------</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">OS:</p>
                                        <p className="white">Arch Linux</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">Editor:</p>
                                        <p className="white">Vim</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">Shell:</p>
                                        <p className="white">Bash</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">Frontend:</p>
                                        <p className="white">React, CSS</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">Backend:</p>
                                        <p className="white">Node.js, Express</p>
                                    </div>
                                    <div className="trow nowrap">
                                        <p className="accent">Database:</p>
                                        <p className="white">PostgreSQL</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>
                    )
                }

                if (line.type === "ls") {
                    return (
                        <p key={line.id} className="white">
                            about/&nbsp;&nbsp; contact.txt&nbsp;&nbsp; projects/
                        </p>
                    )
                }


                if (line.type === "text") {
                    return (
                        <p
                            key={line.id}
                            className="output white"
                        >
                            {line.text}
                        </p>
                    )
                }

                return null
            })}

            {bootComplete && (
                <div className="trow nowrap terminal-input-line">
                    <p className="white">
                        [ben@studio {getPromptPath(currentPath)}]$
                    </p>

                    <input
                        className="terminal-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            handleKeystrokes(e); 
                        }}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
            )}
        </div>
    )

    
}

export default Terminal;