import {View, Text, ScrollView, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  getsMonth,
  fontScalling,
  scrnWidth,
  print,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../redux/titleSlice';
import YoutubeIframe from 'react-native-youtube-iframe';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useShowToast} from '../../components/Toast/ToastAlert';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

const CourseDetail = ({navigation, route}) => {
  const {courseDetail, youtubeId} = route.params;
  const appColor = appColors();
  const {styles} = useStyle();
  const showToast = useShowToast();

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
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            borderRadius: 10,
            paddingBottom: widthResponse ? 90 : 120,
          }}>
          {/* iframe */}
          {youtubeId && youtubeId != '' && (
            <Pressable style={styles.img_view}>
              <YoutubeIframe
                webViewStyle={{borderRadius: widthResponse ? 10 : 20}}
                play={false}
                height={widthResponse ? 200 : scrnWidth / 2}
                width={'100%'}
                videoId={youtubeId}
              />
            </Pressable>
          )}
          {/* content */}
          {courseDetail.description && courseDetail.description != '' && (
            <HtmlView url={courseDetail.description} padding={40} />
          )}
          {/* primary button */}
          {courseDetail?.pdf && courseDetail.pdf != '' && (
            <PrimaryButton
              onPress={() => {
                downloadFile(courseDetail?.pdf);
              }}
              download
              altStyle={{paddingVertical: widthResponse ? 10 : 20}}
              Title={'download pdf'}
            />
          )}
        </ScrollView>
      </View>
    </MainCard>
  );
};

export default CourseDetail;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
    img_view: {
      width: '100%',
      marginBottom: widthResponse ? 20 : 30,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    baby_yellow: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(1.9),
      color: appColor.themeYellow,
      marginBottom: widthResponse ? 10 : 15,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.5),
      color: appColor.textBlack,
    },
    content: {
      marginTop: widthResponse ? 25 : 30,
      paddingHorizontal: 7,
    },
  });

  return {styles};
};
