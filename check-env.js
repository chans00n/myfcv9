#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found .env file');
} catch (error) {
  console.log('❌ .env file not found. Creating one...');
  envContent = '';
}

// Parse current environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// Check Supabase variables
console.log('\n🔍 Checking Supabase environment variables...');

const checkVar = (name) => {
  if (envVars[name]) {
    console.log(`✅ ${name} is set to: ${name.includes('KEY') ? '[REDACTED]' : envVars[name]}`);
    return true;
  } else {
    console.log(`❌ ${name} is not set`);
    return false;
  }
};

const hasUrl = checkVar('NEXT_PUBLIC_SUPABASE_URL');
const hasKey = checkVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (hasUrl && hasKey) {
  console.log('\n✅ All Supabase environment variables are set.');
  
  // Check if URL is properly formatted
  const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
  if (url === 'https://your-project-id.supabase.co' || !url.includes('.supabase.co')) {
    console.log('\n⚠️ Warning: Your Supabase URL appears to be using a placeholder value.');
    console.log('   It should look like: https://abcdefghijklm.supabase.co');
  }
  
  rl.close();
} else {
  console.log('\n❌ Some Supabase environment variables are missing.');
  
  const promptForVar = (name, defaultValue, callback) => {
    rl.question(`Enter your ${name} (${defaultValue ? 'default: ' + defaultValue : 'required'}): `, (answer) => {
      const value = answer.trim() || defaultValue;
      if (value) {
        envVars[name] = value;
        callback();
      } else {
        console.log(`❌ ${name} is required.`);
        promptForVar(name, defaultValue, callback);
      }
    });
  };
  
  const saveEnv = () => {
    // Reconstruct .env file
    let newEnvContent = '';
    for (const [key, value] of Object.entries(envVars)) {
      newEnvContent += `${key}=${value}\n`;
    }
    
    fs.writeFileSync(envPath, newEnvContent);
    console.log('\n✅ Environment variables saved to .env file.');
    console.log('🔄 Please restart your development server for changes to take effect.');
    rl.close();
  };
  
  if (!hasUrl) {
    promptForVar('NEXT_PUBLIC_SUPABASE_URL', '', () => {
      if (!hasKey) {
        promptForVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '', saveEnv);
      } else {
        saveEnv();
      }
    });
  } else if (!hasKey) {
    promptForVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '', saveEnv);
  }
} 