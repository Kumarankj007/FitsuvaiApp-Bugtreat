import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import Voice from '@react-native-voice/voice';
import appColors from './appColors';
// import VoiceRecordCard from '../components/Card/VoiceRecordCard';
import {useDispatch} from 'react-redux';
import {setVoicetext} from '../redux/SettingSlice';
import {permissionAlert, print} from './helperFunction';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const useVoiceRecognition = () => {
  const [started, setStarted] = useState(false);
  const [voiceModal, setVoiceModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [pitch, setPitch] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [emptySearch, setEmptySearch] = useState(false);

  const dispatch = useDispatch();
  const appColor = appColors();

  const onSpeechStart = useCallback(e => {
    setStarted(true);
    console.log('onSpeechStart: ', e);
  }, []);

  const onSpeechRecognized = useCallback(e => {
    setRecognized('√');
  }, []);

  const onSpeechEnd = useCallback(e => {
    setStarted(false);
    setIsCompleted(true);
    console.log('onSpeechEnd: ', e);
  }, []);

  const onSpeechError = useCallback(e => {
    setError(JSON.stringify(e.error));
  }, []);

  const onSpeechResults = useCallback(
    e => {
      print(e.value[0], 'onSpeechResults');
      dispatch(setVoicetext(e.value));
      setResults(e.value);
    },
    [dispatch],
  );

  const onSpeechPartialResults = useCallback(
    e => {
      setPartialResults(e.value);
      dispatch(setVoicetext(e.value));
    },
    [dispatch],
  );

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [
    onSpeechStart,
    onSpeechRecognized,
    onSpeechEnd,
    onSpeechError,
    onSpeechResults,
    onSpeechPartialResults,
  ]);

  const startRecognizing = useCallback(async () => {
    try {
      console.log(started, 'start');
      if (started) return; // Prevent duplicate calls
      // resetStates();
      const isGranted = await requestPermission();
      // console.log(isGranted, 'isGranted');
      if (isGranted && isGranted !== 'settings') {
        setRecognized('');
        setPitch('');
        setError('');
        setStarted(true);
        setResults([]);
        setPartialResults([]);
        setIsCompleted(false);
        setVoiceModal(true);
        await Voice.start('en-US');
      }
    } catch (e) {
      console.error(e);
    }
  }, [started]);

  const requestPermission = async () => {
    try {
      if (Platform.OS == 'ios') {
        return check(PERMISSIONS.IOS.MICROPHONE)
          .then(status => {
            switch (status) {
              case RESULTS.DENIED:
                console.log(RESULTS.DENIED);
                return request(PERMISSIONS.IOS.MICROPHONE).then(response => {
                  console.log(response, 'response');
                  if (RESULTS.GRANTED == response) {
                    return true;
                  } else {
                    return false;
                  }
                });
              // return false;
              case RESULTS.BLOCKED:
                console.log(RESULTS.BLOCKED, 'mic');
                permissionAlert('Microphone');
                return 'settings';
              case RESULTS.GRANTED:
                console.log(RESULTS.GRANTED);
                return true;
              default:
                console.log('default');
                return false;
            }
          })
          .catch(e => console.log(e, 'err'));
      }

      // print(isGranted, 'isGranted');
      if (Platform.OS == 'android') {
        const isGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (isGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission granted for Android');
          return true;
        } else if (isGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Permission permanently denied for Android');
          Alert.alert(
            'Permission Required',
            `MicroPhone permission is required. Please enable it in the app settings.`,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return 'settings';
        } else {
          Alert.alert(
            'Permission Required',
            `MicroPhone permission is required. Please enable it in the app settings.`,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          console.log('Permission denied for Android');
          return false;
        }
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetStates();
  };

  // const VoiceRecordModal = () => {
  //   return (
  //     <VoiceRecordCard
  //       voiceModal={voiceModal}
  //       setVoiceModal={setVoiceModal}
  //       started={started}
  //       isCompleted={isCompleted}
  //       results={results}
  //     />
  //   );
  // };

  const checkPermission = async () => {
    if (Platform.OS == 'android') {
      const microPhonePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return microPhonePermission;
    } else if (Platform.OS == 'ios') {
      return check(PERMISSIONS.IOS.MICROPHONE)
        .then(status => {
          switch (status) {
            case RESULTS.DENIED:
              console.log(RESULTS.DENIED);
              return request(PERMISSIONS.IOS.MICROPHONE).then(response => {
                console.log(response, 'response');
                if (RESULTS.GRANTED == response) {
                  return true;
                } else {
                  return false;
                }
              });
            case RESULTS.BLOCKED:
              console.log(RESULTS.BLOCKED);
              // permissionAlert('Microphone');
              return false;
            case RESULTS.GRANTED:
              console.log(RESULTS.GRANTED);
              return true;
            default:
              console.log('default');
              return false;
          }
        })
        .catch(e => console.log(e, 'err'));
    }
  };

  const resetStates = () => {
    dispatch(setVoicetext([]));
    setRecognized('');
    setPitch('');
    setError('');
    setStarted('');
    // setResults([]);
    setPartialResults([]);
  };

  return {
    started,
    recognized,
    error,
    results,
    partialResults,
    pitch,
    voiceModal,
    setVoiceModal,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
    resetStates,
    requestPermission,
    // VoiceRecordModal,
    setPermissionModal,
    permissionModal,
    checkPermission,
    isCompleted,
    setIsCompleted,
    emptySearch,
    setEmptySearch,
    setStarted,
  };
};

export default useVoiceRecognition;

const styles = StyleSheet.create({});
