import './Contents.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'react-bootstrap/dist/react-bootstrap.min.js';
import MainContent from './MainContent'
import PortsList from './PortsList'
import Footer from './Footer'
import Tx from './Tx'
import Rx from './Rx'

export const Contents = () => {
  return (
    <div id = "container">

      <div className="row " >
        <div className = "col">
          <div id = "titlebar" >
            <h2>Hydrogen Dispenser IrDA Simulator</h2>
          </div>
        </div>
      </div>

      <div className="row addScroll">
        <div className="col" id = "sidebarCol">
          <div id = "sidebar">
            <PortsList />
          </div>
        </div>
        <div className="col">
          <div id = "maincontent" >
            <MainContent />
          </div>
        </div>
      </div>

      <Rx />
      <Tx />

      <div className="row">
        <div className = "col">
          <div id = "footer">
            <Footer />
          </div>
        </div>
      </div>

    </div>
  );
};
