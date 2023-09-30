import {StyleSheet} from 'react-native';
import {BottomSheetModalStyles} from '.';

const defaultBottomSheetTheme: BottomSheetModalStyles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  containerStyle: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#F5F5F5',
  },
  contentContainerStyle: {
    justifyContent: 'center',
  },
  indicatorLine: {
    height: 2,
    width: '15%',
    backgroundColor: '#C5C5C5',
    marginTop: 16,
    alignSelf: 'center',
    borderRadius: 40,
  },
});

export default defaultBottomSheetTheme;
