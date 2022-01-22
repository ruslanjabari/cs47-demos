import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Switch,
} from 'react-native';
import {
  TapGestureHandler,
  RotationGestureHandler,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import { colors, theme } from '@expo/styleguide';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import TcpSockets from 'react-native-tcp-socket';
import * as FileSystem from 'expo-file-system';

const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}>
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default function App() {
  const [pressableStyle, setPressableStyle] = useState(styles.pressableDefault);
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<Boolean>(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCam, setShowCam] = useState<Boolean>(false);
  const [isClient, setIsClient] = useState<Boolean>(true);
  const [isBounce, setIsBounce] = useState<Boolean>(false);
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
    // need to establish initial connection with websocket
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (e) {}
    })();
  }, []);

  let socket: TcpSockets.Socket;

  useEffect(() => {
    // initate 3 tcp sockets in true browser fashion
    switch (isClient) {
      case false:
        socket = TcpSockets.createConnection({ port: 8080, host: '10.29.100.151' }, () => {});
        return;
      default:
        return;
    }
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // alert(JSON.stringify(result));
      setImage(result.uri);
    }
  };

  const getFile = async () => {
    const fileObj = await DocumentPicker.getDocumentAsync();
    if (fileObj.type === 'success') {
      alert(JSON.stringify(fileObj));
    }
    let imageFromDisk = await FileSystem.readAsStringAsync(fileObj.uri);
    // tcp connection limited to 1024 bytes
    while (imageFromDisk) {
      if (imageFromDisk.length > 1024) {
        socket.write(imageFromDisk.slice(0, 1023));
        imageFromDisk = imageFromDisk.slice(1023);
      } else {
        socket.write(imageFromDisk.slice(0, imageFromDisk.length));
      }
    }
  };
  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    alert(JSON.stringify(photo));
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const __savePhoto = async () => {
    // have to write image to disk then send to server
    // const imageFromDisk = RNFS.readFile(capturedImage.uri, 'base64'); // returns a promise
    // const imageFromDisk = await FileSystem.readAsStringAsync(capturedImage.uri);
    // alert(imageFromDisk);
  };

  let camera: Camera;
  const Cam = () => (
    <Camera
      type={type}
      style={{ flex: 1, width: '100%' }}
      ref={(r) => {
        if (r) camera = r;
      }}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          padding: 20,
          marginBottom: 20,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={__takePicture}
            style={{
              width: 70,
              height: 70,
              bottom: 0,
              borderRadius: 50,
              backgroundColor: '#fff',
            }}
          />
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
          />
        ) : (
          <Cam />
        )
      ) : (
        <>
          <Modal
            transparent={true}
            visible={isVisible}
            presentationStyle="overFullScreen"
            animationType="slide">
            <TouchableWithoutFeedback onPress={() => setIsVisible(!isVisible)}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => {}}>
                  <View style={styles.modalView}>
                    <View style={styles.button}>
                      <Button color={colors.primary[400]} title="File" onPress={getFile} />
                    </View>
                    <View style={styles.button}>
                      <Button color={colors.primary[400]} title="Photos" onPress={pickImage} />
                    </View>
                    <View style={styles.button}>
                      <Button
                        color={colors.primary[400]}
                        title="Camera"
                        onPress={() => setShowCam(true)}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginRight: 16 }}>
                {isClient ? 'Client' : 'Server'}
              </Text>
              <Switch
                style={{ height: 40, width: 40 }}
                trackColor={{ false: '#767577', true: colors.primary[200] }}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => setIsClient(value)}
                value={isClient}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginRight: 16 }}>
                Bounce?
              </Text>
              <Switch
                style={{ height: 40, width: 40 }}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => setIsBounce(value)}
                value={isBounce}
              />
            </View>
          </View>
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
// const LongPressButton = () => (
//   <LongPressGestureHandler
//     onHandlerStateChange={({ nativeEvent }) => {
//       if (nativeEvent.state === State.ACTIVE) {
//         Alert.alert("I'm being pressed for so long");
//       }
//     }}
//     minDurationMs={800}>
//     <View style={styles.box} />
//   </LongPressGestureHandler>
// );

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
    backgroundColor: colors.primary[200],
    borderRadius: 5,
  },
});
