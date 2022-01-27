import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, TouchableOpacity } from 'react-native';
import { colors } from '@expo/styleguide';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { CameraPreview, ButtonModal /*, SwitchHeader */ } from './App/Components';

export default function App() {
  const [pressableStyle, setPressableStyle] = useState(styles.pressableDefault);
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const type = Camera.Constants.Type.back;
  const [showCam, setShowCam] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        try {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        } catch (e) {}
      }
    })();
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (e) {}
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const sendImageViaPOST = async () => {
    const url = ''; /* fill in during lec */
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // because our image is converted to a (base64) string
      },
      body: image,
    });
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const getFile = async () => {
    try {
      const fileObj: DocumentPicker.DocumentResult = await DocumentPicker.getDocumentAsync();
      if (fileObj.type === 'success') {
        alert(JSON.stringify(fileObj));
      }
      const { uri } = fileObj as unknown as ImagePicker.ImageInfo;
      let imageFromDisk = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage(imageFromDisk);
    } catch (err) {
      alert(err);
    }
  };
  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const __savePhoto = async () => {
    // get image
    // have to write image to disk then send to server
    // const imageFromDisk = RNFS.readFile(capturedImage.uri, 'base64'); // returns a promise, unsupported via Expo
    // const imageFromDisk = await FileSystem.readAsStringAsync(capturedImage.uri);
  };

  const __hideCam = async () => {
    setShowCam(false);
  };

  let camera: Camera;
  const Cam = () => (
    <Camera
      type={type}
      style={styles.cam}
      ref={(r) => {
        if (r) camera = r;
      }}>
      <View style={styles.camContainer}>
        <View style={styles.camButtonContainer}>
          <TouchableOpacity onPress={__takePicture} style={styles.camButton} />
        </View>
      </View>
    </Camera>
  );

  return (
    <View style={styles.container}>
      {showCam ? (
        previewVisible && capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            savePhoto={__savePhoto}
            retakePicture={__retakePicture}
            hideCam={__hideCam}
          />
        ) : (
          <Cam />
        )
      ) : (
        <>
          <ButtonModal
            isVisible={isVisible}
            setIsVisible={() => setIsVisible(!isVisible)}
            getFile={getFile}
            pickImage={pickImage}
            setShowCam={() => setShowCam(!showCam)}
          />
          {/* <SwitchHeader /> */}
          <View style={styles.upload}>
            <Pressable
              style={pressableStyle}
              onPressIn={() => setPressableStyle(styles.pressableIn)}
              onPressOut={() => setPressableStyle(styles.pressableDefault)}
              onPress={getFile}
              onLongPress={() => {
                setIsVisible(true);
                setPressableStyle(styles.pressableLongIn);
              }}>
              <Text style={styles.text}>Upload file</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 5,
    width: '50%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableDefault: {
    backgroundColor: colors.primary[100],
    width: '75%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  pressableIn: {
    backgroundColor: colors.primary[100],
    width: '70%',
    height: '18%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  pressableLongIn: {
    backgroundColor: colors.primary[100],
    width: '65%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontWeight: '500',
  },
  camButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  camButtonContainer: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
  camContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  cam: {
    flex: 1,
    width: '100%',
  },
});
