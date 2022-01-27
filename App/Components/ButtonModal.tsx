import React from 'react';
import { Button, Modal, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { colors } from '@expo/styleguide';

type ButtonModalProps = {
  isVisible: boolean;
  setIsVisible: () => void;
  getFile: () => void;
  pickImage: () => void;
  setShowCam: () => void;
};

export default function ButtonModal({
  isVisible,
  setIsVisible,
  getFile,
  pickImage,
  setShowCam,
}: ButtonModalProps) {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      presentationStyle="overFullScreen"
      animationType="slide">
      <TouchableWithoutFeedback onPress={setIsVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback style={styles.TouchableOpacity} onPress={() => {}}>
            <View style={styles.modalView}>
              <View style={styles.button}>
                <Button color={colors.white} title="File" onPress={getFile} />
              </View>
              <View style={styles.button}>
                <Button color={colors.white} title="Photos" onPress={pickImage} />
              </View>
              <View style={styles.button}>
                <Button color={colors.white} title="Camera" onPress={setShowCam} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '20%',
    backgroundColor: colors.primary[100],
    borderRadius: 10,
  },
  button: {
    width: '50%',
    margin: 5,
    backgroundColor: colors.primary[400],
    borderRadius: 5,
  },
  TouchableOpacity: {
    width: '100%',
    height: '100%',
  },
});
