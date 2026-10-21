import {Pressable, Text, View, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
// file import:
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  MyStatusBar,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setPosition, setVegToggle} from '../../redux/SettingSlice';
import {setNotifeeDelModal} from '../../redux/NotificationSlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LottieView from 'lottie-react-native';
import Toggle from '../Buttons/Toggle';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function AppHeaders({
  drawer,
  backIconDisabled,
  title,
  welcome,
  bellDisabled,
  searchDisabled,
  coinIcon,
  deleteIcon = false,
  backIconFn = false,
  toggleDisable = true,
  location = false,
}) {
  const appColor = appColors();
  const navigation = useNavigation();
  const {total} = useSelector(state => state.cart);
  const safeArea = useSafeAreaInsets();
  const {userType, userLocation} = useSelector(state => state.auth);
  const {allNotification} = useSelector(state => state.notification);
  const {userSettings, userSettingLoad, vegToggle, storeAddress} = useSelector(
    state => state.setting,
  );
  const dispatch = useDispatch();

  const userAddress =
    userType == 'user' &&
    userSettings &&
    userSettings.userInfo &&
    (userSettings.userInfo?.street != '' ||
      userSettings.userInfo?.city != '' ||
      userSettings.userInfo?.state != '' ||
      userSettings.userInfo?.pincode != '')
      ? `${
          userSettings.userInfo?.street != '' &&
          Array.isArray(userSettings.userInfo?.street)
            ? userSettings.userInfo?.street.join(',') + ', '
            : userSettings.userInfo?.street != ''
            ? userSettings.userInfo?.street + ', '
            : null
        }${
          userSettings.userInfo?.city != '' &&
          userSettings.userInfo?.city + ', '
        }${
          userSettings.userInfo?.state != '' &&
          userSettings.userInfo?.state + ', '
        }${
          userSettings.userInfo?.pincode != '' && userSettings.userInfo?.pincode
        }.`
      : null;

  const storeAddressLocal =
    storeAddress &&
    (storeAddress?.street != '' ||
      storeAddress?.city != '' ||
      storeAddress?.state != '' ||
      storeAddress?.pincode != '')
      ? `${
          storeAddress?.street != '' && Array.isArray(storeAddress?.street)
            ? storeAddress?.street.join(',')
            : storeAddress?.street != ''
            ? storeAddress?.street
            : null
        },${storeAddress?.city != '' && storeAddress?.city},
        ${storeAddress?.state != '' && storeAddress?.state},
        ${storeAddress?.pincode != '' && storeAddress?.pincode}`
      : null;

  return (
    <>
      <MyStatusBar
        backgroundColor={appColor.bgBlack}
        barStyle={'light-content'}
      />
      <View
        style={{
          // paddingTop: !paddingTop ? safeArea.top : 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: appColor.bgBlack,
        }}>
        {/* Left Icons*/}
        {/* backIcon */}
        {!backIconDisabled && (
          <Pressable
            style={{
              backgroundColor: appColor.greyBack,
              padding: 8,
              borderRadius: 50,
            }}
            onPress={
              backIconFn
                ? backIconFn
                : () => {
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    } else {
                      navigation.navigate('Dashboard', {screen: 'home'});
                    }
                  }
            }>
            <View style={{left: widthResponse ? 4 : 6}}>
              <Icon
                ComponentName={'MaterialIcons'}
                name={'arrow-back-ios'}
                size={widthResponse ? 20 : 35}
                color={appColor.bgWhite}
              />
            </View>
          </Pressable>
        )}
        {/* Title */}
        <Pressable
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          {welcome && (
            <Pressable
              onPress={
                userType == 'guest'
                  ? () => navigation.navigate('login')
                  : () => {
                      navigation.navigate('Profile', {
                        screen: 'EditProfile',
                        initial: false,
                      });
                    }
              }>
              {userSettingLoad ? (
                <View
                  style={{
                    width: widthResponse ? 45 : 60, //@@
                    height: widthResponse ? 45 : 60, //@@
                    borderRadius: 200,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    borderColor: appColor.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: appColor.sliderGreyBg,
                  }}>
                  <LottieView
                    autoPlay={true}
                    style={{
                      width: widthResponse ? 90 : 130, //@@
                      height: widthResponse ? 90 : 130, //@@
                      top: widthResponse ? 4 : 8,
                    }}
                    source={require('../../../assets/lottieFiles/load.json')}
                  />
                </View>
              ) : (
                <FastImage
                  style={{
                    width: widthResponse ? 45 : 60, //@@
                    height: widthResponse ? 45 : 60, //@@
                    borderRadius: 200,
                    marginHorizontal: 10,
                    borderWidth: 2,
                    borderColor: appColor.white,
                  }}
                  source={
                    userSettings &&
                    userType != 'guest' && //@@
                    userSettings?.userInfo &&
                    userSettings?.userInfo?.picture != ''
                      ? {
                          uri: userSettings?.userInfo?.picture,
                          priority: FastImage.priority.high,
                        }
                      : require('../../../assets/images/profile.png')
                  }
                  resizeMode="cover"
                />
              )}
            </Pressable>
          )}
          <View
            style={{
              flex: 1,
              marginLeft: backIconDisabled ? 0 : 20,
            }}>
            {/* {welcome && (
              <Text
                style={{
                  color: appColor.themeYellow,
                  fontFamily: appFont.rR,
                  fontSize: fontScalling(1.7),
                }}>
                Welcome
              </Text>
            )} */}
            {userSettingLoad ? (
              <SkeletonPlaceholder>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 40,
                      height: 12,
                      borderRadius: 5,
                      marginTop: widthResponse ? 8 : 10,
                    }}
                  />
                  <View
                    style={{
                      width: 20,
                      height: 12,
                      borderRadius: 5,
                      marginTop: widthResponse ? 8 : 10,
                      marginLeft: 10,
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            ) : (
              title && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(3),
                    letterSpacing: widthResponse ? 2.5 : 3,
                    color: appColor.textWhite,
                    marginBottom: widthResponse ? -4 : -8,
                  }}>
                  {title}
                </Text>
              )
            )}
            {location && (
              <Pressable
                onPress={() => {
                  // navigation.navigate('manualLocation');
                  userType == 'guest'
                    ? navigation.navigate('locationSearch')
                    : navigation.navigate('Profile', {
                        screen: 'EditProfile',
                        initial: false,
                      });
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: 7,
                  borderColor: appColor.white,
                  marginLeft: -5,
                }}>
                {!userSettingLoad && (
                  <Icon
                    ComponentName={'Ionicons'}
                    name={'location-outline'}
                    size={18}
                    color={appColor.white}
                  />
                )}
                {userSettingLoad ? (
                  <SkeletonPlaceholder>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 5,
                      }}>
                      <View
                        style={{
                          width: scrnWidth / 4,
                          height: 12,
                          borderRadius: 5,
                          marginTop: 5,
                        }}
                      />
                    </View>
                  </SkeletonPlaceholder>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(1.5),
                      color:
                        userAddress != null
                          ? appColor.borderColor
                          : appColor.gold,
                      marginBottom: widthResponse ? -4 : -8,
                      flex: 1,
                    }}>
                    {userType == 'user' && userAddress != null
                      ? userAddress
                      : userType == 'guest' && storeAddressLocal
                      ? storeAddressLocal
                      : 'Location not set Select delivery location'}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </Pressable>
        {/* Right Icons */}
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 'auto', //@@
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          {/* coinIcon */}
          {coinIcon && (
            <Pressable
              onPress={() => {
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('Profile', {screen: 'RewardCoin'});
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                // width: widthResponse ? 40 : 45,
                // height: widthResponse ? 40 : 45,
                borderRadius: 10,
                marginLeft: widthResponse ? 10 : 15,
                flexDirection: 'row',
                paddingHorizontal: 7,
                paddingVertical: 7,
              }}>
              <FastImage
                source={require('../../../assets/images/coin.png')}
                resizeMode="contain"
                style={{
                  width: widthResponse ? 18 : 30, //@@
                  height: widthResponse ? 18 : 30, //@@
                }}
              />
              <Text
                style={[
                  {
                    color: appColor.white,
                    fontFamily: appFont.rR,
                    fontSize: fontScalling(1.8),
                  },
                  {paddingLeft: 5},
                ]}>
                {total.pointsShown}
              </Text>
            </Pressable>
          )}
          {/* SearchIcon */}
          {!searchDisabled && (
            <Pressable
              onPress={() => {
                navigation.navigate('search');
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 35 : 40,
                height: widthResponse ? 35 : 40,
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}>
              <Icon
                ComponentName={'Fontisto'}
                name={'search'}
                color={appColor.bgWhite}
                size={widthResponse ? 17 : 23}
              />
            </Pressable>
          )}
          {allNotification &&
            allNotification.data?.length > 0 &&
            deleteIcon && (
              <Pressable
                onPress={() => {
                  dispatch(setNotifeeDelModal(true));
                }}
                style={{
                  backgroundColor: appColor.greyBack,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: widthResponse ? 35 : 40,
                  height: widthResponse ? 35 : 40,
                  borderRadius: 50,
                  marginLeft: widthResponse ? 10 : 15,
                }}>
                <Icon
                  ComponentName={'Feather'}
                  name={'trash-2'}
                  color={appColor.bgWhite}
                  size={widthResponse ? 20 : 23}
                />
              </Pressable>
            )}
          {/* bellIcon */}
          {!bellDisabled && (
            <Pressable
              onPress={() => {
                // navigation.navigate('locationSearch');
                userType == 'guest'
                  ? navigation.navigate('login')
                  : navigation.navigate('Dashboard', {screen: 'notification'});
              }}
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 35 : 40,
                height: widthResponse ? 35 : 40,
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}>
              <View style={{left: 1, position: 'relative'}}>
                <Icon
                  name={'bell'}
                  ComponentName={'Fontisto'}
                  color={appColor.bgWhite}
                  size={widthResponse ? 18 : 23}
                />
                {/* Number Budge */}
                {userSettings && userSettings.badge > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: widthResponse ? -13 : -20,
                      right: widthResponse ? -13 : -23,
                      width: widthResponse ? 20 : 30,
                      height: widthResponse ? 20 : 30,
                      borderRadius: 100,
                      backgroundColor: appColor.themeYellow,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        fontSize: fontScalling(widthResponse ? 1.3 : 1.8),
                        color: appColor.textWhite,
                      }}>
                      {userSettings.badge}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
          {/* Drawer Menu */}
          {drawer && (
            <Pressable
              style={{
                backgroundColor: appColor.greyBack,
                justifyContent: 'center',
                alignItems: 'center',
                width: widthResponse ? 35 : 40,
                height: widthResponse ? 35 : 40,
                borderRadius: 50,
                marginLeft: widthResponse ? 10 : 15,
              }}
              onPress={() => {
                dispatch(setPosition('left'));
                navigation.getParent().openDrawer();
              }}>
              <Icon
                color={appColor.white}
                ComponentName={'MaterialIcons'}
                name={'restaurant-menu'}
                size={widthResponse ? 25 : 30}
              />
            </Pressable>
          )}
          {toggleDisable && (
            <Animatable.View
              animation={'zoomIn'}
              duration={400}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: appColor.borderColor,
                paddingHorizontal: 3,
                // borderWidth: 1,
                borderRadius: 15,
                marginLeft: 5,
                paddingVertical: 2,
                // backgroundColor: appColor.borderColor,
              }}>
              <Text
                style={{
                  color: vegToggle ? appColor.gold : appColor.textGrey,
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(1.8),
                  paddingBottom: 5,
                }}>
                Veg{' '}
                <Text
                  style={{
                    color: !vegToggle ? appColor.gold : appColor.textGrey,
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(1.8),
                    paddingBottom: 5,
                  }}>
                  Mode
                </Text>
              </Text>

              <Toggle
                type="green"
                isActive={vegToggle}
                onPress={() => {
                  dispatch(setVegToggle(!vegToggle));
                }}
                style={{
                  borderRadius: 15,
                  backgroundColor: appColor.white,
                  paddingHorizontal: 4,
                  paddingRight: 8,
                  paddingVertical: 6,
                  elevation: 0.5,
                  borderWidth: 1,
                  borderColor: appColor.lightGreyLine,
                }}
              />
            </Animatable.View>
          )}
        </View>
      </View>
    </>
  );
}

export default AppHeaders;
