import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import store, {persistor} from './src/redux/store';
import Home from './src/screens/Home';

function LoadingPersisGate() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={30} color="blue" />
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Provider store={store}>
        <PersistGate loading={<LoadingPersisGate />} persistor={persistor}>
          <Home />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
