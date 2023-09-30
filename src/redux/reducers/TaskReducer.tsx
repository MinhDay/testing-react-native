import {ITaskItem} from '../../types/common';
import TaskConstant from '../constants/TaskConstant';

export interface ITaskStore {
  listTask: ITaskItem[];
  selectedTask?: ITaskItem;
}

const initialState: ITaskStore = {
  listTask: [],
  selectedTask: undefined,
};
const TaskReducer = (
  state = initialState,
  action: {type: string; task: ITaskItem},
): ITaskStore => {
  const currentIndex = state.listTask.findIndex(
    item => item?.id === state.selectedTask?.id,
  );
  switch (action.type) {
    case TaskConstant.CREATE_NEW_TASK:
      return {
        ...state,
        listTask: [...state.listTask, action.task],
      };
    case TaskConstant.SET_SELECTED_TASK_ID:
      return {
        ...state,
        selectedTask: action.task,
      };
    case TaskConstant.UPDATE_TASK:
      return {
        ...state,
        listTask: state.listTask.splice(currentIndex, 1, action.task),
      };
    case TaskConstant.DELETE_TASK:
      return {
        ...state,
        listTask: state.listTask.splice(currentIndex, 1),
      };
    case TaskConstant.CLEAR_STORE:
      return initialState;
    default:
      return state;
  }
};

export default TaskReducer;
