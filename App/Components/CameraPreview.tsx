import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { colors } from '@expo/styleguide'; // because expo updates their non native colors more often
import { XIcon } from '@expo/styleguide-native';
import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';

type fn = () => void;

type CameraPreviewProps = {
  photo: CameraCapturedPicture;
  retakePicture: fn;
  savePhoto: fn;
  hideCam: fn;
};

export default function CameraPreview({
  photo,
  retakePicture,
  savePhoto,
  hideCam,
}: CameraPreviewProps) {
  return (
    <SafeAreaView style={styles.SafeAreaViewcontainer}>
      <View style={styles.container}>
        <View style={styles.xContainer}>
          <TouchableOpacity style={styles.pressableIcon} onPress={hideCam}>
            <XIcon size={36} color={colors.primary[400]} style={{ marginLeft: '10%' }} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo && photo.uri }} style={styles.image} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={retakePicture} style={styles.Button}>
            <Text style={styles.text}>Re-take</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={savePhoto} style={styles.Button}>
            <Text style={styles.text}>save photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Button: {
    width: 130,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[400],
    margin: '7%',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xContainer: {
    flex: 1,
    height: 100,
    width: '100%',
  },
  pressableIcon: {
    width: 100,
    height: 100,
    flex: 1,
  },
  imageContainer: {
    flex: 5,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  SafeAreaViewcontainer: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
