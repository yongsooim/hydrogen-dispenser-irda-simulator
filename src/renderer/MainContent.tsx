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
    window.electron.ipcRenderer.on('received', (args:any[]) => {

      console.log(args[0])
      let {isAllValid} = args[0]
      let appString = ''

      if(isAllValid)  {
        ({appString} = args[0])
      } else {
        appString = 'No valid frame'
      }

      let rawData:Uint8Array = args[1]

      console.log(rawData)
      let currentTime = new Date(Date.now())
      //console.log(removedArr)
      updateReceivedData((receivedData) =>[<Accordion.Item eventKey={receivedData.length.toString()} key = {receivedData.length} >
          <Accordion.Header>{currentTime.getHours() + ":" + currentTime.getMinutes() + ":" +  currentTime.getSeconds() + "." +  currentTime.getMilliseconds()}</Accordion.Header>
          <Accordion.Body>
                {
                  'Parsed : \n' + appString + '\n' +
                  'Hex : \n' + Array.from(rawData).map(x => x.toString(16).toUpperCase().padStart(2, '0')).join(',')
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
