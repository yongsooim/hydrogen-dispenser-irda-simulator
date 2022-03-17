import { SerialPort } from 'serialport';
import { InterByteTimeoutParser } from '@serialport/parser-inter-byte-timeout'
import { BrowserWindow,  ipcMain } from 'electron';

let portsListUpdateInterval : NodeJS.Timer
let port : SerialPort | null = null


export let sendSerialInfoList = (mainWindow : BrowserWindow) => {

  SerialPort.list() //update once when main window is ready-to-show
  .then( ports => { mainWindow.webContents.send('updatePortsInfo', [ports]) })
  .catch(console.log)

  // update periodically
  portsListUpdateInterval ? clearInterval(portsListUpdateInterval) : null
  portsListUpdateInterval = setInterval(() => SerialPort.list()
  .then( ports => {  mainWindow.webContents.send('updatePortsInfo', [ports]) })
  .catch(console.log), 1000 )
}

ipcMain.on('connectSerialReq', async (event, path) => {

  port?.close((err)=>{if(err)console.log(err.message)})

  port = new SerialPort({
    path: path,
    baudRate: 38400, // J2799 standard baudrate
  }, (err)=>{if(err)console.log(err.message)})

  // The open event is always emitted
  port.on('open', function() {
    console.log(path + ' opened')
  })

  const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }))
  parser.on('data', (data)=>{console.log("received data on " + port?.path + " : " + data.toString() )} ) // will emit data if there is a pause between packets of at least 30ms

  port.write('first contact', function(err) {  // first contact
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })

  port.on('error', function(err) {
    console.log('Error: ', err?.message)
  })
  event.reply('connectSerialReq', 'replied');

});

ipcMain.on('closeSerialReq', async () => {
  port?.close((err)=>{if(err)console.log(err.message)})
})
