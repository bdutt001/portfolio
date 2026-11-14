import './home.css'

import BackgroundMagenta from '../components/BackgroundMagenta';

import Terminal from "../components/Terminal";
import AsciiLogo3D from '../components/AsciiLogo3D';

export default function Home()  {
    return ( 
        <div>
            <BackgroundMagenta></BackgroundMagenta>
            <div>    
                <div className="landing">
                    <div className="home">
                        <div className='home--top'>
                            <div className='col-center'>
                                <h1 className='hello'>Hello, world!</h1>
                                <div className="job-row">
                                    <p>
                                        I build everything from websites to embedded systems.<br/>
                                        I'm currently a&nbsp;
                                    <a
                                        to="/about#job--wr"
                                        className='inlink'
                                    >
                                        Software Engineer
                                    </a>
                                    &nbsp;at&nbsp;
                                    <a href="https://wrsystems.com/">
                                        WR Systems ↗
                                    </a>
                                    &nbsp;and a&nbsp;
                                    <a
                                        to="/about#job--gfg"
                                        className='inlink'
                                    >
                                        Web Developer
                                    </a>
                                    &nbsp;at&nbsp;
                                    <a href="https://grandforgegames.com/">
                                        Grand Forge Games ↗
                                    </a>
                                    .
                                    </p>
                                </div>
                            </div>
                            <div className='logo-wrap'>
                                <AsciiLogo3D fontSize="min(10px, 100cqi / 86)"></AsciiLogo3D>
                            </div>
                        </div>
                        <div className='col'>
                            <h1 className='h1'>Bash Terminal</h1>
                            <p>I work with Bash every day. In fact, I enjoy so much that I have created this terminal and an accompanying file system. You can use Bash commands to navigate, view, and search the contents of this portfolio.</p>
                            <div className='cli'>
                                <Terminal></Terminal>
                            </div>
                            <h2>Keystrokes</h2>
                            <div className='keystrokes'>
                                <div>
                                    <p>↑</p>
                                    <p>↓</p>
                                    <p>Tab</p>
                                    <p>Ctrl + L</p>
                                </div>
                                <div>
                                    <p>Fill previous command</p>
                                    <p>Fill next command</p>
                                    <p>Autocomplete commands, directories, or files (press twice to list all matches)</p>
                                    <p>Clear command history</p>
                                </div>
                            </div>
                        </div>                
                    </div>
                </div>
            </div>
        </div>
          );
}