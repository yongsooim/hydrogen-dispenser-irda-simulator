
/*
  The signal is organized into IR frames, as shown in Figure 3, that have a direct correlation to UART frames as described in
  Section B.3 of IrPHY 1.4. Each byte is transmitted asynchronously with a start bit, 8 data bits, and a stop bit. Data bits are
  transmitted  in  serial  byte  order,  with  the  least  significant  bit  (LSB)  transmitted  first  and  the  most  significant  bit  (MSB)
  transmitted last. Bits are transmitted at a rate of 38400 bits per second.
*/

//control characters
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

export class J2699Frame {

  constructor(data:J2699Data | undefined){
    this.data = data
  }

  data: J2699Data | undefined;

  isValid () { // rangeCheck

    if(this.data?.id){
      if(this.data.id != "SAE J2799")
        return false
    }

    if(this.data?.vn){
      if(!this.data.vn.match(/^[0-9]{2}[.][0-9]{2}$/) )
        return false
    }

    if(this.data?.tv){
      if(!this.data.tv.match(/^[0-9]{4}[.][0-9]{1}$/) )
        return false
      if(parseFloat(this.data.tv) > 5000 )
        return false
    }

    if(this.data?.rt){
      if(!this.data.rt.match(/^H25$|^H35$|^H50$|^H70$/) )
        return false
    }

    if(this.data?.fc){
      if(!this.data.fc.match(/^Dyna$|^Stat$|^Halt$|^Abort$/) )
        return false
    }

    if(this.data?.mp){
      if(!this.data.mp.match(/^[0-9]{3}[.][0-9]{1}$/) )
        return false
      if(parseFloat(this.data.mp) > 100 )
        return false
    }

    if(this.data?.mt){
      if(!this.data.mt.match(/^[0-9]{3}[.][0-9]{1}$/) )
        return false
      if(parseFloat(this.data.mt) > 425 ||  parseFloat(this.data.mt) < 16)
        return false
    }

    if(this.data?.od){
      if(this.data.od.includes('|'))
        return false

      if(this.data.od.length > 74)
        return false
    }

    return true
  }


  buildFrameString() {
    let retStr = '|'

    if(this.data?.id) retStr += 'ID=' + this.data.id + '|'
    if(this.data?.vn) retStr += 'VN=' + this.data.vn + '|'
    if(this.data?.tv) retStr += 'TV=' + this.data.tv + '|'
    if(this.data?.rt) retStr += 'RT=' + this.data.rt + '|'
    if(this.data?.fc) retStr += 'FC=' + this.data.fc + '|'
    if(this.data?.mp) retStr += 'MP=' + this.data.mp + '|'
    if(this.data?.mt) retStr += 'MT=' + this.data.mt + '|'
    if(this.data?.od) retStr += 'OD=' + this.data.od + '|'

    return retStr
  }

  buildBuffer(){

    let retBuf = Buffer.from([XBOF_sym, XBOF_sym, XBOF_sym, XBOF_sym, XBOF_sym, BOF_sym])

    let buffArr = [retBuf]

    buffArr.push(Buffer.from('|'))
    if(this.data?.id) buffArr.push(Buffer.from('ID=' + this.data.id + '|'))
    if(this.data?.vn) buffArr.push(Buffer.from('VN=' + this.data.vn + '|'))
    if(this.data?.tv) buffArr.push(Buffer.from('TV=' + this.data.tv + '|'))
    if(this.data?.rt) buffArr.push(Buffer.from('RT=' + this.data.rt + '|'))
    if(this.data?.fc) buffArr.push(Buffer.from('FC=' + this.data.fc + '|'))
    if(this.data?.mp) buffArr.push(Buffer.from('MP=' + this.data.mp + '|'))
    if(this.data?.mt) buffArr.push(Buffer.from('MT=' + this.data.mt + '|'))
    if(this.data?.od) buffArr.push(Buffer.from('OD=' + this.data.od + '|'))


    let fcs1 = Buffer.from([0])
    let fcs2 = Buffer.from([0])

    buffArr.push(fcs1, fcs2, Buffer.from([EOF_sym]))

    Buffer.concat(buffArr)
    return Buffer.concat(buffArr)
  }
}

function buildFrameWithTransparency(arg : string) {
  return arg
}



function calcCrc(arg : string){
  return arg
}

const exampleData  = new J2699Frame({
  id : "SAE J2799",
  vn : "01.00",
  tv : "0119.0",
  rt : "H70",
  fc : "Halt",
  mp : "050.0",
  mt : "273.0",
  od : undefined
})




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

// Data character string
// no transparency
let msgdata= "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Halt|MP=050.0|MT=273.0|"
let msgdata_2 = "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Dyna|MP=025.1|MT=234.0|"

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

function crctablefast(data:string) {
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


function chkTxCrcTransparency(crc_in:number) {
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

function chkRxTransparency(data:number[]) {
  let retData = [] as number[]
  for(let i = 0 ; i < data.length ; i++){

    if(data[i] == CE_sym){
      i++
      if(i < data.length){
        retData.push(data[i] ^ 0x20)
      }

    } else {
      retData.push(data[i])
    }
  }
}



let crctab = [] as number[]

function generate_crc_table() {
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


console.log('0x' + crctablefast(  msgdata).toString(16))
console.log('0x' + crctablefast(  msgdata_2).toString(16))

console.log(chkTxCrcTransparency(crctablefast(  msgdata) ).map(v=>v.toString(16)) )
console.log(chkTxCrcTransparency(crctablefast(  msgdata_2)).map(v=>v.toString(16)) )
