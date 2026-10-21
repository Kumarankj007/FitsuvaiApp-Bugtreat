import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  print,
  scrnWidth,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
// import LoaderKit from 'react-native-loader-kit';
import YoutubeIframe from 'react-native-youtube-iframe';
import {setAltTitle} from '../../redux/titleSlice';
import {useDispatch} from 'react-redux';
import {url} from '../../utilities/appApi';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {GeneralCourseShimmer} from '../../utilities/appShimmer';
import FastImage from 'react-native-fast-image';

const CourseOverview = ({navigation, route}) => {
  const {catId} = route.params;
  const appColor = appColors();
  const dispatch = useDispatch();
  const {styles} = useStyle();

  // state:
  const [courseOverview, setCourseOverview] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // print(courseOverview.data[2].name, 'courseOverview');

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setCourseOverview(prevData => ({
      data: prevData.data,
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    }));
    setAltStart(0);
    setRefresh(true);
  }, []);
  useEffect(() => {
    if (refresh) {
      apiCall();
    }
  }, [refresh]);

  // pagination:
  const paging = () => {
    setAltStart(Number(courseOverview.start) + Number(courseOverview.limit));
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('catId', catId);
      formData.append('start', altStart);

      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (courseOverview.data.length == 0) {
        setLoad(true);
      }

      // get the response:
      const response = await fetch(url().course, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setCourseOverview(prevdata => {
            return {
              data: refresh
                ? resparse.data.courseOverview
                : [...prevdata.data, ...resparse.data.courseOverview],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prevdata.page + 1),
            };
          });
        }
      } else {
        console.log('Course Overiview status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error Course overview');
      setRefresh(false);
      setLoad(false);
    }
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        {!load ? (
          <>
            {courseOverview?.data?.length > 0 ? (
              <>
                <FlatList
                  data={courseOverview.data}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatlist}
                  numColumns={2}
                  ItemSeparatorComponent={() => {
                    return <View style={{padding: widthResponse ? 7 : 12}} />;
                  }}
                  ListFooterComponent={() => {
                    return (
                      <>
                        {courseOverview.page != courseOverview.totalPages && (
                          <BallWithSpin
                            duration={1000}
                            containerStyle={{
                              width: widthResponse ? 40 : 70,
                              height: widthResponse ? 40 : 70,
                              zIndex: 10,
                              alignSelf: 'center',
                              marginTop: widthResponse ? 20 : 30,
                              marginVertical: widthResponse ? 0 : 30,
                            }}
                            imgStyle={{
                              width: '100%',
                              height: '100%',
                              zIndex: 10,
                            }}
                            imgSrc={require('../../../assets/images/load.png')}
                          />
                        )}
                      </>
                    );
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.themeYellow]}
                      tintColor={appColor.themeYellow}
                    />
                  }
                  onEndReached={() => {
                    altStart == courseOverview.start &&
                      courseOverview.page < courseOverview.totalPages &&
                      paging();
                  }}
                  keyExtractor={(data, index) => index}
                  renderItem={({item, index}) => {
                    const ecode = item?.ecode?.split('/');
                    const youtubeId = ecode[ecode.length - 1];
                    return (
                      <View
                        key={item.id}
                        style={[styles.card_out, {paddingHorizontal: 6}]}>
                        <Pressable
                          style={styles.card_in}
                          onPress={() => {
                            navigation.navigate('course_detail', {
                              courseDetail: item,
                              youtubeId: youtubeId,
                            });
                            dispatch(setAltTitle(item.name));
                          }}>
                          {/* Youtube */}
                          {item.image && item.image != '' && (
                            <View style={styles.img_view}>
                              <FastImage
                                source={{
                                  uri: item.image,
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode="cover"
                                style={{...StyleSheet.absoluteFillObject}}
                              />
                              <View
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <FastImage
                                  style={{
                                    width: '30%',
                                    height: '100%',
                                  }}
                                  resizeMode="contain"
                                  source={require('../../../assets/images/youtubeLogo.png')}
                                />
                              </View>
                            </View>
                          )}
                          {/* content */}
                          <View style={styles.content}>
                            {/* title */}
                            {item.name && item.name != '' && (
                              <Text
                                style={[
                                  styles.baby_blk,
                                  {
                                    marginBottom: 5,
                                  },
                                ]}>
                                {item.name}
                              </Text>
                            )}
                            {/* content */}
                            {item.content && item.content != '' && (
                              <Text
                                numberOfLines={2}
                                style={[styles.roboto_light]}>
                                {item.content}
                              </Text>
                            )}
                          </View>
                        </Pressable>
                      </View>
                    );
                  }}
                />
              </>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.baby_blk, {color: appColor.themeYellow}]}>
                  Course Empty
                </Text>
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <GeneralCourseShimmer />
          </ScrollView>
        )}
      </View>
    </MainCard>
  );
};

export default CourseOverview;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    flatlist: {paddingBottom: widthResponse ? 90 : 140},
    card_out: {width: '50%'},
    card_in: {
      flex: 1,
      backgroundColor: appColor.greyBg,
      borderRadius: 10,
      padding: 6,
      paddingBottom: 10,
      overflow: 'hidden',
    },
    img_view: {
      position: 'relative',
      width: '100%',
      backgroundColor: appColor.greyBack,
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: 1.7,
    },
    img: {
      height: '100%',
      width: '100%',
      borderRadius: 10,
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
    content: {
      marginTop: widthResponse ? 15 : 30,
      paddingHorizontal: 7,
    },
  });

  return {styles};
};
