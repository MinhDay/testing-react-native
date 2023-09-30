export enum IStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export interface ITaskItem {
  id?: string;
  eventId?: string;
  title: string;
  description?: string;
  status: IStatus;
  startTime: Date;
  endTime: Date;
}
