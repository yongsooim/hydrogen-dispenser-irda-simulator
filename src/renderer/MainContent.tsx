import { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap'
import {removeRxTransparencyAndCrc} from '../common/j2799'


const XBOF_sym =  0xFF // Extra Begin of Frame
const BOF_sym  =  0xC0 // Begin of Frame
const EOF_sym  =  0xC1 // End of Frame
const CE_sym   =  0x7D // Control Escape

let MainContent = () => {

  const [receivedData, updateReceivedData] = useState([] as any[])

  useEffect(()=>{
    window.electron.ipcRenderer.on('received', (buffer:Uint8Array) => {

      let removedArr = removeRxTransparencyAndCrc(buffer)
      //console.log(removedArr)
      updateReceivedData((receivedData) =>[<Accordion.Item eventKey={receivedData.length.toString()} key = {receivedData.length} >
          <Accordion.Header>{(new Date(Date.now()).getSeconds() + ":" +  new Date(Date.now()).getMilliseconds())}</Accordion.Header>
          <Accordion.Body>
                {
                  'Parsed : \n' + new TextDecoder().decode(removedArr.filter((v)=>{
                    if(v == XBOF_sym) return false
                    if(v == BOF_sym ) return false
                    if(v == EOF_sym ) return false
                    if(v == CE_sym  ) return false
                    return true
                  })) + '\n' +
                  'Hex : \n' +  Array.from(buffer).map(v => { return v.toString(16).toUpperCase()}).join(', ')
                }
          </Accordion.Body>
        </Accordion.Item>
      , ...receivedData])
      document.getElementById('maincontent')?.scroll(0, 0)
  })

  }, [])

  return <div className = "overflow-auto " >
    <Accordion>

    {receivedData}
    </Accordion>
    </div>
}

export default MainContent
