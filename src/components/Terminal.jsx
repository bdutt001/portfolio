import './terminal.css';

import { useEffect, useRef, useState } from "react"
import TypingText from "./TypingText"

import { filesystem } from '../data/fileSystem';

import { useKeystrokes } from '../hooks/useKeystrokes';

function Terminal() {
    const [input, setInput] = useState("")
    const terminalRef = useRef(null)
    const [currentPath, setCurrentPath] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [bootComplete, setBootComplete] = useState(false)
    const [lines, setCommandHistory] = useState([
        {
            id: "boot-command",
            type: "command",
            text: "hello",
            path: [],
            animate: true,
        }
    ])

    const getPromptPath = (path) => {
        if (!path || path.length === 0) {
            return "~"
        }

        return path[path.length - 1]
    }
    
    const getCurrentDirectory = () => {
        let directory = filesystem

        for (const folder of currentPath) {
            directory = directory.children[folder]
        }

        return directory
    }

    const getFileTxt = (file) => {
        return file.content
    }

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
            case "hello":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "welcome"
                })
            break

            case "help":
            case "man":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "help",
                })
            break
            
            case "contact":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "contact"
                })
            break

            case "about":
            case "whoami":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "about",
                })
            break

            case "clear":
                setCommandHistory([])
                setInput("")
            return

            case "pwd":
                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "text",
                    text: "/home/guest",
                })
            break

            case "ls": {
                const directory = getCurrentDirectory()

                const items = Object.entries(directory.children).map(([name, item]) => ({
                    name,
                    isDirectory: item.type === "directory",
                }))

                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "ls",
                    items,
                })

                break
            }

            case "cat": {
                const target = argument

                if(!target) {
                    break
                }

                const directory = getCurrentDirectory()
                const targetFile = directory.children[target]

                if (!targetFile) {
                    commandHistory.push({
                        id: crypto.randomUUID(),
                        type: "text",
                        text: `cat: ${target}: No such file`
                    })
                    break
                }

                if (targetFile.type !== "file") {
                    commandHistory.push({
                        id: crypto.randomUUID(),
                        type: "text",
                        text: `cat: ${target}: Not a file`
                    })
                    break
                }

                commandHistory.push({
                    id: crypto.randomUUID(),
                    type: "text",
                    text: getFileTxt(targetFile)
                })
                break
            }

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

    const handleKeystrokes = useKeystrokes({
        lines,
        input,
        setInput,
        historyIndex,
        setHistoryIndex,
        setCommandHistory,
        handleCommand
    });

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
                                [guest@portfolio {getPromptPath(line.path || [])}]$
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
                            
                            <p>Bash commands: </p>
                            <div className="help">
                                <div>
                                    <p className='accent'>cat</p>
                                    <p className='accent'>cd</p>
                                    <p className='accent'>clear</p>
                                    <p className='accent'>ls</p>
                                    <p className='accent'>pwd</p>
                                    <p className='accent'>help</p>
                                </div>
                                <div>
                                    <p>print file contents</p>
                                    <p>change working directory</p>
                                    <p>clear terminal history</p>
                                    <p>list directory contents</p>
                                    <p>print working directory</p>
                                    <p>print available commands</p>
                                </div>
                            </div>
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
                                            guest<span className="white">@</span>portfolio
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
                        <p key={line.id} className="output white">
                            {line.items.map((item) => (
                                <span
                                    key={item.name}
                                    className={item.isDirectory ? "accent" : "white"}
                                    style={{ marginRight: "2ch" }}
                                >
                                    {item.isDirectory ? `${item.name}/` : item.name}
                                </span>
                            ))}
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
                        [guest@portfolio {getPromptPath(currentPath)}]$
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