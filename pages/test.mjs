// api-check.mjs
import { createPXEClient } from '@aztec/aztec.js';

async function main() {
  console.log('Script started');
  
  try {
    console.log('Creating PXE client...');
    const pxe = createPXEClient('http://localhost:8080');
    console.log('PXE client created');
    
    // Inspect the PXE object to see what methods are available
    console.log('Available PXE methods:');
    console.log(Object.keys(pxe));
    
    // Try other common methods that might be available
    if (typeof pxe.isConnected === 'function') {
      console.log('Checking connection with isConnected()...');
      const connected = await pxe.isConnected();
      console.log('Connected:', connected);
    }
    
    if (typeof pxe.getNodeInfo === 'function') {
      console.log('Getting node info...');
      const nodeInfo = await pxe.getNodeInfo();
      console.log('Node info:', nodeInfo);
    }
    
    // Try other potential status methods
    for (const method of ['status', 'getInfo', 'getChainInfo', 'getNetworkInfo']) {
      if (typeof pxe[method] === 'function') {
        console.log(`Trying ${method}()...`);
        try {
          const result = await pxe[method]();
          console.log(`${method} result:`, result);
        } catch (err) {
          console.log(`${method} error:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error('Top-level error:', error);
  }
}

main()
  .then(() => console.log('Script completed'))
  .catch(err => console.error('Unhandled error:', err));