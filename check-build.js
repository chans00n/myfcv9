const fs = require('fs');
const path = require('path');

// Check if the .next directory exists
if (fs.existsSync('.next')) {
  console.log('.next directory exists');
  
  // Check if the problematic file exists
  const manifestPath = path.join('.next', 'server', 'app', '(dashboard)', 'page_client-reference-manifest.js');
  if (fs.existsSync(manifestPath)) {
    console.log(`File exists: ${manifestPath}`);
  } else {
    console.log(`File does not exist: ${manifestPath}`);
    
    // Check if the parent directory exists
    const parentDir = path.join('.next', 'server', 'app', '(dashboard)');
    if (fs.existsSync(parentDir)) {
      console.log(`Parent directory exists: ${parentDir}`);
      // List files in the parent directory
      const files = fs.readdirSync(parentDir);
      console.log('Files in parent directory:', files);
    } else {
      console.log(`Parent directory does not exist: ${parentDir}`);
    }
  }
} else {
  console.log('.next directory does not exist');
}

// Check if the out directory exists
if (fs.existsSync('out')) {
  console.log('out directory exists');
  
  // List files in the out directory
  const outFiles = fs.readdirSync('out');
  console.log('Files in out directory:', outFiles);
} else {
  console.log('out directory does not exist');
} 