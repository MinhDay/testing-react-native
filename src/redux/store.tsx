import {createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootReducer from './reducers/RootReducer';

const persistConfig = {
  key: 'state',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = createStore(persistedReducer);

export const persistor = persistStore(store);

export default store;
