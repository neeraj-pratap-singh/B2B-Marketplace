async function globalTeardown(config) {
  console.log('🧹 Cleaning up E2E test environment...');
  
  try {
    // Any cleanup operations would go here
    // For example, clearing test data, stopping services, etc.
    
    console.log('✅ E2E test environment cleaned up');
  } catch (error) {
    console.error('❌ Failed to cleanup E2E environment:', error);
    // Don't throw here to avoid failing the test run
  }
}

module.exports = globalTeardown; 