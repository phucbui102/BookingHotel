// App.tsx
import 'react-native-gesture-handler';
import 'react-native-reanimated'; // Phải nằm ở đầu file

import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {AuthProvider} from './src/context/AuthContext';
import AppTabsNavigator from './src/navigations/AppTabsNavigator';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppTabsNavigator />
          </NavigationContainer>
        </AuthProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
