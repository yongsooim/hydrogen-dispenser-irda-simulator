import { useState } from 'react';

let Tx = () => {
  const [idData, setIdData] = useState('');
  const [vnData, setVnData] = useState('');
  const [tvData, setTvData] = useState('');
  const [rtData, setRtData] = useState('');
  const [fcData, setFcData] = useState('');
  const [mpData, setMpData] = useState('');
  const [mtData, setMtData] = useState('');
  const [odData, setOdData] = useState('');

  let send = () => {

    let frameObj = {id : idData,
      vn : vnData,
      tv : tvData,
      rt : rtData,
      fc : fcData,
      mp : mpData,
      mt : mtData,
      od : odData,}

      console.log(frameObj)
    window.electron.ipcRenderer.send('txReqByObj', frameObj)
  }

  return <div>
  <div className="row">
  <div className = "col" >
  <div id="Tx">

        <table className="table table-sm">
        <tbody>
          <tr>
            <td><input name = "ID" type="text" value = {idData} onChange={e => setIdData(e.target.value)} /> </td>
            <td><input name = "VN" type="text" value = {vnData} onChange={e => setVnData(e.target.value)} /> </td>
            <td><input name = "TV" type="text" value = {tvData} onChange={e => setTvData(e.target.value)} /> </td>
            <td><input name = "RT" type="text" value = {rtData} onChange={e => setRtData(e.target.value)} /> </td>
            <td><input name = "FC" type="text" value = {fcData} onChange={e => setFcData(e.target.value)} /> </td>
            <td><input name = "MP" type="text" value = {mpData} onChange={e => setMpData(e.target.value)} /> </td>
            <td><input name = "MT" type="text" value = {mtData} onChange={e => setMtData(e.target.value)} /> </td>
            <td><input name = "OD" type="text" value = {odData} onChange={e => setOdData(e.target.value)} /> </td>
            <td><input type="button" value="Send" onClick={()=>{send()}}/> </td>
          </tr>
        </tbody>
      </table>

  </div> </div>  </div>
  </div>
}

export default Tx
