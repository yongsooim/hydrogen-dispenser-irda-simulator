
const XBOF_sym =  0xFF // Extra Begin of Frame
const BOF_sym  =  0xC0 // Begin of Frame
const EOF_sym  =  0xC1 // End of Frame
const CE_sym   =  0x7D // Control Escape

export function removeRxTransparencyAndCrc(data:Uint8Array) {

  let transparencyRemoved = []
  //console.log("received arr : " + arr)

  for(let i = 0 ; i < data.length ; i++){

    if(data[i] == CE_sym){
      i++
      if(i < data.length){
        transparencyRemoved.push(data[i] ^ 0x20)
      }

    } else {
      transparencyRemoved.push(data[i])
    }
  }
  //console.log('processed arr : ' + ret)

  let crcRemoved = String.fromCharCode.apply(null, transparencyRemoved).split('|').slice(0, -1).join('|')


  return new Uint8Array(new TextEncoder().encode(crcRemoved))
}



export function isValidJ2799Frame(data:Uint8Array) {

  let dataArr = Array.from(data)

  let frameObj : any = undefined

  if(dataArr[0] != XBOF_sym) return false
  if(dataArr[1] != XBOF_sym) return false
  if(dataArr[2] != XBOF_sym) return false
  if(dataArr[3] != XBOF_sym) return false
  if(dataArr[4] != XBOF_sym) return false
  if(dataArr[5] != BOF_sym) return false

  let appWithCrc = dataArr.slice(6)
  let appWithCrcString = String.fromCharCode.apply(null, appWithCrc)

  let split = appWithCrcString.split('|')

  let appString = split.slice(0,-1).join('|')

  appString

  split.slice(0, -1).every(v=>{
    let value = v.slice(3)
    if(v.startsWith('ID=')) {
      if(value != "SAE J2799") return false

      frameObj.id = value
    }
    else if(v.startsWith('VN=')) {
      if(!value.match(/^[0-9]{2}[.][0-9]{2}$/)) return false
      frameObj.vn = value

    }
    else if(v.startsWith('TV=')) {
      if(!value.match(/^[0-9]{4}[.][0-9]{1}$/)) return false
      if(parseFloat(value) > 5000 ) return false
      frameObj.tv = value

    }
    else if(v.startsWith('RT=')) {
      if(!value.match(/^H25$|^H35$|^H50$|^H70$/)) return false

        frameObj.rt = value

    }
    else if(v.startsWith('FC=')) {
      if(!value.match(/^Dyna$|^Stat$|^Halt$|^Abort$/)) return false
      frameObj.fc = value

    }
    else if(v.startsWith('MP=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) return false
      if(parseFloat(value) > 100) return false
      frameObj.mp = value

    }
    else if(v.startsWith('MT=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) return false
      if(parseFloat(value) > 425 ||  parseFloat(value) < 16) return false
      frameObj.mt = value
    }
    else if(v.startsWith('OD=')) {
      if(value.includes('|'))
        return false

      if(value.length > 74)
        return false

      frameObj.od = value
    }
    else {
      return false
    }

    return true

  }

  )

  return {isValid : true , frameObj}
}

