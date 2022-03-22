
import {crctablefast, chkTxCrcTransparency } from '../common/j2799_common'



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



let msgdata   = "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Halt|MP=050.0|MT=273.0|"
let msgdata_2 = "|ID=SAE J2799|VN=01.00|TV=0119.0|RT=H70|FC=Dyna|MP=025.1|MT=234.0|"

console.log('0x' + crctablefast(msgdata).toString(16))
console.log('0x' + crctablefast(msgdata_2).toString(16))

console.log(chkTxCrcTransparency(crctablefast(msgdata)).map(v=>v.toString(16)) )
console.log(chkTxCrcTransparency(crctablefast(msgdata_2)).map(v=>v.toString(16)) )
