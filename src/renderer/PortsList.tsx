import { useState, useEffect } from 'react'
import { PortInfo } from '@serialport/bindings-interface'

let oldPortsPath = [] as string[]
const ipcRenderer = window.electron.ipcRenderer

let PortsList = () => {
  const [portInfoArr, setPortInfoArr] = useState([] as PortInfo[])
  const [selectedPort, setSelectedPort] = useState('')
  const [connectedPort, setConnectedPort] = useState('')

  useEffect(()=>{ // add event listenr port list update by main.ts(emits list periodically)
    ipcRenderer.on('updatePortsInfo', (args:any) => {
      let receivedPorts= args[0] as PortInfo[]
      let receivedPortsPath = receivedPorts.map(port=>port.path)

      if((receivedPortsPath.length == oldPortsPath.length) // early return when ports not changed
         && receivedPortsPath.every((path, index) => path == oldPortsPath[index]  ) ){
        return

      } else {
        setPortInfoArr(receivedPorts) // update state
        oldPortsPath = receivedPortsPath
      }
    })

    ipcRenderer.on('connectSerialReq', (arg:any) => {
      console.log(arg + ' received');
    });

  }, []);

  let portsPathList = portInfoArr.length == 0 ? <li className = "list-group-item"> No ports discovered </li> : portInfoArr.map((port) =>
      <li className = {port.path == selectedPort ? " list-group-item selectedPort" : "list-group-item"}
            key = {port.path}
            onClick={()=>{
              setSelectedPort(port.path)
              ipcRenderer.send('connectSerialReq', port.path)
            }} > {port.path}
        <ul>
          <li> {' S/N          : ' + port.serialNumber}</li>
          <li> {' Manufacturer : ' + port.manufacturer}</li>
          <li> {' Proudct ID   : ' + port.productId   }</li>
          <li> {' Vender ID    : ' + port.vendorId    }</li>
        </ul>
      </li> )

  return <div className = "portListDiv" style={{width:'250px'}} >
      <ul className="list-group" >
        {portsPathList}
      </ul>
    </div>;
}

export default PortsList
