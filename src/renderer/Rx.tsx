import { useState, useEffect } from 'react';
import { XBOF_sym, BOF_sym, EOF_sym, CE_sym } from "../main/j2799"

let Rx = () => {
  const [idData, setIdData] = useState('');
  const [vnData, setVnData] = useState('');
  const [tvData, setTvData] = useState('');
  const [rtData, setRtData] = useState('');
  const [fcData, setFcData] = useState('');
  const [mpData, setMpData] = useState('');
  const [mtData, setMtData] = useState('');
  const [odData, setOdData] = useState('');


  useEffect(()=>{ // add event listenr port list update by main.ts(emits list periodically)
    window.electron.ipcRenderer.on('received', (buffer:Uint8Array) => {
      //validation for J2699 frame
      //if( buffer[0] != XBOF_sym || buffer[1] != XBOF_sym || buffer[2] != XBOF_sym || buffer[3] != XBOF_sym || buffer[4] != XBOF_sym || buffer[5] != BOF_sym ){
        //invalid frame
        //console.log('Wrong header (5 XBOF + BOF)')
        //return
      //}

    })
  }, [])

  return <div>
  <div className="row">
  <div className = "col" >
  <div id="Rx">

        <table className="table table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>VN</th>
            <th>TV</th>
            <th>RT</th>
            <th>FC</th>
            <th>MP</th>
            <th>MT</th>
            <th>OD</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td><input type="text" /> </td>
            <td> Received </td>
          </tr>
        </tbody>
      </table>

  </div> </div>  </div>
  </div>
}

export default Rx
