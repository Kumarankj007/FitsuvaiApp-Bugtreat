import React, {useState, useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Pressable,
  Text,
  Keyboard,
  Vibration,
  Linking,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// file import:
import {
  CartStack,
  DashBoardStack,
  MenuStack,
  OrderStack,
  ProfileStack,
} from './Stack';
import appColors from '../utilities/appColors';
import {Icon} from '../utilities/icon';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../utilities/helperFunction';
import {appFont} from '../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {
  setPosition,
  setBottomTabPress,
  userSettingApi,
} from '../redux/SettingSlice';
import DrawerScreen from '../screens/mainScreens/DrawerScreen';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import LottieView from 'lottie-react-native';

const Tab = createBottomTabNavigator();

const width = fontScalling(30);

const CustomTabBar = ({state, descriptors, navigation}) => {
  const appColor = appColors();
  const {cart} = useSelector(state => state.cart);
  const {allNotification} = useSelector(state => state.notification);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // when keyboard show bottomtab hide:
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        // console.log(e, 'e')
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Cleanup the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <>
      <View
        style={{
          width: '100%',
          maxWidth: widthResponse ? scrnWidth - 40 : scrnWidth / 1.3,
          alignSelf: 'center',
          // paddingHorizontal: widthResponse ? 20 : 100,
          position: 'absolute',
          bottom: widthResponse ? 20 : 30,
        }}>
        {/* bottom tabs */}
        {!keyboardVisible && (
          <View
            style={{
              width: '100%',
              // marginHorizontal: 20,
              padding: widthResponse ? 8 : 10, //@@
              flexDirection: 'row',
              overflow: 'hidden',
              elevation: 5,
              borderRadius: 100,
              backgroundColor: 'black',
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {state.routes.map((route, index) => {
              const {options} = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;
              // console.log(state.index, 'tab', index, isFocused);
              const onPress = () => {
                dispatch(setBottomTabPress(1));
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  if (route.name == 'Menu') {
                    dispatch(setPosition('center'));
                  }
                  navigation.navigate(route.name);
                }
              };

              return (
                <Pressable
                  style={{
                    flex: isFocused ? 1 : 0,
                    marginRight:
                      route.name == 'Profile' ? 0 : widthResponse ? 5 : 12, //@@
                    marginLeft:
                      route.name == 'Dashboard' ? 0 : widthResponse ? 5 : 12, //@@
                  }}
                  key={index}
                  onPress={onPress}>
                  <View
                    style={[
                      {
                        flexDirection:
                          route.name == 'Profile' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        borderRadius: 100,
                        overflow: 'hidden',
                      },
                    ]}>
                    {/* icon */}
                    <View
                      style={{
                        backgroundColor: isFocused ? 'orange' : 'transparent',
                        borderRadius: 100,
                        zIndex: 10,
                        height: widthResponse ? 43 : 70,
                        width: widthResponse ? 43 : 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {route.name == 'Carts' && cart && cart.length > 0 && (
                        <Animatable.View
                          // animation={'bounceInDown'}
                          duration={500}
                          iterationCount={1}
                          style={{
                            position: 'absolute',
                            width: widthResponse ? 20 : 30, //@@
                            height: widthResponse ? 20 : 30, //@@
                            borderRadius: 40,
                            backgroundColor: 'red',
                            top: widthResponse ? 6 : 10, //@@
                            right: widthResponse ? 3 : 7, //@@
                            zIndex: 5000,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 0.2,
                            borderColor: appColor.white,
                            shadowRadius: 8,
                            shadowOpacity: 0.5,
                            shadowColor: appColor.black,
                          }}>
                          <Text
                            style={{
                              fontFamily: appFont.bB,
                              marginBottom: -2,
                              fontSize: fontScalling(1.8),
                              color: appColor.white,
                            }}>
                            {cart.length}
                          </Text>
                        </Animatable.View>
                      )}
                      {route.name == 'Menu' ? (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <LottieView
                            autoPlay={true}
                            loop={true}
                            duration={10000}
                            style={{
                              width: widthResponse ? 55 : 65,
                              height: widthResponse ? 55 : 65,
                            }}
                            source={require('../../assets/lottieFiles/foodMenu.json')}
                          />
                        </View>
                      ) : route.name == 'Order' ? (
                        <Image
                          style={{
                            height: widthResponse ? 30 : 50,
                            aspectRatio: 1,
                          }}
                          source={
                            isFocused
                              ? require('../../assets/images/delivery-man-hov.png')
                              : require('../../assets/images/delivery-man.png')
                          }
                        />
                      ) : (
                        <Icon
                          ComponentName={
                            route.name == 'Dashboard'
                              ? 'AntDesign'
                              : route.name == 'Carts'
                              ? 'AntDesign'
                              : route.name == 'Order'
                              ? 'Feather'
                              : route.name == 'Profile'
                              ? 'FontAwesome'
                              : // : route.name == 'Menu'
                                // ? 'Entypo'
                                null
                          }
                          name={
                            route.name == 'Dashboard'
                              ? 'home'
                              : route.name == 'Carts'
                              ? 'shoppingcart'
                              : route.name == 'Order'
                              ? 'package'
                              : route.name == 'Profile'
                              ? 'user-o'
                              : route.name == 'Menu'
                              ? 'bowl'
                              : null
                          }
                          color={appColor.bgWhite}
                          size={
                            route.name == 'Dashboard'
                              ? widthResponse
                                ? 20
                                : 40
                              : route.name == 'Carts'
                              ? widthResponse
                                ? 23
                                : 45
                              : route.name == 'Order'
                              ? widthResponse
                                ? 22
                                : 45
                              : route.name == 'Profile'
                              ? widthResponse
                                ? 20
                                : 40
                              : route.name == 'Menu'
                              ? widthResponse
                                ? 20
                                : 33
                              : null
                          }
                        />
                      )}
                    </View>
                    {/* name */}
                    {isFocused && (
                      <Animatable.View
                        duration={500}
                        delay={0}
                        animation={{
                          0: {
                            transform: [
                              {
                                translateX:
                                  route.name == 'Profile' ? width : -width,
                              },
                            ],
                            opacity: 0,
                          },
                          0.5: {
                            transform: [
                              {
                                translateX:
                                  route.name == 'Profile'
                                    ? width / 2
                                    : -width / 2,
                              },
                            ],
                            opacity: 0,
                          },
                          1: {
                            transform: [{translateX: 0}],
                            opacity: 1,
                          },
                        }}
                        style={[
                          {
                            left: -60,
                            // display: isFocused ? 'flex' : 'none',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // paddingHorizontal: 25,
                            paddingLeft: route.name != 'Profile' && 50,
                            paddingRight: route.name == 'Profile' && 50,
                            marginLeft: route.name == 'Profile' ? -60 : 0,
                            marginRight: route.name != 'Profile' ? -60 : 0,
                            zIndex: 5,
                            height: '100%',
                            borderRadius: 100,
                            backgroundColor: appColor.greyBack,
                            justifyContent: 'center',
                            backgroundColor: isFocused
                              ? appColor.greyBack
                              : 'transparent',
                          },
                        ]}>
                        <Text
                          style={{
                            paddingTop: 4,
                            fontFamily: appFont.bB,
                            fontSize: fontScalling(2),
                            paddingHorizontal: 10,
                            letterSpacing: widthResponse ? 1.3 : 3, //@@
                            textAlign: 'center',
                            color: appColor.textWhite,
                          }}>
                          {label}
                        </Text>
                      </Animatable.View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
};

const BottomTab = () => {
  const appColor = appColors();
  const {cart} = useSelector(state => state.cart);
  const {termsPage, bottomTab} = useSelector(state => state.title);
  const {allNotification} = useSelector(state => state.notification);
  const {userSettings} = useSelector(state => state.setting);
  const navigation = useNavigation();
  const notifeeTriggerRef = useRef(null);

  const dispatch = useDispatch();

  const allProducts =
    userSettings &&
    userSettings?.suggestions &&
    userSettings?.suggestions.length > 0
      ? userSettings?.suggestions.filter(dta => dta.type == 1)
      : [];

  useEffect(() => {
    // Function to handle the deep link
    const handleDeepLink = event => {
      const {url} = event;
      processUrl(url);
    };

    // Function to process the URL
    const processUrl = url => {
      if (!url) return;

      if (url.includes('www.fitsuvai.com')) {
        const recipeId = url.split('/').pop();
        // console.log(recipeId, 'recipeId');
        if (recipeId != '' && allProducts && allProducts.length > 0) {
          const findProduct = allProducts.find(
            data =>
              `${data.name.split(' ').join('-').trim()}-${
                data.size
              }`.toLocaleLowerCase() == recipeId.toLocaleLowerCase(),
          );
          if (
            findProduct &&
            Object.keys(findProduct).length > 0 &&
            findProduct.id
          ) {
            navigation.navigate('productDetail', {productId: findProduct.id});
          }
        } else {
          navigation.navigate('profile');
        }
      }
    };

    // Get the initial URL when the app is launched from a closed state
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      processUrl(initialUrl);
    };

    getInitialUrl();

    // Add event listener for when the app is opened from the background
    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    // Cleanup the event listener on unmount
    return () => {
      linkingListener.remove();
    };
  }, [navigation]);

  //foreground background and quit state handling
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(remoteMessage, 'onNotificationOpenedApp');
      if (remoteMessage) {
        navigation.navigate('notification');
        dispatch(userSettingApi());
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        // console.log(remoteMessage, 'getInitialNotification');
        if (remoteMessage) {
          switch (remoteMessage.data['route']) {
            case undefined:
              navigation.navigate('notification');
              break;
          }
        }
      });
  }, []);

  // useEffect(() => {
  //   return notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         break;
  //       case EventType.PRESS:
  //         navigation.navigate('notification');
  //         break;
  //     }
  //   });
  // }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          navigation.navigate('notification');
          break;
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (userSettings?.badge) {
        notifee.setBadgeCount(Number(userSettings.badge));
        const badgeCounts = await notifee.getBadgeCount();
        // console.log(badgeCounts, 'badgeCount');
      }
    })();
  }, [userSettings]);

  // background
  useEffect(() => {
    // const requestPermission = async () => {
    //   if (Platform.OS === 'ios' || 'android') {
    //     await messaging().requestPermission();
    //   }
    // };
    // requestPermission();
    //   // push notification permissions and token generation
    const registerBackgroundHandler = async () => {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        if (remoteMessage) {
          console.log(remoteMessage, 'registerBackgroundHandler');
          dispatch(userSettingApi());
        }
      });
    };
    registerBackgroundHandler();
  }, []);

  // foreground navigate:
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          console.log(detail, 'detail', type);
          navigation.navigate('notification');
          break;
      }
    });
  }, []);

  // // foreGround Message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {notification, messageId} = remoteMessage;
      if (!messageId) {
        console.error('Missing message ID');
        return;
      }
      // displayFloatingNotification(notification, messageId);
      console.log(remoteMessage, 'its work in foreground');
      if (remoteMessage) {
        dispatch(userSettingApi());
      }
      // notifeeTriggerRef.current += 2;
      // dispatch(setNotifeeTrigger(notifeeTriggerRef.current));
      Vibration.vibrate(60);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Tab.Navigator
        tabBar={props => {
          return !termsPage ? <CustomTabBar {...props} /> : null;
        }}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          // lazy: true,
        }}>
        <Tab.Screen
          name="Dashboard"
          component={DashBoardStack}
          options={{title: 'home'}}
        />
        <Tab.Screen
          name="Carts"
          component={CartStack}
          options={{title: 'Cart'}}
        />
        <Tab.Screen name="Menu" component={MenuStack} />
        <Tab.Screen name="Order" component={OrderStack} options={{}} />
        <Tab.Screen name="Profile" component={ProfileStack} options={{}} />
      </Tab.Navigator>
    </>
  );
};

export default BottomTab;
