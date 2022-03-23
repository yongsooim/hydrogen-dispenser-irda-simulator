
/*
  The signal is organized into IR frames, as shown in Figure 3, that have a direct correlation to UART frames as described in
  Section B.3 of IrPHY 1.4. Each byte is transmitted asynchronously with a start bit, 8 data bits, and a stop bit. Data bits are
  transmitted  in  serial  byte  order,  with  the  least  significant  bit  (LSB)  transmitted  first  and  the  most  significant  bit  (MSB)
  transmitted last. Bits are transmitted at a rate of 38400 bits per second.
*/

export const XBOF_sym =  0xFF // Extra Begin of Frame
export const BOF_sym  =  0xC0 // Begin of Frame
export const EOF_sym  =  0xC1 // End of Frame
export const CE_sym   =  0x7D // Control Escape

const J2799DATALENGTH	= (66)
const	XBOFDATALENGTH	= (5)
const BOFDATALENGTH	= (1)
const EOFDATALENGTH	= (1)
const FCSDATALENGTH	= (2)
const TX2DATALENGTH	= (J2799DATALENGTH+XBOFDATALENGTH+BOFDATALENGTH+FCSDATALENGTH+EOFDATALENGTH)

const defs = {
  id : { range : "SAE J2799",                                                   interval:"100ms", direction:"Vehicle to Dispenser"},  // Protocol Identifier
  vn : { range : "00.00 - 99.99",           format : "##.##",                   interval:"100ms", direction:"Vehicle to Dispenser"},  // Data Communications Software Version Number
  tv : { range : "0000.0 - 5000.0",         format : "####.#", units: "Liters", interval:"100ms", direction:"Vehicle to Dispenser"},  // Tank volume
  rt : { range : "H25, H35, H50, H70",                                          interval:"100ms", direction:"Vehicle to Dispenser"},  //  Receptacle Type
  fc : { range : "Dyna, Stat, Halt, Abort",                                     interval:"100ms", direction:"Vehicle to Dispenser"},  //  Fueling Command
  mp : { range : "000.0 - 100.0",           format : "###.#",  units: "MPa",    interval:"100ms", direction:"Vehicle to Dispenser"},  //  Measured Pressure
  mt : { range : "16.0 - 425.0",            format : "###.#",  units: "Kelvin", interval:"100ms", direction:"Vehicle to Dispenser"},  //  Measured Temperature
  od : { range : " ~74 characters without character '|' ",                      interval:"100ms", direction:"Vehicle to Dispenser"},  //  Optional Data
}

export interface J2699Data {
  id? : string
  vn? : string
  tv? : string
  rt? : string
  fc? : string
  mp? : string
  mt? : string
  od? : string
}


export function buildBuffer(data : J2699Data){

  let applicationData ='|'

  if(data.id) applicationData += 'ID=' + data.id + '|'
  if(data.vn) applicationData += 'VN=' + data.vn + '|'
  if(data.tv) applicationData += 'TV=' + data.tv + '|'
  if(data.rt) applicationData += 'RT=' + data.rt + '|'
  if(data.fc) applicationData += 'FC=' + data.fc + '|'
  if(data.mp) applicationData += 'MP=' + data.mp + '|'
  if(data.mt) applicationData += 'MT=' + data.mt + '|'
  if(data.od) applicationData += 'OD=' + data.od + '|'

  //console.log(applicationData)

  let fcsArr = removeCrcTransparency(crctablefast(applicationData))

  let applicationDataArr = new TextEncoder().encode(applicationData)

  let retBuf = Buffer.from([XBOF_sym, XBOF_sym, XBOF_sym, XBOF_sym, XBOF_sym, BOF_sym, ...applicationDataArr, ...fcsArr, EOF_sym])

  return retBuf
}

export function removeRxTransparencyAndCrc(data:Uint8Array) {

  let transparencyRemoved = []
  //console.log("received arr : " + arr)

  for(let i = 6 ; i < data.length ; i++){ // starts with 6 for deleteing BOF and XBOF

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

  let crcRemoved = String.fromCharCode.apply(null, transparencyRemoved).split('|').slice(0, -1).join('|') + '|'

  return new Uint8Array(new TextEncoder().encode(crcRemoved))
}



export function isValidJ2799Frame(data:Uint8Array) {

  let dataArr = Array.from(data)

  let frameObj = {} as J2699Data

  let ret = {isValid : true, validFrame : {} as any}

  if(dataArr[0] != XBOF_sym) ret.isValid = false
  if(dataArr[1] != XBOF_sym) ret.isValid = false
  if(dataArr[2] != XBOF_sym) ret.isValid = false
  if(dataArr[3] != XBOF_sym) ret.isValid = false
  if(dataArr[4] != XBOF_sym) ret.isValid = false
  if(dataArr[5] != BOF_sym) ret.isValid = false

  let appWithCrc = dataArr.slice(6)
  let appWithCrcString = String.fromCharCode.apply(null, appWithCrc)

  let split = appWithCrcString.split('|')

  let appString = split.slice(0,-1).join('|') + '|'

  let receivedCrc = split.slice(-1)[0]
  if(!removeCrcTransparency(crctablefast(appString)).every( (v, index ) =>{
    return (receivedCrc.charCodeAt(index) == v)
  })) {
    ret.isValid = false
  }

  split.slice(1, -1).forEach(v=>{
    let value = v.slice(3)
    if(v.startsWith('ID=')) {
      if(value != "SAE J2799") ret.isValid = false
      else frameObj.id = value
    }
    else if(v.startsWith('VN=')) {
      if(!value.match(/^[0-9]{2}[.][0-9]{2}$/)) ret.isValid = false
      else frameObj.vn = value

    }
    else if(v.startsWith('TV=')) {
      if(!value.match(/^[0-9]{4}[.][0-9]{1}$/)) ret.isValid = false
      if(parseFloat(value) >= 5000 ) ret.isValid = false
      frameObj.tv = value

    }
    else if(v.startsWith('RT=')) {
      if(!value.match(/^H25$|^H35$|^H50$|^H70$/)) ret.isValid = false

        frameObj.rt = value

    }
    else if(v.startsWith('FC=')) {
      if(!value.match(/^Dyna$|^Stat$|^Halt$|^Abort$/)) ret.isValid = false
      frameObj.fc = value

    }
    else if(v.startsWith('MP=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) ret.isValid = false
      if(parseFloat(value) >= 100) ret.isValid = false
      frameObj.mp = value

    }
    else if(v.startsWith('MT=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) ret.isValid = false
      if(parseFloat(value) >= 425 &&  parseFloat(value) <= 16) ret.isValid = false
      frameObj.mt = value
    }
    else if(v.startsWith('OD=')) {
      if(value.includes('|'))
        ret.isValid = false

      if(value.length > 74)
        ret.isValid = false

      frameObj.od = value
    }
    else {
      ret.isValid = false
    }
  })

  if(ret.isValid)
    ret.validFrame = frameObj

  return ret
}




// CRC parameters (default values are for CCITT 16 Bit):
const  order = 16;
const  polynom = 0x1021;
const  crcxor = 0x00;
const  refin = 1;
const  refout = 1;


const crcmask = (((1 << (order - 1)) - 1) << 1) | 1;
const crchighbit = 1 << (order - 1);


// 'order' [1..32] is the CRC polynom order, counted without the leading '1' bit
// 'polynom' is the CRC polynom without leading '1' bit
// 'direct' [0,1] specifies the kind of algorithm: 1=direct, no augmented zero bits
// 'crcinit' is the initial CRC value belonging to that algorithm
// 'crcxor' is the final XOR value
// 'refin' [0,1] specifies if a data byte is reflected before processing (UART) or not
// 'refout' [0,1] specifies if the CRC will be reflected before XOR


// internal global values:
let crcinit_direct: number;
// subroutines

function reflect(crc:number, bitnum:number) {
	// reflects the lower 'bitnum' bits of 'crc'
	let i, j = 1, crcout = 0;
	for (i = 1 << (bitnum - 1); i; i >>= 1) {
		if (crc & i) crcout |= j;
		j <<= 1;
	}
	return (crcout);
}

function crcbitbybitfast(data:Uint8Array) {
	// fast bit by bit algorithm without augmented zero bytes.
	// does not use lookup table, suited for polynom orders between 1...32.
	let i, j, c, bit;
	let crc = crcinit_direct;
	for (i = 0; i < data.length; i++) {
		c = data[i];
		if (refin) c = reflect(c, 8);
		for (j = 0x80; j; j >>= 1) {
			bit = crc & crchighbit;
			crc <<= 1;
			if (c & j) bit ^= crchighbit;
			if (bit) crc ^= polynom;
		}
	}

	if (refout) crc = reflect(crc, order);
	crc ^= crcxor;
	crc &= crcmask;
	return(crc);
}

export function crctablefast(data:string) {
	// fast lookup table algorithm without augmented zero bytes, e.g., used in pkzip.
	// only usable with polynom orders of 8, 16, 24 or 32.
  let len = data.length
	let crc = crcinit_direct;
  let i = 0
	if (refin) crc = reflect(crc, order);
	if (!refin) while (len--) crc = (crc << 8) ^ crctab[((crc >> (order - 8)) & 0xff) ^ data.charCodeAt(i++)];
	else while (len--) crc = (crc >> 8) ^ crctab[(crc & 0xff) ^ data.charCodeAt(i++)];
	if (refout^refin) crc = reflect(crc, order);
	crc ^= crcxor;
	crc &= crcmask;
	return(crc);
}


export function removeCrcTransparency(crc_in:number) {
	// transparency check
	let crc_part1, crc_part2;
  let crcArr = [] as number[]

	crc_part1 = ((crc_in >> 8) & 0xff);
	switch (crc_part1)
	{
	case XBOF_sym:
	case BOF_sym:
	case EOF_sym:
	case CE_sym:
		crcArr.push(CE_sym);
		crcArr.push(crc_part1 ^ 0x20);
		break;
	default:
		crcArr.push(crc_part1);
	}

	crc_part2 = (crc_in & 0xff);
	switch (crc_part2)
	{
	case XBOF_sym:
	case BOF_sym:
	case EOF_sym:
	case CE_sym:
		crcArr.push(CE_sym);
		crcArr.push(crc_part2 ^ 0x20);
		break;
	default:
		crcArr.push(crc_part2)
	}

  return crcArr
}


let crctab = [] as number[]

export function generate_crc_table() {
	// make CRC lookup table used by table algorithms
	let i, j;
	let bit, crc;
	for (i = 0; i < 256; i++) {
		crc = i;
		if (refin) crc = reflect(crc, 8);
		crc <<= order - 8;
		for (j = 0; j < 8; j++) {
			bit = crc & crchighbit;
			crc <<= 1;
			if (bit) crc ^= polynom;
		}

		if (refin) crc = reflect(crc, order);
		crc &= crcmask;
		crctab[i] = crc;
	}
}

generate_crc_table()

let msgdata   = "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Halt|MP=050.0|MT=273.0|"
let msgdata_2 = "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Dyna|MP=025.1|MT=234.0|"

console.log('0x' + crctablefast(msgdata).toString(16))
console.log('0x' + crctablefast(msgdata_2).toString(16))

console.log(removeCrcTransparency(crctablefast(msgdata)).map(v=>v.toString(16)) )
console.log(removeCrcTransparency(crctablefast(msgdata_2)).map(v=>v.toString(16)) )


export function validateFrame(data:Uint8Array){

  let isBofValid
  let isCrcValid
  let isEofValid
  let isAllValid

  let split = new TextDecoder().decode(data).split('|')
  let appString = '|' + split.slice(1, -1).join('|') + '|'

  console.log("\nappString : " + appString)
  isBofValid = validateBof(data)
  let {isAppStringValid, j2699data} = validateAppString(appString)

  let receivedCrc = Array.from(data.slice(6 + appString.length, -1))
  let calculatedCrc = removeCrcTransparency(crctablefast(appString))

  console.log(calculatedCrc)
  console.log(receivedCrc)

  if(receivedCrc.length != calculatedCrc.length ||
    !calculatedCrc.every( (v, index) =>{
        return (receivedCrc[index] == v)
  })) {
    isCrcValid = false
  } else {
    isCrcValid = true
  }

  if(data.slice(-1)[0] == EOF_sym) {
    isEofValid = true
  } else {
    isEofValid = false
  }

  if(isBofValid && isAppStringValid && isCrcValid && isEofValid) {
    isAllValid = true
  } else {
    isAllValid = false
  }

  return { isBofValid, isAppStringValid, isCrcValid, isEofValid, isAllValid, j2699data }
}

function validateBof(data:Uint8Array){

  if(data[0] != XBOF_sym) return false
  if(data[1] != XBOF_sym) return false
  if(data[2] != XBOF_sym) return false
  if(data[3] != XBOF_sym) return false
  if(data[4] != XBOF_sym) return false
  if(data[5] != BOF_sym)  return false

  return true
}


function validateAppString(appString : string){

  let split = appString.split('|')
  let isValid = true
  let j2699data = {} as J2699Data

  split.slice(1, -1).forEach(v=>{
    let value = v.slice(3)
    if(v.startsWith('ID=')) {
      if(value != "SAE J2799") isValid = false
      else j2699data.id = value
    }
    else if(v.startsWith('VN=')) {
      if(!value.match(/^[0-9]{2}[.][0-9]{2}$/)) isValid = false
      else j2699data.vn = value

    }
    else if(v.startsWith('TV=')) {
      if(!value.match(/^[0-9]{4}[.][0-9]{1}$/)) isValid = false
      if(parseFloat(value) > 5000 ) isValid = false
      j2699data.tv = value

    }
    else if(v.startsWith('RT=')) {
      if(!value.match(/^H25$|^H35$|^H50$|^H70$/)) isValid = false
      j2699data.rt = value
    }
    else if(v.startsWith('FC=')) {
      if(!value.match(/^Dyna$|^Stat$|^Halt$|^Abort$/)) isValid = false
      j2699data.fc = value

    }
    else if(v.startsWith('MP=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) isValid = false
      if(parseFloat(value) > 100) isValid = false
      j2699data.mp = value

    }
    else if(v.startsWith('MT=')) {
      if(!value.match(/^[0-9]{3}[.][0-9]{1}$/)) isValid = false
      if(parseFloat(value) > 425 &&  parseFloat(value) <= 16) isValid = false
      j2699data.mt = value
    }
    else if(v.startsWith('OD=')) {
      if(value.includes('|'))
        isValid = false

      if(value.length > 74)
        isValid = false

      j2699data.od = value
    }
    else {
      isValid = false
    }
  })

  return {isAppStringValid : isValid, j2699data: j2699data}
}
