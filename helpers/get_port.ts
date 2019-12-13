export default function getPort (portsRange: number[], usedPorts: number[]): number | undefined {
  let freePorts: number[] = portsRange.filter((num) => !usedPorts.includes(num))
  let index: number = Math.floor(Math.random() * freePorts.length)
  return freePorts[index]
}