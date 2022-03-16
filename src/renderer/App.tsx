import { MemoryRouter as Router, Routes, Route, } from 'react-router-dom';
import './App.css';
import {Content} from './Content'

declare global {  // workaround to access window.electron
  interface Window {
      electron:any;
  }
}

let ipcRenderer = window.electron.ipcRenderer;

ipcRenderer.on('updatePortsInfo', (args:any[]) => {
  //receive port info list
  let ports:any[] = args[0]
  console.log(ports)
})

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Content />} />
      </Routes>
    </Router>
  );
}
