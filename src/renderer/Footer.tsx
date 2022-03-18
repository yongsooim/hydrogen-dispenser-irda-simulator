import { useState, useEffect } from 'react'
const ipcRenderer = window.electron.ipcRenderer

let Footer = () => {

  const [alertClass, setAlertClass] = useState('alert-primary')
  const [footerText, setFooterText] = useState('Select Serial Port on left side bar')

  useEffect(()=>{
    ipcRenderer.on('setFooterText', (receivedAlertClass : any, receivedFooterText : any)=>{
      setAlertClass(receivedAlertClass)
      setFooterText(receivedFooterText)
    })
  }, [])

  return <div className={"alert " + alertClass} role="alert">
      {footerText}
    </div>

}

export default Footer
