import React, {ReactNode} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import defaultBottomSheetTheme from './theme';

const deviceHeight = Dimensions.get('window').height;
export type BottomSheetModalStyles = {
  modalStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  indicatorLine?: StyleProp<ViewStyle>;
};

export type BottomSheetModalProps = {
  isVisible?: boolean;
  children: ReactNode;
  useSafeArea?: boolean;
  backdropOpacity?: number;
  style?: BottomSheetModalStyles;
  animationIn?: 'fadeIn' | 'slideInUp' | 'zoomIn' | 'slideInRight';
  animationOut?: 'fadeOut' | 'slideOutDown' | 'zoomOut' | 'slideOutRight';
  animationInTiming?: number;
  animationOutTiming?: number;
  avoidKeyboard?: boolean;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  onModalHide?: () => void;
  showIndicatorLine?: boolean;
};

const BottomSheetModal = (props: BottomSheetModalProps) => {
  const {
    children,
    backdropOpacity,
    useSafeArea,
    showIndicatorLine = true,
    ...restProps
  } = props;

  const styles = defaultBottomSheetTheme;

  return (
    <Modal
      deviceHeight={deviceHeight}
      backdropTransitionInTiming={50}
      backdropTransitionOutTiming={50}
      hideModalContentWhileAnimating
      useNativeDriverForBackdrop
      useNativeDriver
      backdropOpacity={backdropOpacity}
      style={styles.modalStyle}
      avoidKeyboard
      {...restProps}>
      <View style={styles.containerStyle}>
        {useSafeArea ? (
          <SafeAreaView style={styles.contentContainerStyle}>
            {showIndicatorLine ? <View style={styles.indicatorLine} /> : null}
            {children}
          </SafeAreaView>
        ) : (
          <View style={styles.contentContainerStyle}>
            {showIndicatorLine ? <View style={styles.indicatorLine} /> : null}
            {children}
          </View>
        )}
      </View>
    </Modal>
  );
};

BottomSheetModal.defaultProps = {
  isVisible: false,
  backdropOpacity: 0.5,
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  useSafeArea: true,
};

export default BottomSheetModal;
