import { useState, useEffect, createRef, useRef } from 'react';
import { Accordion } from 'react-bootstrap'

let MainContent = () => {

  const [receivedData, updateReceivedData] = useState([] as any[])

  useEffect(()=>{

    window.electron.ipcRenderer.on('received', (buffer:Uint8Array) => {

      updateReceivedData((receivedData) =>[<Accordion.Item eventKey={receivedData.length.toString()} key = {receivedData.length} >
          <Accordion.Header>{Date.now()}</Accordion.Header>
          <Accordion.Body>
                {buffer.join(', ')}
          </Accordion.Body>
        </Accordion.Item>
      , ...receivedData])
      document.getElementById('maincontent')?.scroll(0, 0)
  })

  }, [])

  return <div className = "overflow-auto " >
    <Accordion defaultActiveKey="0">

    {receivedData}
    </Accordion>
    </div>
}

export default MainContent
