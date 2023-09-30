import BottomSheetModal from '../bottom-sheet';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ModalAction} from '../../screens/Home';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik} from 'formik';
import {IStatus, ITaskItem} from '../../types/common';
import SelectDropdown from 'react-native-select-dropdown';
import {FormikProps} from 'formik/dist/types';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/reducers/RootReducer';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';

interface TaskModalProps {
  modalAction: ModalAction;
  onClose: () => void;
  onSave: (value: ITaskItem) => void;
}

const defaultValue: ITaskItem = {
  title: '',
  description: '',
  status: IStatus.TODO,
  startTime: new Date(),
  endTime: new Date(),
};

const TaskModal = ({
  modalAction,
  onClose,
  onSave,
}: TaskModalProps): JSX.Element => {
  const {selectedTask} = useSelector((state: IRootState) => state.task);

  const formRef = useRef<FormikProps<ITaskItem>>(null);
  const [initialValues, setInitialValues] = useState<ITaskItem>(defaultValue);
  const [datePickerVisible, setDatePickerVisible] = useState<
    'start' | 'end' | undefined
  >(undefined);

  useEffect(() => {
    if (modalAction === ModalAction.NONE) {
      setInitialValues(defaultValue);
    } else if (modalAction === ModalAction.EDIT) {
      setInitialValues({
        ...selectedTask,
        startTime: dayjs.unix(selectedTask?.startTime.seconds).toDate(),
        endTime: dayjs.unix(selectedTask?.endTime.seconds).toDate(),
      } as ITaskItem);
    }
  }, [modalAction, selectedTask]);

  const modalTitle = useMemo(() => {
    switch (modalAction) {
      case ModalAction.ADD:
        return 'Add task';
      case ModalAction.EDIT:
        return 'Edit task';
      default:
        return;
    }
  }, [modalAction]);

  return (
    <BottomSheetModal
      isVisible={[ModalAction.ADD, ModalAction.EDIT].includes(modalAction)}
      onModalHide={onClose}
      onBackdropPress={onClose}
      showIndicatorLine={false}
      useSafeArea
      children={
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView scrollEnabled>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Formik<ITaskItem>
              initialValues={initialValues}
              onSubmit={onSave}
              innerRef={formRef}
              enableReinitialize>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
              }) => (
                <View>
                  <View style={styles.formItems}>
                    <Text style={styles.label}>Title:</Text>
                    <TextInput
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values?.title}
                      style={styles.inputContainer}
                    />
                  </View>
                  <View style={styles.formItems}>
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values?.description}
                      style={styles.inputContainer}
                    />
                  </View>
                  <View style={styles.formItems}>
                    <Text style={styles.label}>Status:</Text>
                    <SelectDropdown
                      buttonStyle={styles.inputContainer}
                      data={
                        modalAction === ModalAction.ADD
                          ? [IStatus.TODO]
                          : [IStatus.TODO, IStatus.DOING, IStatus.DONE]
                      }
                      onSelect={selectedItem => {
                        setFieldValue('status', selectedItem);
                      }}
                      defaultValue={values?.status}
                    />
                  </View>
                  <View style={styles.formItems}>
                    <Text style={styles.label}>Start time:</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDatePickerVisible('start');
                      }}>
                      <TextInput
                        style={styles.inputContainer}
                        editable={false}
                        value={dayjs(values.startTime).format(
                          'ddd DD/MM HH:mm',
                        )}
                      />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      title="Select start time"
                      androidVariant="iosClone"
                      open={datePickerVisible === 'start'}
                      date={values.startTime}
                      onConfirm={date => {
                        setFieldValue('startTime', date);
                        setFieldValue(
                          'endTime',
                          dayjs(date).add(1, 'day').toDate(),
                        );
                        setDatePickerVisible(undefined);
                      }}
                      onCancel={() => {
                        setDatePickerVisible(undefined);
                      }}
                    />
                  </View>
                  <View style={styles.formItems}>
                    <Text style={styles.label}>End time:</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDatePickerVisible('end');
                      }}>
                      <TextInput
                        style={styles.inputContainer}
                        editable={false}
                        value={dayjs(values.endTime).format('ddd DD/MM HH:mm')}
                      />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      title="Select end time"
                      androidVariant="iosClone"
                      open={datePickerVisible === 'end'}
                      date={values.endTime}
                      onConfirm={date => {
                        setFieldValue('endTime', date);
                        setDatePickerVisible(undefined);
                      }}
                      minimumDate={values.startTime}
                      onCancel={() => {
                        setDatePickerVisible(undefined);
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.btnSubmit}
                    onPress={() => handleSubmit()}
                    disabled={!values.title}>
                    <Text
                      style={{fontWeight: '700', color: 'white', fontSize: 18}}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      }
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 400,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  formItems: {
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5,
  },
  inputContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  btnSubmit: {
    marginTop: 10,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#436aee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TaskModal;
