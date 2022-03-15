import React, { useState, useEffect  } from 'react';

interface portsProps{
  name : string
}

let string = 'temp'

export function setPorts(ports:string){
  string = ports
}

function PortsList(props:portsProps){
  console.log('?')
  return <div>{string}</div>
}

export default PortsList;
