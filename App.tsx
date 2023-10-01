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
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackgroundFetch from 'react-native-background-fetch';
import {ITaskItem} from './src/types/common';

interface ISendNotification {
  fcmToken?: string | null;
  title: string;
  body: string;
}

export const sendNotification = async ({
  fcmToken,
  title,
  body,
}: ISendNotification) => {
  let sendingTo = fcmToken;
  if (!sendingTo) {
    sendingTo = await AsyncStorage.getItem('fcmToken');
    if (!sendingTo) {
      throw Error('need to have fcm token');
    }
  }
  axios.post(
    'https://fcm.googleapis.com/fcm/send',
    {
      to: sendingTo,
      notification: {
        title: title,
        body: body,
      },
    },
    {
      headers: {
        Authorization:
          'key=AAAAPnO6zJc:APA91bFjFl49jZgH2usYOIwxE9a9cehQz23xIGAe30HBZ9RyP0wx1cKWVzOMxYjcUbGhTcdvn8_2Kywcd1sBm1sOTC97-aXH5WCXKB6PenRP48YfQEN1rOkKkn43HlG-53M8LGSaSQAT',
      },
    },
  );
};

const StackNavigator = createStackNavigator();

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
    const initBackgroundFetch = async () => {
      const removePrefix = (taskId: string) => {
        const parts = taskId.split(':');
        if (parts.length > 1) {
          const result = parts.slice(1).join(':');
          return result.trim();
        }
        return null;
      };

      // BackgroundFetch event handler.
      const onEvent = async taskId => {
        console.log('[BackgroundFetch] task: ', taskId);
        // Do your background work...
        if (taskId.includes('add-or-edit-task:')) {
          const jsonValue = removePrefix(taskId);
          if (!jsonValue) {
            return;
          }
          const body = JSON.parse(jsonValue) as ITaskItem;
          console.log({body});
          sendNotification({
            body: body?.description ?? 'todo is up',
            title: body?.title ?? 'todo title',
          });
        }
        // IMPORTANT:  You must signal to the OS that your task is complete.
        BackgroundFetch.finish(taskId);
      };

      const onTimeout = async taskId => {
        console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
        BackgroundFetch.finish(taskId);
      };

      // Initialize BackgroundFetch only once when component mounts.
      let status = await BackgroundFetch.configure(
        {minimumFetchInterval: 15},
        onEvent,
        onTimeout,
      );

      console.log('[BackgroundFetch] configure status: ', status);
    };
    initBackgroundFetch();
  }, []);
  useEffect(() => {
    const start = async () => {
      try {
        const token = await messaging().getToken();
        console.log('fcm token: ', token);
        AsyncStorage.setItem('fcmToken', token);
        // Request permission to show notification for firebase
        messaging().requestPermission();
        messaging().setBackgroundMessageHandler(onMessageReceived);
        messaging().subscribeToTopic('NOTI_USERS').then(onMessageReceived);
      } catch (e) {
        // TODO Log error
      }
    };
    start();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onMessageReceived(remoteMessage);
    });

    return unsubscribe;
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
          <NavigationContainer>
            <StackNavigator.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <StackNavigator.Screen name="taskList" component={Home} />
            </StackNavigator.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
