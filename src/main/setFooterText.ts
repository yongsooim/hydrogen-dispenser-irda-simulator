import { mainWindow } from './main'

let setFooterText = (alertClass:string, text:string) => {
  mainWindow?.webContents.send('setFooterText', alertClass, text)
}

export default setFooterText
