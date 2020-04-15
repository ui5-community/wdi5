declare global {
  const sap: any;
  const driver: any;
  const jQuery: any;

  interface Window {
    sap: any;
    bridge: any;
  }
}
export {};
