import './App.css';
import PortsList from './PortsList'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

let portsString = 'temp'

export const Content = () => {
  return (
    <div>
      <h1>Hydrogen Dispenser IrDA Simulator</h1>
      <div className="contents">
        <>
          <Button variant="primary">Primary</Button>{' '}
          <Button variant="secondary">Secondary</Button>{' '}
          <Button variant="success">Success</Button>{' '}
          <Button variant="warning">Warning</Button>{' '}
          <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
          <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
          <Button variant="link">Link</Button>
        </>
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="primary">
            button1
          </Button>
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
