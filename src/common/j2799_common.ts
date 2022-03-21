
const XBOF_sym =  0xFF // Extra Begin of Frame
const BOF_sym  =  0xC0 // Begin of Frame
const EOF_sym  =  0xC1 // End of Frame
const CE_sym   =  0x7D // Control Escape

export function removeRxTransparency(data:Uint8Array) {

  let arr = Array.from(data)
  let ret = []
  console.log("received arr : " + arr)

  for(let i = 0 ; i < data.length ; i++){

    if(data[i] == CE_sym){
      i++
      if(i < data.length){
        ret.push(data[i] ^ 0x20)
      }

    } else {
      ret.push(data[i])
    }
  }
  console.log('processed arr : ' + ret)
  return new Uint8Array(ret)
}

