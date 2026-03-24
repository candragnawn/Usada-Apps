console.warn('🚀🚀🚀 [BOOT] index.js EVALUATING LINE 1');
import { registerRootComponent } from 'expo';
import AppNavigator from './app/index';

const originalHandler = global.ErrorUtils.getGlobalHandler();
global.ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('🔴🔴🔴 GLOBAL ERROR CAUGHT:', error.message, error.stack);
  originalHandler(error, isFatal);
});

console.warn('🚀🚀🚀 index.js: Registering root component...');
registerRootComponent(AppNavigator);



