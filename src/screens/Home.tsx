import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../redux/reducers/RootReducer';
import TaskItem from '../components/Task/TaskItem';
import {IStatus, ITaskItem} from '../types/common';
import React from 'react';
import TaskActions from '../redux/actions/TaskActions';

const Home = (): JSX.Element => {
  const {listTask} = useSelector((state: IRootState) => state.task);
  const dispatch = useDispatch();

  const createNewTask = () => {
    dispatch(
      TaskActions.createNewTask({
        id: '1',
        title: 'Title',
        description: 'Description',
        status: IStatus.TODO,
        startTime: new Date(),
        endTime: new Date(),
      }),
    );
  };

  console.log(listTask);

  const renderItem = ({item, index}: {item: ITaskItem; index: number}) => {
    return <TaskItem task={item} key={index} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listTask}
        renderItem={renderItem}
        style={styles.tasksWrapper}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TouchableOpacity onPress={createNewTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
