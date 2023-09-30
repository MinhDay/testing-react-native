import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
  View,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import store, {persistor} from './src/redux/store';
import Home from './src/screens/Home';

import notifee from '@notifee/react-native';

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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onMessageReceived(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const start = async () => {
      try {
        const token = await messaging().getToken();
        console.log('token', token);
        // Request permission to show notification for firebase
        messaging().requestPermission();
        messaging().onMessage(async remoteMessage => {
          onMessageReceived(remoteMessage);
        });
        messaging().setBackgroundMessageHandler(onMessageReceived);
        messaging().subscribeToTopic('NOTI_USERS').then(onMessageReceived);
      } catch (e) {
        // TODO Log error
      }
    };
    start();

    return () => {};
  }, []);

  async function onMessageReceived(message: any) {
    await notifee.requestPermission();

    if (message && message.notification) {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  }

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
