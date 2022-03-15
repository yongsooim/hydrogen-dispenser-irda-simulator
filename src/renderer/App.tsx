import { MemoryRouter as Router, Routes, Route, } from 'react-router-dom';
import './App.css';
import {IpcRenderer} from 'electron' // for typing
import PortsList, {setPorts} from './PortsList'

declare global {  // workaround to access window.electron
  interface Window {
      electron:any;
  }
}


let ipcRenderer:IpcRenderer = window.electron.ipcRenderer;

let portsString = "f"

setInterval(_=>{setPorts('asf')}, 1000)

ipcRenderer.on('portsReq', (receivedPorts) => {
  //console.log(receivedPorts)
  portsString = JSON.stringify(receivedPorts)
})

const Hello = () => {
  return (
    <div>
      <h1>Hydrogen Dispenser IrDA Simulator</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            button1
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            button2
          </button>
          <PortsList name = {portsString} />

        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
