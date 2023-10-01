import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../redux/reducers/RootReducer';
import TaskItem from '../components/task/TaskItem';
import {ITaskItem} from '../types/common';
import React, {useEffect, useState} from 'react';
import TaskActions from '../redux/actions/TaskActions';
import TaskModal from '../components/task/TaskModal';
import ActionsMenu from '../components/task/ActionsMenu';
import {firebase, firebaseConfig} from '../../config';
import dayjs from 'dayjs';
import RNCalendarEvents from 'react-native-calendar-events';
import BackgroundFetch from 'react-native-background-fetch';

export enum ModalAction {
  ADD,
  EDIT,
  DELETE,
  NONE,
}

firebase.initializeApp(firebaseConfig);

const Home = (): JSX.Element => {
  const {listTask, selectedTask} = useSelector(
    (state: IRootState) => state.task,
  );
  const dispatch = useDispatch();
  const [modalAction, setModalAction] = useState<ModalAction>(ModalAction.NONE);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [calendarId, setCalendarId] = useState<string>();

  const todoRef = firebase.firestore().collection('todos');

  useEffect(() => {
    RNCalendarEvents.checkPermissions(false)
      .then(permission => {
        if (permission !== 'authorized') {
          RNCalendarEvents.requestPermissions(false)
            .then(perRes => {
              console.log('get per res', perRes);
              Alert.alert(
                "You should grant access to your calendar to fully utilize the app's features",
                '',
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      BackHandler.exitApp();
                    },
                  },
                ],
              );
            })
            .catch(perErr => {
              console.log('get per err', perErr);
            });
        }
      })
      .catch(err => {
        console.log('check per err', err);
      });

    RNCalendarEvents.findCalendars().then(list => {
      const todoCalendar = list.find(item => item.title === 'TODO List');
      if (!todoCalendar) {
        RNCalendarEvents.saveCalendar({
          allowedAvailabilities: ['busy', 'free'],
          allowsModifications: true,
          color: '#b91639',
          isPrimary: false,
          title: 'TODO List',
          name: 'TODO List',
          accessLevel: '1',
          type: 'com.google',
          // personal email
          source: {name: 'todo_list', isLocalAccount: true},
          ownerAccount: 'todo_list',
        });
      } else {
        setCalendarId(todoCalendar.id);
      }
    });
    todoRef.orderBy('startTime', 'desc').onSnapshot(querystring => {
      const todos: ITaskItem[] = [];
      querystring.forEach(doc => {
        const {title, description, status, startTime, endTime, eventId} =
          doc.data();
        todos.push({
          id: doc.id,
          title,
          description,
          status,
          startTime,
          endTime,
          eventId,
        });
      });

      dispatch(TaskActions.setList(todos));
    });
  }, []);

  const createNewTask = (value: ITaskItem) => {
    const newData = {
      id: dayjs().unix().toString(),
      title: value.title,
      description: value.description,
      status: value.status,
      startTime: value.startTime,
      endTime: value.endTime,
    };

    RNCalendarEvents.saveEvent(newData.title, {
      calendarId: calendarId,
      startDate: new Date(newData.startTime).toISOString(),
      endDate: new Date(newData.endTime).toISOString(),
      description: newData.description,
    })
      .then(res => {
        todoRef
          .add({...newData, eventId: res})
          .then(() => {
            // dispatch(TaskActions.createNewTask(newData));
          })
          .catch(err => {
            Alert.alert(err);
          });
      })
      .catch(err => {
        console.log('create cal error', err);
      });

    closeModal();
  };

  const editTask = (value: ITaskItem) => {
    const newData = {
      id: selectedTask?.id,
      title: value.title,
      description: value.description,
      status: value.status,
      startTime: value.startTime,
      endTime: value.endTime,
    };
    RNCalendarEvents.saveEvent(newData.title, {
      id: selectedTask?.eventId,
      calendarId: calendarId,
      startDate: new Date(newData.startTime).toISOString(),
      endDate: new Date(newData.endTime).toISOString(),
      description: newData.description,
    })
      .then(res => {
        todoRef
          .doc(selectedTask?.id)
          .update({...newData, eventId: res})
          .then(() => {
            // dispatch(TaskActions.updateTask(newData));
            Alert.alert('Update successfully');
          })
          .catch(err => {
            Alert.alert(err);
          });
      })
      .catch(err => {
        console.log('update cal error', err);
      });

    closeModal();
  };

  const deleteTask = () => {
    RNCalendarEvents.removeEvent(selectedTask?.eventId as string)
      .then(() => {
        todoRef
          .doc(selectedTask?.id)
          .delete()
          .then(() => {
            // dispatch(TaskActions.deleteTask());
            Alert.alert('Delete successfully');
          })
          .catch(err => {
            Alert.alert(err);
          });
      })
      .catch(err => {
        console.log('delete cal error', err);
      });
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
          const calculateMillisecondsFiveMinutesBefore = inputDate => {
            const targetDate = dayjs(inputDate);

            // Get the current date and time using dayjs
            const currentDate = dayjs();

            // Calculate the difference in milliseconds
            const millisecondsDifference = targetDate.diff(currentDate);

            return millisecondsDifference > 300000
              ? millisecondsDifference
              : 5000;
          };
          if (modalAction === ModalAction.ADD) {
            createNewTask(values);
          } else {
            editTask(values);
          }
          BackgroundFetch.scheduleTask({
            taskId: 'add-or-edit-task:' + JSON.stringify(values),
            forceAlarmManager: true,
            delay: calculateMillisecondsFiveMinutesBefore(values.endTime), // <-- milliseconds
            enableHeadless: true,
            stopOnTerminate: false,
          }).then(r => console.log('schedule task result: ', r));
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
