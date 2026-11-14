# Bug Fixes
The following list includes bugs to be addressed.
### Responsiveness:
- [x] Fix header layout breakpoints.
- [x] Fix logo sizing (clamp delta should be smaller).
- [x] Fix home page layout breakpoint (grid should change to 1 column).
- [x] Fix home page logo animation sizing and position on mobile (should be centered with no overflow).
- [ ] Fix keystroke legend (text wrapping causes misalignment) 
### Layout:
- [x] Fix project card title row spacing (should take up full with of the container).
- [x] Fix footer row spacing (should take up full width of the container).
- [x] Fix header text alignment (title and subtitle container should be centered vertically).
- [x] Fix scrolling behavior on about page.
### Terminal:
- [x] Eliminate screen scroll after boot sequence.
<br></br>

# Objectives
The following list of objectives includes additional content, features, styling and codebase management.
## Content
Objectives for additional or updated page content.
### Landing Page
- [x] Add a short bio section to the home page.
### About Page:
- [x] Update job responsibilities for WR and Grand Forge Games.
- [x] Update skills.
## Styling
Objectives for the styling of page elements and animations.
### Animations:
- [x] Re-style background animation.
- [x] Create ASCII logo animation.
- [ ] Add smooth page transitions (ViewTransition).
### UI Elements:
- [x] Visually distinguish between inlinks and outlinks.
- [x] Add smooth glow to cards on hover.
### Content:
- [x] Give unique text colors to directories in the terminal.
## Features
### Terminal
#### Bash Commands:
- [x] pwd
- [x] cd
- [x] ls
- [x] help
- [x] clear
- [x] cat
- [ ] grep
#### Scripting:
- [ ] | (piping)
- [ ] ; (chaining)
#### Keystrokes:
- [x] Clear command history (Ctrl + L)
- [x] Autofill previous/next command (Up/Down Arrows)
- [x] Autcomplete (Tab)
- [ ] Page Up/Page Down
### Interactivity
#### Sounds
- [ ] Choose and add a sound that plays upon clicking the logo.
- [ ] Choose and add a terminal boot sound.
## Codebase
### Refactoring:
- [ ] Extract large functions and constants to hooks and data files.