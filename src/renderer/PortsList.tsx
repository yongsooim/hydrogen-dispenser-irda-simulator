interface portsListProps{
  name? : string;
}

let string = 'temp';

export function setPorts(ports:string){
  string += ports;
}

function PortsList(props:portsListProps){
  console.log(props.name);
  return <div>{string}</div>;
}

export default PortsList;
