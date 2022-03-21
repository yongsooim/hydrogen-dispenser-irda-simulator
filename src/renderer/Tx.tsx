import { useState, useEffect } from 'react';

let Tx = () => {
  const [idData, setIdData] = useState('SAE J2799');
  const [vnData, setVnData] = useState('01.00');
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

    window.electron.ipcRenderer.send('txReqByObj', frameObj)
  }

  useEffect(()=>{

  },[])

  return <div>
  <div className="row">
  <div className = "col" >
  <div id="Tx">

        <table className="table table-sm">
        <tbody>
          <tr>
            <td><input name = "ID" type="text" value = {idData} onChange={e => setIdData(e.target.value)} /> </td>
            <td>
              <select name = "VN" className="form-select-sm" onChange={e => setVnData(e.target.value)} >
                <option value="01.00">01.00</option>
                <option value="01.10">01.10</option>
              </select>
            </td>
            <td><input name = "TV" type="text" value = {tvData} onChange={e => setTvData(e.target.value)} placeholder="####.#" /> </td>
            <td>
              <select name = "RT" className="form-select-sm" onChange={e => setRtData(e.target.value)} >
                <option value="H25">H25</option>
                <option value="H35">H35</option>
                <option value="H50">H50</option>
                <option value="H70">H70</option>
              </select>
            </td>
            <td>
              <select name = "FC" className="form-select-sm" onChange={e => setFcData(e.target.value)} >
                <option value="Dyna">Dyna</option>
                <option value="Stat">Stat</option>
                <option value="Halt">Halt</option>
                <option value="Abord">Abord</option>
              </select>
            </td>
            <td><input name = "MP" type="text" value = {mpData} onChange={e => setMpData(e.target.value)} placeholder="###.#" /> </td>
            <td><input name = "MT" type="text" value = {mtData} onChange={e => setMtData(e.target.value)} placeholder="###.#" /> </td>
            <td><input name = "OD" type="text" value = {odData} onChange={e => setOdData(e.target.value)} placeholder="~74 char" /> </td>
            <td><input type="button" value="Send" onClick={()=>{send()}}/> </td>
          </tr>
        </tbody>
      </table>

  </div> </div>  </div>
  </div>
}

export default Tx
