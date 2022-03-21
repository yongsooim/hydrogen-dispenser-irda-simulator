import { useState, useEffect } from 'react'
import { PortInfo } from '@serialport/bindings-interface'

let oldPortsPath = [] as string[]
const ipcRenderer = window.electron.ipcRenderer

let PortsList = () => {
  const [portInfoArr, setPortInfoArr] = useState([] as PortInfo[])
  const [connectedPort, setConnectedPort] = useState('')

  useEffect(()=>{ // add event listenr port list update by main.ts(emits list periodically)
    ipcRenderer.on('updatePortsInfo', (ports: PortInfo[]) => {
      let receivedPorts= ports
      let receivedPortsPath = receivedPorts.map(port=>port.path)

      if((receivedPortsPath.length == oldPortsPath.length) // early return when ports not changed
         && receivedPortsPath.every((path, index) => path == oldPortsPath[index]  ) ){
        return

      } else {
        setPortInfoArr(receivedPorts) // update state
        oldPortsPath = receivedPortsPath
      }
    })

    ipcRenderer.on('connectSerialReq', (path:string) => {
      console.log(path + ' conneted')
      setConnectedPort(path)
    });

    ipcRenderer.on('closeSerialReq', (path:string) => {
      console.log(path + ' closed')
      setConnectedPort('')
    });
  }, []);

  let portsPathList = portInfoArr.length == 0 ? <li className = "list-group-item"> No ports discovered </li> : portInfoArr.map((port) =>
      <li className = {port.path == connectedPort ? " list-group-item connectedPort" : "list-group-item"}
            key = {port.path}
            onClick={()=>{
              if(connectedPort == port.path) {
                ipcRenderer.send('closeSerialReq', port.path)
              } else {
                ipcRenderer.send('connectSerialReq', port.path)
              }
            }} >
            {port.path + '\n' +
              ' S/N          : ' + port.serialNumber + '\n' +
              ' Manufacturer : ' + port.manufacturer + '\n' +
              ' Proudct ID   : ' + port.productId    + '\n' +
              ' Vender ID    : ' + port.vendorId     }
      </li> )

  return <div className = "portListDiv" style={{width:'250px'}} >
      <ul className="list-group" >
        {portsPathList}
      </ul>
    </div>;
}

export default PortsList
