import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
// file import:
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {appFont} from '../../utilities/appFont';
import {url} from '../../utilities/appApi';
import AutoHeightImg from '../../components/Card/AutoHeightImg';
import {
  widthResponse,
  fontScalling,
  getsMonth,
  print,
  scrnWidth,
} from '../../utilities/helperFunction';
import {Blog_Overview} from '../../utilities/blog_ovr';
import {BlogShimmer} from '../../utilities/appShimmer';
import FastImage from 'react-native-fast-image';
// import LoaderKit from 'react-native-loader-kit';

const BlogOverview = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();

  // state:
  const [blogOverview, setBlogOverview] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [altStart, setAltStart] = useState(0);
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // print(blogOverview, 'blog');

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [altStart]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setBlogOverview(prevData => ({
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
    setAltStart(Number(blogOverview.start) + Number(blogOverview.limit));
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('start', altStart);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (blogOverview.data.length == 0) {
        setLoad(true);
      }

      // print(formData, 'formData')
      // get the response:
      const response = await fetch(url().blog_overview, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setBlogOverview(prevdata => {
            return {
              data: refresh
                ? resparse.data.blogsOverview
                : [...prevdata.data, ...resparse.data.blogsOverview],
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prevdata.page + 1),
            };
          });
        }
      } else {
        console.log('blog overview status code:', response.status);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error blog overview');
      setRefresh(false);
      setLoad(false);
    }
  };

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        {!load ? (
          <>
            {blogOverview?.data?.length > 0 ? (
              <FlatList
                data={blogOverview?.data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatlist}
                numColumns={2}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
                onEndReached={() => {
                  altStart == blogOverview.start &&
                    blogOverview.page < blogOverview.totalPages &&
                    paging();
                }}
                ItemSeparatorComponent={() => {
                  return <View style={{padding: 7}} />;
                }}
                ListFooterComponent={() => {
                  return (
                    <>
                      {blogOverview.page != blogOverview.totalPages && (
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
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => {
                  return (
                    <View
                      key={item.id}
                      style={[styles.card_out, {paddingHorizontal: 7}]}>
                      <Pressable
                        style={styles.card_in}
                        onPress={() => {
                          navigation.navigate('blog_detail', {
                            Blog_Detail: item,
                          });
                        }}>
                        {/* img */}
                        <View style={styles.img_view}>
                          {item.blogImage && item.blogImage != '' && (
                            <FastImage
                              source={{
                                uri: item.blogImage,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode="cover"
                              style={[styles.img]}
                            />
                          )}
                          {/* date */}
                          {item.blogDate && (
                            <View style={styles.date_view}>
                              <Text style={styles.baby_blk}>
                                {moment(item.blogDate).format('DD')}
                              </Text>
                              <Text style={styles.roboto_light}>
                                {moment(item.blogDate).format('MMM')}
                              </Text>
                            </View>
                          )}
                        </View>
                        {/* content */}
                        <View style={styles.content}>
                          {/* sub_title */}
                          {item.title && item.title != '' && (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.baby_blk,
                                {
                                  fontSize: fontScalling(2),
                                  color: appColor.themeYellow,
                                  marginBottom: 8,
                                },
                              ]}>
                              {item.title}
                            </Text>
                          )}
                          {/* title */}
                          {item.heading && item.heading != '' && (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.baby_blk,
                                {
                                  marginBottom: 10,
                                },
                              ]}>
                              {item.heading}
                            </Text>
                          )}
                          {/* auther */}
                          <View style={styles.author_view}>
                            {item.bloggerImage && item.bloggerImage != '' && (
                              <View style={styles.author_img_view}>
                                <FastImage
                                  resizeMode="cover"
                                  source={{
                                    uri: item.bloggerImage,
                                    priority: FastImage.priority.high,
                                  }}
                                  style={{width: '100%', height: '100%'}}
                                />
                              </View>
                            )}
                            {item.blogger && item.blogger != '' && (
                              <View style={{marginLeft: 10}}>
                                <Text
                                  style={[
                                    styles.baby_blk,
                                    {
                                      fontSize: fontScalling(2),
                                    },
                                  ]}>
                                  {item.blogger}
                                </Text>
                                <Text style={styles.roboto_light}>Anthor</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  );
                }}
              />
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
                  paddingBottom: widthResponse ? 90 : 140,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.baby_blk, {color: appColor.themeYellow}]}>
                  Empty Blog
                </Text>
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <BlogShimmer />
          </ScrollView>
        )}
      </View>
    </MainCard>
  );
};

export default BlogOverview;
const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    flatlist: {paddingBottom: widthResponse ? 90 : 140}, //@@
    card_out: {width: '50%'},
    card_in: {
      backgroundColor: appColor.greyBg,
      borderRadius: 10,
      padding: 6,
      overflow: 'hidden',
    },
    img_view: {
      position: 'relative',
      width: '100%',
      height: widthResponse ? scrnWidth / 3.7 : 200,
    },
    img: {
      height: scrnWidth / 3.7,
      width: '100%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    date_view: {
      position: 'absolute',
      bottom: widthResponse ? -25 : -50, //@@
      right: '5%', //@@
      paddingHorizontal: widthResponse ? 10 : 15, //@@
      paddingVertical: widthResponse ? 8 : 10, //@@
      borderRadius: 5,
      backgroundColor: appColor.bgWhite,
      elevation: 5,
      shadowOpacity: 0.2, //@@
      shadowRadius: 8, //@@
      shadowOffset: {height: 2}, //@@
      justifyContent: 'center',
      alignItems: 'center',
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.5),
      color: appColor.Textlightblack,
    },
    content: {
      marginTop: widthResponse ? 35 : 60,
      paddingHorizontal: 7,
    },
    author_view: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginBottom: 6,
    },
    author_img_view: {
      width: widthResponse ? 50 : 60,
      height: widthResponse ? 50 : 60,
      borderRadius: 100,
      overflow: 'hidden',
    },
  });

  return {styles};
};
