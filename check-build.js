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
  
  // Check for other important files
  const serverDir = path.join('.next', 'server');
  if (fs.existsSync(serverDir)) {
    console.log(`Server directory exists: ${serverDir}`);
    const serverFiles = fs.readdirSync(serverDir);
    console.log('Files in server directory:', serverFiles);
    
    // Check for pages-manifest.json
    const pagesManifestPath = path.join(serverDir, 'pages-manifest.json');
    if (fs.existsSync(pagesManifestPath)) {
      console.log(`File exists: ${pagesManifestPath}`);
    } else {
      console.log(`File does not exist: ${pagesManifestPath}`);
    }
    
    // Check for middleware-manifest.json
    const middlewareManifestPath = path.join('.next', 'server', 'middleware-manifest.json');
    if (fs.existsSync(middlewareManifestPath)) {
      console.log(`File exists: ${middlewareManifestPath}`);
    } else {
      console.log(`File does not exist: ${middlewareManifestPath}`);
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

// Create a dummy file if the problematic file doesn't exist
const manifestPath = path.join('.next', 'server', 'app', '(dashboard)', 'page_client-reference-manifest.js');
if (!fs.existsSync(manifestPath)) {
  try {
    // Make sure the directory exists
    const dir = path.dirname(manifestPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create an empty file
    fs.writeFileSync(manifestPath, '// Empty file created by check-build.js\n');
    console.log(`Created empty file: ${manifestPath}`);
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
} 