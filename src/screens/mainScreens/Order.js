import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import MainCard from '../../components/Card/MainCard';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  currencyConvertor,
  scrnWidth,
  print,
  destructureDate,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import {Icon} from '../../utilities/icon';
import LottieView from 'lottie-react-native';
import {url} from '../../utilities/appApi';
import {OrderShimmer} from '../../utilities/appShimmer';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomTabPress, setOrderTrigger} from '../../redux/SettingSlice';
import {useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const Order = ({navigation}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const [orders, setOrders] = useState({
    data: [],
    start: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
  });
  const [load, setLoad] = useState(false);
  const [start, setStart] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const scrollRef = useRef(null);

  const {orderTrigger, userSettings, bottomTabPress} = useSelector(
    state => state.setting,
  );
  const {userType} = useSelector(state => state.auth);

  // apicall on page enter
  useEffect(() => {
    if (
      !refresh &&
      userSettings?.userInfo?.user_id &&
      (userType == 'user' || userSettings?.userInfo?.userType == 'G') &&
      isFocus
    ) {
      apiCall();
    }
    if (!isFocus) {
      setStart(0);
      setOrders(pre => ({
        ...pre,
        start: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
      }));
    }
  }, [start, userType, isFocus, userSettings?.userInfo?.user_id]);

  // useEffect(() => {
  //   if (isFocus) {
  //     setLoad(true);
  //     setOrders({
  //       data: [],
  //       start: 0,
  //       limit: 0,
  //       totalPages: 0,
  //       page: 0,
  //     });
  //     apiCall();
  //   }
  // }, [isFocus]);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setOrders(pre => ({
      ...pre,
      data: pre.data,
      start: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
    }));
    setStart(0);
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (
      refresh &&
      userSettings?.userInfo?.user_id &&
      (userType == 'user' || userSettings?.userInfo?.userType == 'G')
    ) {
      apiCall();
    }
  }, [refresh]);

  // loading the following  pages
  const nxtReload = () => {
    setStart(Number(orders.start) + Number(orders.limit));
  };

  useEffect(() => {
    if (orderTrigger > 0) {
      setOrders(pre => ({
        ...pre,
        data: pre.data,
        start: 0,
        limit: 0,
        totalPages: 0,
        page: 0,
      }));
      setStart(0);
      setRefresh(true);
    }
  }, [orderTrigger]);

  // print(orders, 'length');
  //api call
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formdata = new FormData();
      if (
        userSettings &&
        userSettings?.userInfo &&
        userSettings?.userInfo?.user_id
      ) {
        formdata.append('userId', userSettings?.userInfo?.user_id);
      }
      formdata.append('context', 'myOrder');
      formdata.append('start', start);

      var requestOptions = {
        method: 'POST',
        body: formdata,
      };
      if (orders.data.length == 0) {
        setLoad(true);
      }
      // print(formdata, 'formdata');
      // get the response:
      const response = await fetch(url().myOrder, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
        //   print(resparse, 'resparse');
          dispatch(setOrderTrigger(0));
          setOrders(prev => {
            return {
              ...prev,
              data:
                start > orders.start
                  ? [...prev.data, ...resparse.data]
                  : resparse.data,
              start: Number(resparse.start),
              limit: Number(resparse.limit),
              totalPages: Number(resparse.totalPages),
              page: refresh ? 1 : Number(prev.page + 1),
            };
          });
        }
      }

      setLoad(false);
      setRefresh(false);
    } catch (error) {
      setLoad(false);
      setRefresh(false);
      console.log(error, 'Error in my order');
    }
  };

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  return (
    <MainCard altStyle={{paddingHorizontal: 0}}>
      <View style={styles.container}>
        {load &&
        (userType == 'user' || userSettings?.userInfo?.user_type == 'G') ? (
          <OrderShimmer />
        ) : orders &&
          orders.data.length > 0 &&
          (userType == 'user' || userSettings?.userInfo?.user_type == 'G') ? (
          <FlatList
            ref={scrollRef}
            data={orders?.data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatlist}
            onEndReached={() => {
              start == orders.start &&
                orders.page < orders.totalPages &&
                nxtReload();
            }}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[appColor.themeYellow]}
                tintColor={appColor.themeYellow}
              />
            }
            ItemSeparatorComponent={() => {
              return <View style={{padding: 4}} />;
            }}
            ListFooterComponent={() => {
              return (
                <>
                  {orders.page != orders.totalPages && (
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
            keyExtractor={(data, index) => index}
            renderItem={({item, index}) => {
              // console.log(deliveryTime.hr, 'deliveryTime');
              // print(item, 'item');
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    // console.log(item, 'item');
                    navigation.navigate('order_detail', {
                      order_id: item.id,
                      status: item.payment_status,
                      order_created: item.order_created,
                      delivery_date: item.delivery_date,
                      expect_delivery_time: item.expect_delivery_time,
                    });
                  }}
                  style={[
                    styles.card_in,
                    {
                      backgroundColor:
                        item.deleted == '0'
                          ? appColor.white
                          : appColor.cancelLight,
                    },
                  ]}>
                  {/* images */}
                  <View style={[styles.img_view]}>
                    {item.product_image &&
                      item.product_image != '' &&
                      item.product_image.map((data, i) => {
                        if (i < 4) {
                          return (
                            <View
                              key={i}
                              style={{
                                width:
                                  item.product_image.length == 1
                                    ? '100%'
                                    : '50%',
                                height:
                                  item.product_image.length == 1
                                    ? '100%'
                                    : '50%',
                                padding: widthResponse ? 3 : 5,
                              }}>
                              {i < 3 ? (
                                <View
                                  style={{
                                    borderWidth:
                                      item.product_image.length == 1 ? 0 : 1,
                                    borderRadius: 6,
                                    padding: widthResponse ? 3 : 6,
                                    borderColor: appColor.lightGreyLine,
                                  }}>
                                  {data && (
                                    <FastImage
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 6,
                                      }}
                                      resizeMode="cover"
                                      source={{
                                        uri: data,
                                        priority: FastImage.priority.high,
                                      }}
                                    />
                                  )}
                                </View>
                              ) : (
                                <View style={styles.imglength}>
                                  <Text
                                    style={{
                                      fontFamily: appFont.rM,
                                      fontSize: fontScalling(1.8),
                                      color: appColor.textWhite,
                                    }}>
                                    +{item.product_image.length - 3}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        }
                      })}
                  </View>
                  {/* details */}
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                    }}>
                    {item.product_name && (
                      <Text
                        numberOfLines={1}
                        style={[styles.baby_blk, {marginBottom: 5}]}>
                        {item.product_name}
                      </Text>
                    )}
                    {item.order_created && (
                      <Text style={[styles.roboto_light, {marginBottom: 7}]}>
                        <Text style={{fontFamily: appFont.rB}}>
                          {'Ordered Date: '}
                        </Text>
                        {moment(item.order_created).format(
                          'Do MMM YYYY , h:mm A',
                        )}
                      </Text>
                    )}
                    {item.delivery_date &&
                      item.delivery_date.length > 0 &&
                      item.expect_delivery_time &&
                      item.expect_delivery_time.length > 0 && (
                        <Text style={[styles.roboto_light, {marginBottom: 7}]}>
                          <Text style={{fontFamily: appFont.rB}}>
                            {'Delivery Date: '}
                          </Text>
                          {moment(
                            destructureDate(item.delivery_date, '-'),
                          ).format('Do MMM YYYY,')}{' '}
                          {item.expect_delivery_time}
                        </Text>
                      )}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {item.total_amount && (
                        <Text
                          style={[
                            styles.roboto_light,
                            {fontFamily: appFont.rB},
                          ]}>
                          {currencyConvertor(item.total_amount, 2)}
                        </Text>
                      )}
                      {/* {deliveryTime &&
                        timerValid &&
                        deliveryTime.sec != 0 &&
                        deliveryTime.min != 0 && (
                          <Text
                            style={[
                              styles.roboto_light,
                              {fontSize: fontScalling(1.8)},
                            ]}>
                            Delivered in:
                            <Text
                              style={{
                                fontFamily: appFont.rM,
                                color: appColor.gold,
                              }}>
                              {' '}
                              {`${
                                Number(deliveryTime.hr) == 0
                                  ? ''
                                  : Number(deliveryTime.hr) + 'hr'
                              } ${
                                Number(deliveryTime.min)
                                  ? Number(deliveryTime.min) + 'min'
                                  : ''
                              }`}
                            </Text>
                          </Text>
                        )} */}
                    </View>
                  </View>
                  {/* payment status */}
                  {item.payment_status && false && (
                    <View
                      style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* symbol */}
                      <View
                        style={{
                          width: widthResponse ? 30 : 40,
                          height: widthResponse ? 30 : 40,
                          borderRadius: 80,
                          marginBottom: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor:
                            item.payment_status == 'paid'
                              ? appColor.paid
                              : item.payment_status == 'pending'
                              ? appColor.ToastInfo
                              : appColor.cancel,
                        }}>
                        <Icon
                          ComponentName={
                            item.payment_status == 'paid'
                              ? 'FontAwesome'
                              : item.payment_status == 'pending'
                              ? 'AntDesign'
                              : 'MaterialIcons'
                          }
                          name={
                            item.payment_status == 'paid'
                              ? 'check'
                              : item.payment_status == 'pending'
                              ? 'exclamation'
                              : 'close'
                          }
                          size={widthResponse ? 17 : 23}
                          color={appColor.white}
                        />
                      </View>
                      {/* status */}
                      <Text
                        style={[
                          styles.roboto_light,
                          {
                            textTransform: 'capitalize',
                            color:
                              item.payment_status == 'paid'
                                ? appColor.paid
                                : item.payment_status == 'pending'
                                ? appColor.ToastInfo
                                : appColor.cancel,
                            fontSize: fontScalling(1.6),
                          },
                        ]}>
                        {item.payment_status}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              userType == 'guest' ? (
                <></>
              ) : (
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.themeYellow]}
                  tintColor={appColor.themeYellow}
                />
              )
            }
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {userType == 'guest' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('login');
                }}>
                <Text
                  style={[
                    styles.baby_blk,
                    {
                      color: appColor.themeYellow,
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Please Sign in
                </Text>
              </TouchableOpacity>
            )}
            <LottieView
              source={require('../../../assets/lottieFiles/orderempty.json')}
              autoPlay={true}
              loop={true}
              style={{width: scrnWidth / 1.5, height: scrnWidth / 1.5}}
            />
          </ScrollView>
        )}
      </View>
    </MainCard>
  );
};

export default Order;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    flatlist: {paddingBottom: widthResponse ? 90 : 140},
    card_in: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      marginHorizontal: 6,
      padding: widthResponse ? 10 : 13,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: appColor.borderColor,
    },
    img_view: {
      width: widthResponse ? 80 : 150,
      height: widthResponse ? 80 : 150,
      padding: 3,
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderRadius: 8,
      backgroundColor: appColor.bgWhite,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imglength: {
      borderWidth: 1,
      borderRadius: 6,
      height: '100%',
      width: '100%',
      padding: 3,
      borderColor: appColor.bgBlack,
      backgroundColor: appColor.bgBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.Textlightblack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
  });

  return {styles};
};
