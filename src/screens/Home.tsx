import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../redux/reducers/RootReducer';
import TaskItem from '../components/task/TaskItem';
import {ITaskItem} from '../types/common';
import React, {useState} from 'react';
import TaskActions from '../redux/actions/TaskActions';
import TaskModal from '../components/task/TaskModal';
import ActionsMenu from '../components/task/ActionsMenu';

export enum ModalAction {
  ADD,
  EDIT,
  DELETE,
  NONE,
}

const Home = (): JSX.Element => {
  const {listTask} = useSelector((state: IRootState) => state.task);
  const dispatch = useDispatch();
  const [modalAction, setModalAction] = useState<ModalAction>(ModalAction.NONE);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const createNewTask = (value: ITaskItem) => {
    dispatch(
      TaskActions.createNewTask({
        id: new Date().getTime(),
        title: value.title,
        description: value.description,
        status: value.status,
        startTime: value.startTime,
        endTime: value.endTime,
      }),
    );
    closeModal();
  };

  const editTask = (value: ITaskItem) => {
    dispatch(
      TaskActions.updateTask({
        id: new Date().getTime(),
        title: value.title,
        description: value.description,
        status: value.status,
        startTime: value.startTime,
        endTime: value.endTime,
      }),
    );
    closeModal();
  };

  const deleteTask = () => {
    dispatch(TaskActions.deleteTask());
  };

  const closeModal = () => {
    setModalAction(ModalAction.NONE);
  };

  const selectItem = (item: ITaskItem) => {
    dispatch(TaskActions.setSelectedTask(item));
    setShowMenu(true);
  };

  const renderItem = ({item, index}: {item: ITaskItem; index: number}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectItem(item);
        }}>
        <TaskItem task={item} key={index} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listTask}
        renderItem={renderItem}
        style={styles.tasksWrapper}
        keyExtractor={(item, index) => `${index}_${item.id}`}
      />
      <View style={styles.writeTaskWrapper}>
        <TouchableOpacity
          onPress={() => {
            setModalAction(ModalAction.ADD);
          }}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TaskModal
        modalAction={modalAction}
        onClose={closeModal}
        onSave={values => {
          if (modalAction === ModalAction.ADD) {
            createNewTask(values);
          } else {
            editTask(values);
          }
        }}
      />
      <ActionsMenu
        visible={showMenu}
        onClose={() => {
          setShowMenu(false);
        }}
        onSelectAction={(action: ModalAction) => {
          setShowMenu(false);
          if (action === ModalAction.DELETE) {
            deleteTask();
          } else {
            setTimeout(() => {
              setModalAction(action);
            }, 300);
          }
        }}
      />
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
  modalContainer: {
    minHeight: 60,
    paddingHorizontal: 20,
  },
});
