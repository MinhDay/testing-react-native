import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ITaskItem} from '../../types/common';

interface ITaskItemProps {
  task: ITaskItem;
}

const TaskItem = (props: ITaskItemProps) => {
  const {title, description, status} = props.task;
  return (
    <View style={styles.item}>
      <View style={{maxWidth: '80%'}}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDes}>{description}</Text>
      </View>
      <Text>{status}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemDes: {
    fontSize: 18,
  },
});

export default TaskItem;
