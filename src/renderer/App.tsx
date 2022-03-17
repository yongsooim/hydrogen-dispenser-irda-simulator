import { MemoryRouter as Router, Routes, Route, } from 'react-router-dom';
import {Content} from './Content'

declare global {  // workaround to access window.electron
  interface Window {
      electron:any;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Content />} />
      </Routes>
    </Router>
  );
}
