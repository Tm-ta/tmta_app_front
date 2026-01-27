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

//임시 로그인 페이지 렌더링 확인용
// import { LoginScreen } from './src/screens/auth/LoginScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </SafeAreaProvider>
  );

  // return <LoginScreen />;
}

export default App;
