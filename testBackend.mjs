import { testServices } from './src/utils/testServices.js'; // adjust path if needed

const runTests = async () => {
  console.log('\n🧪 Starting backend service tests...\n');
  const results = await testServices.runAllTests();
  console.log('\n✅ All test results:\n', results);
};

runTests();
