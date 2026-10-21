import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import appColors from '../../utilities/appColors';
import {
  FlatList,
  RefreshControl,
  Swipeable,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import ToggleButton from '../../components/Buttons/ToggleButtons';
import {
  arrayLength,
  checkNotificationPermission,
  convert12HrTimeFormat,
  fontScalling,
  formatDate,
  permissionAlert,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {Image} from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {
  notificationApi,
  notificationOtpApi,
  setAllNotification,
  setAllRefresh,
  setAllStart,
  setNotifeeDelModal,
  setOtpNotification,
  setOtpRefresh,
  setOtpStart,
} from '../../redux/NotificationSlice';
import {userSettingApi} from '../../redux/SettingSlice';
import BallWithSpin from '../../components/AnimatedStyle/BallWithSpin';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import {url} from '../../utilities/appApi';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// list component:
const Notify_card = ({notify, Delete_Notification, index, context}) => {
  const appColor = appColors();

  // swipeList:
  const swipe_left = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          width: widthResponse ? 50 : 60,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() =>
            Delete_Notification(notify.id, 'single', index, context)
          }>
          <Icon
            ComponentName={'MaterialIcons'}
            name={'delete-outline'}
            size={widthResponse ? 25 : 30}
            color={appColor.black}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const Notify_Icon = () => {
    switch (notify.type) {
      case 'offer':
        return (
          <View style={[styles.notify_icon, {backgroundColor: appColor.gold}]}>
            <Icon
              ComponentName={'MaterialCommunityIcons'}
              name={'sale'}
              size={widthResponse ? 26 : 35}
              color={appColor.white}
            />
          </View>
        );
      case 'newarrival':
        return (
          <View
            style={[styles.notify_icon, {backgroundColor: appColor.lightBlue}]}>
            <Text
              style={{
                fontSize: widthResponse ? 16 : 20,
                color: appColor.textWhite,
                fontFamily: appFont.rB,
                textTransform: 'uppercase',
                transform: [
                  {
                    rotate: '-20deg',
                  },
                ],
              }}>
              New
            </Text>
          </View>
        );
      case 'delivery':
        return (
          <View style={[styles.notify_icon, {backgroundColor: appColor.black}]}>
            <Icon
              ComponentName={'FontAwesome6'}
              name={'cart-flatbed-suitcase'}
              size={widthResponse ? 16 : 23}
              color={appColor.white}
            />
          </View>
        );
      case 'all':
        return (
          <View style={[styles.notify_icon]}>
            <FastImage
              source={require('../../../assets/images/splash_logo.png')}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
            />
          </View>
        );
    }
  };
  return (
    <Swipeable
      renderRightActions={swipe_left}
      childrenContainerStyle={{flexDirection: 'row', paddingVertical: 15}}>
      {/* icons */}
      <Notify_Icon />
      {/* contents */}
      <View style={{flex: 1, paddingHorizontal: 15}}>
        {notify?.title && (
          <Text
            style={{
              fontSize: fontScalling(2.3),
              fontFamily: appFont.bB,
              color: appColor.black,
              marginBottom: widthResponse ? 5 : 10,
            }}>
            {notify.title}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          {/* <Image
            source={require('../../../assets/images/coin.png')}
            style={{ width: 20, height: 20, marginRight: 8 }}
            resizeMode="contain"
          /> */}
          {notify?.messages && (
            <Text
              style={{
                fontSize: fontScalling(1.7),
                fontFamily: appFont.rR,
                color: appColor.black,
                marginBottom: 5,
              }}>
              {notify.messages}
            </Text>
          )}
        </View>
        {notify.created_at && (
          <Text
            style={{
              fontSize: fontScalling(1.7),
              fontFamily: appFont.rR,
              color: appColor.themeYellow,
            }}>
            {`${formatDate(
              notify.created_at.split(' ')[0],
            )} , ${convert12HrTimeFormat(notify.created_at.split(' ')[1])}`}
          </Text>
        )}
      </View>
      {/* images */}
      {notify?.image && notify?.image != '' && (
        <View
          style={{
            width: scrnWidth / 6,
            height: scrnWidth / 6,
            borderRadius: 5,
            backgroundColor: appColor.greyBg,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          {notify?.image && notify?.image != '' ? (
            <FastImage
              source={{uri: notify.image, priority: FastImage.priority.high}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 5,
              }}
            />
          ) : (
            <FastImage
              source={require('../../../assets/images/noimage.png')}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </View>
      )}
    </Swipeable>
  );
};

const Notification = ({route}) => {
  const [selection, setSelection] = useState(
    route?.params?.btn != undefined ? route?.params?.btn : 1,
  );
  const dispatch = useDispatch();
  const appColor = appColors();
  const deleteAnimRef = useRef(null);
  const showToast = useShowToast();
  const [fcmTrigger, setTriggerFcmToken] = useState(0);
  const isFocus = useIsFocused();

  const {
    allNotification,
    otpNotification,
    load,
    otpLoad,
    allStart,
    otpStart,
    allRefresh,
    otpRefresh,
    notifeeDelModal,
  } = useSelector(state => state.notification);
  const {profileData} = useSelector(state => state.auth);

  const change = slct => {
    setSelection(slct);
  };

  const handledelete = async (id = '', mode, index = 0, context = '') => {
    try {
      var myHeaders = new Headers();
      const formdata = new FormData();
      if (profileData && profileData?.userId) {
        formdata.append('userId', profileData?.userId);
      }
      formdata.append('context', 'delete');
      formdata.append('deleteMode', mode);
      if (mode == 'single') {
        formdata.append('msgId', id);
      }

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
      };
      // console.log(id, 'id', index, 'index', mode, 'mode');
      const response = await fetch(url().notification, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.success) {
          if (context == 'all') {
            const allnotification = JSON.parse(JSON.stringify(allNotification));
            dispatch(
              setAllNotification({
                data:
                  mode == 'single'
                    ? allnotification?.data.toSpliced(index, 1)
                    : [],
                start: mode == 'single' ? allnotification?.start : 0,
                limit: mode == 'single' ? allnotification?.limit : 0,
                totalPages: mode == 'single' ? allnotification?.totalPages : 0,
                page: mode == 'single' ? allnotification?.page : 0,
              }),
            );
          } else if (context == 'otp') {
            const otpCopyNotification = JSON.parse(
              JSON.stringify(otpNotification),
            );
            dispatch(
              setOtpNotification({
                data:
                  mode == 'single'
                    ? otpCopyNotification?.data.toSpliced(index, 1)
                    : [],
                start: mode == 'single' ? otpCopyNotification?.start : 0,
                limit: mode == 'single' ? otpCopyNotification?.limit : 0,
                totalPages:
                  mode == 'single' ? otpCopyNotification?.totalPages : 0,
                page: mode == 'single' ? otpCopyNotification?.page : 0,
              }),
            );
          } else if (context == 'deleteAll') {
            dispatch(
              setAllNotification({
                data: [],
                start: 0,
                limit: 0,
                totalPages: 0,
                page: 0,
              }),
            );
            dispatch(
              setOtpNotification({
                data: [],
                start: 0,
                limit: 0,
                totalPages: 0,
                page: 0,
              }),
            );
          }
          showToast('success', '', resparse.success, 1500);
        }
      } else {
        console.log(response.status, 'statis in delete notification');
      }
    } catch (error) {
      console.log(error, 'error in delete Notification');
    }
  };

  const paging = () => {
    dispatch(
      setAllStart(
        Number(allNotification.start) + Number(allNotification.limit),
      ),
    );
  };

  const otpPaging = () => {
    dispatch(
      setOtpStart(
        Number(otpNotification.start) + Number(otpNotification.limit),
      ),
    );
  };

  const onRefresh = useCallback(() => {
    if (
      allNotification &&
      allNotification?.data &&
      allNotification?.data?.length > 0
    ) {
      dispatch(
        setAllNotification({
          data: allNotification?.data,
          start: 0,
          limit: 0,
          totalPages: 0,
          page: 0,
        }),
      );
      dispatch(setAllStart(0));
      dispatch(setAllRefresh(true));
    }
  }, []);

  const onRefreshOTP = useCallback(() => {
    if (
      otpNotification &&
      otpNotification?.data &&
      otpNotification?.data?.length > 0
    ) {
      dispatch(
        setOtpNotification({
          data: otpNotification?.data,
          start: 0,
          limit: 0,
          totalPages: 0,
          page: 0,
        }),
      );
      dispatch(setOtpStart(0));
      dispatch(setOtpRefresh(true));
    }
  }, []);

  // notification permission:
  useEffect(() => {
    (async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(enabled, 'enabled');
      if (enabled) {
        checkNotificationPermission(dispatch, setTriggerFcmToken);
      }
      if (!enabled) {
        permissionAlert('Notification');
      }
    })();
  }, [fcmTrigger]);

  const resetNotifee = () => {
    dispatch(setAllStart(0));
    dispatch(
      setAllNotification({
        data: [],
        count: 0,
        page: 0,
        start: 0,
        limit: 0,
      }),
    );
  };

  // during foreground message
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      resetNotifee();
      dispatch(notificationApi());
    });
    return unsubscribe;
  }, []);

  // when unfous to reset datas:
  useEffect(() => {
    if (!isFocus) {
      // resetNotifee();
    }
  }, [isFocus]);

  // pull To Refresh
  useEffect(() => {
    if (selection == 2) {
      if (otpRefresh) {
        dispatch(notificationOtpApi());
      }
    }
    if (selection == 1) {
      if (allRefresh) {
        dispatch(notificationApi());
      }
    }
  }, [allRefresh, otpRefresh]);

  // initial apicall
  useEffect(() => {
    dispatch(userSettingApi());
    if (selection == 2 && !otpRefresh) {
      if (
        otpNotification &&
        otpNotification.data &&
        otpNotification.data.length == 0
      ) {
        dispatch(notificationOtpApi());
      }
    }
    if (selection == 1 && !allRefresh) {
      if (allNotification && allNotification.data.length == 0) {
        dispatch(notificationApi());
      }
    }
  }, [selection]);

  // during Pagination
  useEffect(() => {
    if (selection == 1 && allStart != 0) {
      if (
        allNotification &&
        allNotification.totalPages > 0 &&
        allNotification.data.length > 0 &&
        !allRefresh
      ) {
        dispatch(notificationApi());
      }
    } else if (selection == 2 && otpStart != 0) {
      if (
        otpNotification &&
        otpNotification.totalPages > 0 &&
        otpNotification.data.length > 0 &&
        !otpRefresh
      ) {
        dispatch(notificationOtpApi());
      }
    }
  }, [allStart, otpStart]);

  return (
    <>
      <View style={{backgroundColor: appColor.bgBlack}}>
        <View
          style={[
            {
              marginHorizontal: 10,
              backgroundColor: appColor.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingBottom: 20,
              paddingTop: 10,
              height: 65,
              zIndex: 1,
            },
          ]}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: appColor.bgWhite,
          paddingHorizontal: 15,
        }}>
        {/* btn toggle */}
        <View style={{marginTop: -40}}>
          <ToggleButton
            switchOne={'All'}
            switchTwo={'OTP'}
            onSelect={change}
            activeSwitch={selection}
            button_for_notify
          />
        </View>
        {/* content list */}
        <View style={{flex: 1, paddingTop: 30}}>
          {/* all notification */}
          {selection == 1 ? (
            arrayLength(allNotification.data) ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        borderBottomColor: appColor.borderColor,
                        borderBottomWidth: 1,
                      }}></View>
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={allRefresh}
                    onRefresh={onRefresh}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 90 : 130,
                }}
                data={allNotification.data}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <Notify_card
                        notify={item}
                        Delete_Notification={handledelete}
                        index={index}
                        context={'all'}
                      />
                    </>
                  );
                }}
                onEndReached={() => {
                  allStart == allNotification.start &&
                    allNotification.page < allNotification.totalPages &&
                    paging();
                }}
                ListFooterComponent={() => {
                  return (
                    <>
                      {allNotification.page != allNotification.totalPages && (
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
              />
            ) : (
              !load &&
              !allRefresh && (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={allRefresh}
                      onRefresh={onRefresh}
                      colors={[appColor.themeYellow]}
                      tintColor={appColor.themeYellow}
                    />
                  }
                  contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: scrnHeight / 1.5,
                  }}>
                  <Text
                    style={{
                      fontFamily: appFont.bB,
                      fontSize: fontScalling(2.3),
                      color: appColor.gold,
                    }}>
                    There is no notification found
                  </Text>
                </ScrollView>
              )
            )
          ) : null}
          {/* otp notification */}
          {selection == 2 ? (
            arrayLength(otpNotification.data) ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        borderBottomColor: appColor.borderColor,
                        borderBottomWidth: 1,
                      }}></View>
                  );
                }}
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 90 : 130,
                }}
                data={otpNotification.data}
                renderItem={({item, index}) => {
                  // console.log(item, 'From flatlist');
                  return (
                    <Notify_card
                      notify={item}
                      Delete_Notification={handledelete}
                      index={index}
                      context={'otp'}
                    />
                  );
                }}
                onEndReached={() => {
                  otpStart == otpNotification.start &&
                    otpNotification.page < otpNotification.totalPages &&
                    otpPaging();
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={otpRefresh}
                    onRefresh={onRefreshOTP}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
                ListFooterComponent={() => {
                  return (
                    <>
                      {otpNotification.page != otpNotification.totalPages && (
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
              />
            ) : !otpLoad && !otpRefresh ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={otpRefresh}
                    onRefresh={onRefreshOTP}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: scrnHeight / 1.5,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2.3),
                    color: appColor.gold,
                  }}>
                  No available OTP
                </Text>
              </ScrollView>
            ) : null
          ) : null}
        </View>
        {/* -------delete modal--------- */}
        <Modal
          animationType="slide"
          onBackdropPress={() => dispatch(setNotifeeDelModal(false))}
          backdropColor={appColor.overlayBg}
          backdropOpacity={1}
          transparent={true}
          isVisible={notifeeDelModal}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            width: scrnWidth / 1,
            marginHorizontal: 'auto',
          }}>
          <View
            style={{
              backgroundColor: appColor.white,
              paddingHorizontal: 15,
              paddingBottom: 25,
              borderRadius: 5,
              alignItems: 'center',
              paddingTop: 0,
            }}>
            <LottieView
              ref={deleteAnimRef}
              resizeMode="contain"
              style={{
                width: scrnWidth / 2,
                height: scrnWidth / 2.5,
                marginTop: -35,
              }}
              source={require('../../../assets/lottieFiles/trash_1.json')}
              loop={false}
            />
            <Text
              style={{
                marginBottom: 10,
                fontFamily: appFont.rB,
                fontSize: fontScalling(2.1),
                color: appColor.textBlack,
                paddingBottom: 10,
              }}>
              Are you sure you want to delete all Notifications?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // width: '100%',
                // backgroundColor:appColor.black
              }}>
              <Pressable
                onPress={() => {
                  dispatch(setNotifeeDelModal(false));
                }}
                style={{
                  backgroundColor: appColor.black,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(1.5),
                    color: appColor.white,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>
                  no
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handledelete('', 'all', 0, 'deleteAll');
                  deleteAnimRef.current.play(0, 150);
                  setTimeout(() => {
                    dispatch(setNotifeeDelModal(false));
                  }, 800);
                }}
                style={{
                  backgroundColor: appColor.themeYellow,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginLeft: 15,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(1.5),
                    color: appColor.white,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}>
                  yes
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notify_icon: {
    width: widthResponse ? 50 : 60,
    height: widthResponse ? 50 : 60,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
