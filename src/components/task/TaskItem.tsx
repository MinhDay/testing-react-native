import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ITaskItem} from '../../types/common';
import dayjs from 'dayjs';

interface ITaskItemProps {
  task: ITaskItem;
}

const TaskItem = (props: ITaskItemProps) => {
  const {title, description, status, startTime, endTime} = props.task;

  return (
    <View style={styles.item}>
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDes}>{description}</Text>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={styles.itemTime}>Start time: </Text>
          <Text style={styles.itemTime}>
            {dayjs.unix(startTime.seconds).format('ddd DD/MM HH:mm')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.itemTime}>End time: </Text>
          <Text style={styles.itemTime}>
            {dayjs.unix(endTime.seconds).format('ddd DD/MM HH:mm')}
          </Text>
        </View>
      </View>
      <Text style={styles.itemTitle}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemDes: {
    fontSize: 18,
  },
  itemTime: {
    fontSize: 15,
  },
});

export default TaskItem;
