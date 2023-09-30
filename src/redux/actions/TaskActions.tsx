import {ITaskItem} from '../../types/common';
import TaskConstant from '../constants/TaskConstant';

export default {
  setList: (list: ITaskItem[]): {type: string; list: ITaskItem[]} => {
    return {
      type: TaskConstant.SET_LIST,
      list,
    };
  },
  createNewTask: (task: ITaskItem): {type: string; task: ITaskItem} => {
    return {
      type: TaskConstant.CREATE_NEW_TASK,
      task,
    };
  },
  updateTask: (newTask: ITaskItem): {type: string; task: ITaskItem} => {
    return {
      type: TaskConstant.UPDATE_TASK,
      task: newTask,
    };
  },
  setSelectedTask: (task: ITaskItem): {type: string; task: ITaskItem} => {
    return {
      type: TaskConstant.SET_SELECTED_TASK,
      task,
    };
  },
  deleteTask: (): {type: string} => {
    return {
      type: TaskConstant.DELETE_TASK,
    };
  },
  clearList: (): {type: string} => {
    return {
      type: TaskConstant.CLEAR_STORE,
    };
  },
};
