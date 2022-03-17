import './Content.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'react-bootstrap/dist/react-bootstrap.min.js';
import PortsList from './PortsList'

export const Content = () => {
  return (
    <div id = "container">

      <div className="row">
        <div className = "col">
          <div id = "titlebar">
            <h2>Hydrogen Dispenser IrDA Simulator</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className = "col">
          <div id = "navbar">
            this is navbar
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div id = "sidebar">
            <PortsList />
            <div>after ports list</div>
          </div>
        </div>
        <div className="col">
          <div id = "maincontent">
            main content text
          </div>
        </div>
      </div>

      <div className="row">
        <div className = "col">
          <div id = "footer">
            footer text
          </div>
        </div>
      </div>

    </div>
  );
};
