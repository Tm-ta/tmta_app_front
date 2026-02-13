/**
 * Gathering App
 * 모임 관리 앱
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorPopupProvider } from './src/components/popup/ErrorPopupProvider';
import { ConfirmProvider } from './src/components/popup/ConfirmProvider';



function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ErrorPopupProvider>
        <ConfirmProvider>
          <RootNavigator />
        </ConfirmProvider>
      </ErrorPopupProvider>
    </SafeAreaProvider>
  );

}

export default App;
