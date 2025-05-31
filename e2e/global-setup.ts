const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Setting up E2E test environment...');
  
  try {
    console.log('✅ E2E test environment ready');
    
  } catch (error) {
    console.error('❌ Failed to setup E2E environment:', error);
    throw error;
  }
}

module.exports = globalSetup; 