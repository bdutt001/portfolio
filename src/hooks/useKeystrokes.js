export function useKeystrokes ({
    lines,
    input,
    setInput,
    historyIndex,
    setHistoryIndex,
    setCommandHistory,
    handleCommand
}) {
    const handleKeystrokes = (e) => {
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

        if (e.key === "l" && e.ctrlKey === true) {
            e.preventDefault()
            setCommandHistory([])
        }
    }

    return handleKeystrokes
}
