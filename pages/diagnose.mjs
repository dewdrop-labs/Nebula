// diagnose.mjs
import { loadContractArtifact } from '@aztec/aztec.js';
import NebulaContractJson from "../contracts/target/nebula-Nebula.json" with { type: "json" };
import { writeFileSync } from 'fs';

function main() {
  console.log('Loading contract artifact...');
  const artifact = loadContractArtifact(NebulaContractJson);
  
  console.log('\nContract Basic Info:');
  console.log('- Name:', artifact.name);
  console.log('- Class hash:', artifact.classHash);
  
  console.log('\nInitializers:');
  if (artifact.initializers && artifact.initializers.length > 0) {
    artifact.initializers.forEach((initializer, index) => {
      console.log(`Initializer ${index + 1}:`);
      console.log('  - Name:', initializer.name);
      console.log('  - Selector:', initializer.selector);
      console.log('  - Parameters:', initializer.parameters);
    });
  } else {
    console.log('No initializers found in artifact!');
  }
  
  console.log('\nFunctions:');
  if (artifact.functions && artifact.functions.length > 0) {
    artifact.functions.forEach((func, index) => {
      console.log(`Function ${index + 1}:`);
      console.log('  - Name:', func.name);
      console.log('  - Selector:', func.selector);
      console.log('  - Parameters:', func.parameters);
      if (func.name.includes('constructor') || func.name.includes('initializer')) {
        console.log('  *** Possible constructor/initializer');
      }
    });
  } else {
    console.log('No functions found in artifact!');
  }
  
  // Save full artifact structure to file for inspection
  console.log('\nSaving full artifact to artifact-structure.json for detailed inspection');
  writeFileSync('artifact-structure.json', JSON.stringify(artifact, null, 2));
}

main();