/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Disable Warning on Emulator
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
