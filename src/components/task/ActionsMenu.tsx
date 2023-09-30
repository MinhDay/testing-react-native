import BottomSheetModal from '../bottom-sheet';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ModalAction} from '../../screens/Home';

interface ActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (value: ModalAction) => void;
}

const ActionsMenu = ({
  visible,
  onClose,
  onSelectAction,
}: ActionsModalProps): JSX.Element => {
  return (
    <BottomSheetModal
      isVisible={visible}
      onModalHide={onClose}
      onBackdropPress={onClose}
      showIndicatorLine={false}
      useSafeArea
      children={
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              onSelectAction(ModalAction.EDIT);
            }}
            style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelectAction(ModalAction.DELETE);
            }}
            style={styles.menuItem}>
            <Text style={styles.menuText}>Delete</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 120,
    paddingHorizontal: 30,
    marginBottom: 20,
    marginTop: 20,
  },
  menuItem: {
    marginTop: 10,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgb(225,238,252)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontWeight: '600',
    fontSize: 18,
  },
});

export default ActionsMenu;
