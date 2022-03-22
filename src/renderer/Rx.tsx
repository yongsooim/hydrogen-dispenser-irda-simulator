import { useState, useEffect } from 'react';

import {XBOF_sym, BOF_sym, EOF_sym, CE_sym, J2699Frame, isValidJ2799Frame} from '../common/j2799'


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

      let {isValid, validFrame} = isValidJ2799Frame(buffer)

      if(isValid){
        if(validFrame.data.id) setIdData(validFrame.data.id)
        if(validFrame.data.vn) setVnData(validFrame.data.vn)
        if(validFrame.data.tv) setTvData(validFrame.data.tv)
        if(validFrame.data.rt) setRtData(validFrame.data.rt)
        if(validFrame.data.fc) setFcData(validFrame.data.fc)
        if(validFrame.data.mp) setMpData(validFrame.data.mp)
        if(validFrame.data.mt) setMtData(validFrame.data.mt)
        if(validFrame.data.od) setOdData(validFrame.data.od)

      }

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
            <td><input type="text" value = {idData} readOnly={true}/> </td>
            <td><input type="text" value = {vnData} readOnly={true}/> </td>
            <td><input type="text" value = {tvData} readOnly={true}/> </td>
            <td><input type="text" value = {rtData} readOnly={true}/> </td>
            <td><input type="text" value = {fcData} readOnly={true}/> </td>
            <td><input type="text" value = {mpData} readOnly={true}/> </td>
            <td><input type="text" value = {mtData} readOnly={true}/> </td>
            <td><input type="text" value = {odData} readOnly={true}/> </td>
            <td ><div style={{width : "100px"}}> Received </div> </td>
          </tr>
        </tbody>
      </table>

  </div> </div>  </div>
  </div>
}

export default Rx
