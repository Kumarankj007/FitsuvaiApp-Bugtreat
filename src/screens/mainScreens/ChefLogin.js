import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {setTermsPage} from '../../redux/titleSlice';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import {scrnHeight, widthResponse} from '../../utilities/helperFunction';

const ChefLogin = ({route}) => {
  const [load, setLoad] = useState(true);
  const url = route && route.params && route.params.url ? route.params.url : '';
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  // console.log(url, 'url')

  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
      // setTimeout(() => {}, 100);
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
    setTimeout(() => {
      setLoad(false);
    }, 1111);
  }, [isFocus]);

  if (load) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <LottieView
          autoPlay={true}
          style={{width: 200, height: 200, top: 5}}
          source={require('../../../assets/lottieFiles/load.json')}
        />
      </View>
    );
  }

  // download file:
  const downloadFile = async url => {
    try {
      const fileName = `${courseDetail.name} Invioce pdf.pdf`;
      let dirs = RNBlobUtil.fs.dirs;
      RNBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
        path: `${dirs.DocumentDir}/${fileName}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'File downloaded by download manager.',
          mime: 'application/pdf',
        },
      })
        .fetch('GET', url)
        .then(res => {
          // print(res, 'res');
          if (Platform.OS === 'ios') {
            const filepath = res.path();
            let options = {
              type: 'application/pdf',
              url: filepath,
              saveToFiles: true,
            };
            Share.open(options)
              .then(resp => {
                print(resp, 'response');
              })
              .catch(err => {
                err && console.log(err, 'err');
              });
          }
          showToast('success', 'Invoice Download', 'Download success', 2000);
        })
        .catch(err => console.log('BLOB ERROR -> ', err));
    } catch (e) {
      console.log(e, 'err');
    }
  };

  return (
    <>
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        downloadingMessage="file downloading"
        allowUniversalAccessFromFileURLs={true}
        allowingReadAccessToURL={true}
        mixedContentMode={'always'}
        onFileDownload={({nativeEvent}) => {
          // downloadFile(downloadUrl);
          console.log(nativeEvent, 'downloadUrl');
        }}
      />
    </>
  );
};

export default ChefLogin;

const styles = StyleSheet.create({});
