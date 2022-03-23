import { useState, useEffect } from 'react';

import {XBOF_sym, BOF_sym, EOF_sym, CE_sym, isValidJ2799Frame, validateFrame} from '../common/j2799'


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

      let {isAllValid, j2699data} = validateFrame(buffer)
      if(isAllValid){
        if(j2699data.id) setIdData(j2699data.id)
        if(j2699data.vn) setVnData(j2699data.vn)
        if(j2699data.tv) setTvData(j2699data.tv)
        if(j2699data.rt) setRtData(j2699data.rt)
        if(j2699data.fc) setFcData(j2699data.fc)
        if(j2699data.mp) setMpData(j2699data.mp)
        if(j2699data.mt) setMtData(j2699data.mt)
        if(j2699data.od) setOdData(j2699data.od)
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
            <td><input type="text" value = {idData} readOnly/> </td>
            <td><input type="text" value = {vnData} readOnly/> </td>
            <td><input type="text" value = {tvData} readOnly/> </td>
            <td><input type="text" value = {rtData} readOnly/> </td>
            <td><input type="text" value = {fcData} readOnly/> </td>
            <td><input type="text" value = {mpData} readOnly/> </td>
            <td><input type="text" value = {mtData} readOnly/> </td>
            <td><input type="text" value = {odData} readOnly/> </td>
            <td ><div style={{width : "100px"}}> Received </div> </td>
          </tr>
        </tbody>
      </table>

  </div> </div>  </div>
  </div>
}

export default Rx
