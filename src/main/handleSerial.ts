import { mainWindow } from './main'
import { ipcMain } from 'electron';
import { SerialPort } from 'serialport';
import { InterByteTimeoutParser } from '@serialport/parser-inter-byte-timeout'
import { J2699Data, buildBuffer } from '../common/j2799'
import setFooterText from './setFooterText'

let portsListUpdateInterval : NodeJS.Timer
let port : SerialPort | null = null

export let sendSerialInfoList = () => {

  SerialPort.list() //update once when main window is ready-to-show
  .then( ports => { mainWindow?.webContents.send('updatePortsInfo', ports) })
  .catch(console.log)

  // update periodically
  portsListUpdateInterval ? clearInterval(portsListUpdateInterval) : null
  portsListUpdateInterval = setInterval(() => SerialPort.list()
  .then( ports => {  mainWindow?.webContents.send('updatePortsInfo', ports) })
  .catch(console.log), 1000 )
}

ipcMain.on('connectSerialReq', async (event, path) => {

  let openPort = () => {
    port = new SerialPort({
      path: path,
      baudRate: 38400, // J2799 standard baudrate
    }, (err)=>{if(err){
      console.log(err.message)
      setFooterText('alert-danger', err.message)
    }})

    port.on('open', function() {
      if(port?.isOpen){
        event.reply('connectSerialReq', path);
        setFooterText( 'alert-success', path + ' opened')

        if(true){
          const data = 'first contact'
          port?.write(data, function(err) {  // first contact
            if (err) {
              setFooterText('alert-danger', 'Error on write: ' + err.message)
              return console.log('Error on write: ', err.message)
            }
            console.log('message written')
            setFooterText('alert-success', '\'' + data + '\' written on ' + path)
          })
        }

        const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }))
        parser.on('data', (data:Uint8Array)=>{
          console.log("received data on " + port?.path + " : " + data)
          mainWindow?.webContents.send('received', data) // data : Uint8Array
        } ) // will emit data if there is a pause between packets of at least 30ms

        port.on('error', function(err) {
          console.log('Error: ', err.message)
        })
    }})
  }

  if(port?.isOpen){
    port?.close(()=>{
      openPort()
    })
  } else {
    openPort()
  }
});

ipcMain.on('closeSerialReq', async (event, path) => {
  if(port?.isOpen){
    port?.close((err)=>{
      if(err)console.log(err.message)
      event.reply('closeSerialReq', path)
      setFooterText('alert-secondary', path + ' closed')
    })
  }
})

ipcMain.on('txReq',  async (event, data :J2699Data) => {
  if(port?.isOpen){
    port.write(JSON.stringify(data), function(err) {
      if (err) {
        setFooterText('alert-danger', 'Error on write: ' + err.message)
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
      setFooterText('alert-success', '\'' + JSON.stringify(data) + '\' written ')
    })
  } else {
    event.reply('cannot send')
    setFooterText('alert-danger', 'cannot send')
  }
})

ipcMain.on('txReqByObj',  async (event, data :J2699Data) => {
  if(port?.isOpen){

    port.write(buildBuffer(data), function(err) {
      if (err) {
        setFooterText('alert-danger', 'Error on write: ' + err.message)
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
      setFooterText('alert-success', '\'' + JSON.stringify(data) + '\' written ')
    })
  } else {
    event.reply('cannot send')
    setFooterText('alert-danger', 'cannot send')
  }
})
