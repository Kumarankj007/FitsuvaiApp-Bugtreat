/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {Text, TextInput} from 'react-native';

// Disable font scaling for all Text components
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Disable font scaling for all TextInput components
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const persistor = persistStore(store);

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
));
