import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// file import:
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useShowToast} from '../../components/Toast/ToastAlert';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  arrayLength,
  fontScalling,
  objectLength,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import ProductCard from '../../components/Card/ProductCard';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import SideHeading from '../../components/Card/SideHeading';
import {SvgUri} from 'react-native-svg';
import SliderCarosal from '../../components/Sliders/SliderCarosal';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {url} from '../../utilities/appApi';
import SplashScreen from 'react-native-splash-screen';
import {DashShimmer} from '../../utilities/appShimmer';
import Carousel from 'react-native-reanimated-carousel';
import {
  setAssesmentRoute,
  setBottomTabPress,
  setVegToggle,
  userSettingApi,
} from '../../redux/SettingSlice';
import {setSummeryContent} from '../../redux/SummerySlice';
import LottieView from 'lottie-react-native';
import Toggle from '../../components/Buttons/Toggle';
import FastImage from 'react-native-fast-image';
import BottomCard from '../../components/Card/BottomCard';
import useVoiceRecognition from '../../utilities/useVoiceRecognition';
import VoiceRecordCard from '../../components/Card/VoiceRecordCard';
import RecordModal from '../../components/Card/RecordModal';
import {setTitle} from '../../redux/titleSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserType} from '../../redux/authSlice';

const baseOptions = {
  vertical: false,
  width: scrnWidth * 0.4,
  height: scrnWidth * 0.45,
};

const AssessmentCorousel = ({homeData}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const navigation = useNavigation();
  const [assesMentIndex, setAssIndex] = useState(0);
  const [assInd, setAssInd] = useState(0);
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1}}>
      <FastImage
        source={require('../../../assets/images/assesment_bg.png')}
        resizeMode="cover"
        style={[{...StyleSheet.absoluteFillObject}, styles.assesMentContainer]}
      />
      <View style={styles.assesMentContainer}>
        <View style={styles.assInnerCon}>
          <Text
            style={{
              color: appColor.white,
              fontFamily: appFont.bB,
              fontSize: fontScalling(2.7),
              paddingTop: 5,
              paddingBottom: 5,
              textAlign: 'center',
            }}>
            Top Deals Provided from
          </Text>
          <Text
            style={{
              color: appColor.bgBlack,
              fontFamily: appFont.bB,
              fontSize: fontScalling(2.5),
              paddingBottom: 10,
              textAlign: 'center',
            }}>
            Fitsuvai company
          </Text>
          <View
            style={{
              marginTop: 10, //@@
            }}>
            {homeData &&
              homeData.assessments &&
              homeData.assessments.length > 0 && (
                <>
                  <Carousel
                    {...baseOptions}
                    loop={true}
                    // ref={ref}
                    panGestureHandlerProps={{activeOffsetX: [-10, 10]}}
                    overscrollEnabled={true}
                    style={{
                      width: '100%',
                      height: scrnWidth / (widthResponse ? 2.2 : 2.5),
                      borderRadius: 15,
                      overflow: 'hidden',
                    }} //@@
                    autoPlay={true}
                    autoPlayInterval={1500}
                    data={homeData.assessments}
                    pagingEnabled={true}
                    onSnapToItem={index => {
                      return setAssIndex(index);
                    }}
                    renderItem={({item, index}) => {
                      return (
                        <Pressable
                          onPress={() => {
                            dispatch(setAssesmentRoute(true));
                            setAssInd(index);
                            navigation.navigate('assesments', {
                              id: item.id,
                              assName: item.name,
                            });
                          }}>
                          <Animatable.View
                            animation={'zoomIn'}
                            duration={index * 200}
                            key={index}
                            style={[
                              styles.assCard,
                              {
                                backgroundColor: appColor.white,
                                elevation: 2,
                                shadowOpacity: 0.5,
                                shadowRadius: 3,
                                shadowOffset: {height: 2},
                              },
                            ]}>
                            <View
                              style={{
                                backgroundColor: appColor.white,
                                padding: widthResponse ? 8 : 15,
                                borderRadius: 200, //@@
                                height: scrnWidth / (widthResponse ? 3.7 : 4.5), //@@
                                width: scrnWidth / (widthResponse ? 3.7 : 4.5), //@@
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: widthResponse ? 15 : 20, //@@
                                elevation: 8,
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                                shadowOffset: {height: 2},
                              }}>
                              {item.image &&
                              item.image.split('.').pop().toLowerCase() ==
                                'SVG' ? (
                                <SvgUri
                                  fill={
                                    assInd !== index
                                      ? appColor.black
                                      : appColor.white
                                  }
                                  width={scrnWidth / 8}
                                  height={scrnWidth / 8}
                                  uri={item.image}
                                />
                              ) : item.image.split('.').pop().toLowerCase() ==
                                  'png' ||
                                'JPEG' ||
                                'WEBG' ? (
                                <FastImage
                                  resizeMode="cover"
                                  style={{
                                    width: '100%', //@@
                                    height: '100%', //@@
                                    borderRadius: 200, //@@
                                    backgroundColor: appColor.TextInputborderbg,
                                  }}
                                  source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                  }}
                                />
                              ) : null}
                            </View>
                            <Text
                              style={{
                                color: appColor.textGrey,
                                fontFamily: appFont.bB,
                                fontSize: widthResponse
                                  ? fontScalling(1.8)
                                  : fontScalling(2), //@@
                                paddingBottom: 10,
                                textTransform: 'capitalize',
                                textAlign: 'center',
                              }}>
                              {item.name}
                            </Text>
                          </Animatable.View>
                        </Pressable>
                      );
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 20, //@@
                      marginBottom: 10, //@@
                      // backgroundColor: appColor.textGrey,
                      paddingVertical: 2.5,
                      paddingHorizontal: 8,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {homeData.assessments.map((item, index) => {
                      return (
                        <Animatable.View
                          animation={'zoomIn'}
                          duration={1000 * index}
                          key={index}
                          style={{
                            //@@
                            width: widthResponse
                              ? assesMentIndex == index
                                ? 20
                                : 6
                              : assesMentIndex == index
                              ? 30
                              : 10,
                            height: widthResponse ? 6 : 10,
                            borderRadius: 15,
                            borderWidth: 0.8,
                            borderColor: appColor.Textlightblack,
                            backgroundColor:
                              assesMentIndex == index
                                ? appColor.greyBg
                                : 'transparent',
                            alignSelf: 'center',
                            marginRight:
                              homeData.assessments.length - 1 == index
                                ? 0
                                : widthResponse
                                ? 10
                                : 20,
                          }}></Animatable.View>
                      );
                    })}
                  </View>
                </>
              )}
          </View>
        </View>
      </View>
    </View>
  );
};

const DashBoard = ({navigation}) => {
  const appColor = appColors();
  const showToast = useShowToast();
  const isFocus = useIsFocused();
  const {styles} = useStyle();
  const {userType} = useSelector(state => state.auth);
  const {vegToggle, AppContents, assesmentRoute, bottomTabPress, userSettings} =
    useSelector(state => state.setting);
  const {
    results,
    permissionModal,
    setPermissionModal,
    checkPermission,
    startRecognizing,
  } = useVoiceRecognition();

  const scrollRef = useRef(null);
  const safeArea = useSafeAreaInsets();

  const dispatch = useDispatch();

  const [backPressCount, setBackPressCount] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState({
    show: false,
    height: 0,
  });

  const [homeData, setHomeDatas] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // chatbot
  const [chatbot, setChatbot] = useState(false);
  const [chatArray, setChatArray] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [formObj, setFormObj] = useState({
    input: '',
  });
  const [dyKeyWord, setDyKeyWord] = useState('Search Your Favourite Food');
  const botRef = useRef(null);

  useEffect(() => {
    let interval;
    if (
      isFocus &&
      userSettings &&
      userSettings?.suggestions &&
      userSettings?.suggestions.length > 0
    ) {
      let foods = userSettings?.suggestions.filter(data =>
        data.vegetartin_foods == (vegToggle && vegToggle) ? '1' : '0',
      );
      interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * foods.length);
        setDyKeyWord(foods[randomIndex].name);
      }, 2000);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isFocus, userSettings?.suggestions]);

  // api
  const apiCall = async () => {
    try {
      const formData = new FormData();
      // request data for backend:
      formData.append('veg_filter', vegToggle ? 1 : 0);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (Object.keys(homeData).length == 0) {
        setLoad(true);
      }
      // get the response:
      const response = await fetch(url().home, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'Success') {
          setHomeDatas(resparse.data);
        }
      } else {
        print(response.status, 'status in home screen');
      }
      setLoad(false);
      setRefresh(false);
      SplashScreen.hide();
      // requestLocationPermission();
    } catch (e) {
      console.log(e, 'error in home screen');
      setRefresh(false);
      setLoad(false);
      SplashScreen.hide();
    }
  };

  function applySizeFilterWithRate(products) {
    const filteredProducts = [];
    const processedProductNames = new Set();

    // Group products by name
    const groupedProducts = products.reduce((groups, product) => {
      if (!groups[product.name]) {
        groups[product.name] = [];
      }
      groups[product.name].push(product);
      return groups;
    }, {});

    // print(groupedProducts, 'groupedProducts');

    // Process grouped products
    for (const [productName, productVariants] of Object.entries(
      groupedProducts,
    )) {
      if (!processedProductNames.has(productName)) {
        let selectedProduct = null;

        // Extract sizes for the product
        const sizes = productVariants.map(variant =>
          variant.size.toLowerCase(),
        );
        // Determine the size to use for pricing based on the rules
        let selectedSize = null;
        if (
          sizes.includes('small') &&
          sizes.includes('medium') &&
          sizes.includes('large')
        ) {
          selectedSize = 'medium';
        } else if (sizes.includes('small') && sizes.includes('large')) {
          selectedSize = 'small';
        } else if (sizes.includes('medium') && sizes.includes('large')) {
          selectedSize = 'medium';
        } else if (sizes.includes('medium')) {
          selectedSize = 'medium';
        } else if (sizes.includes('large')) {
          selectedSize = 'medium';
        } else if (sizes.includes('small')) {
          selectedSize = 'small';
        }

        // Find the product variant with the selected size
        selectedProduct = productVariants.find(
          variant => variant.size.toLowerCase() === selectedSize,
        );

        // Add the selected product to the result
        if (selectedProduct) {
          filteredProducts.push(selectedProduct);
          processedProductNames.add(productName); // Mark product as processed
        }
      }
    }
    return filteredProducts;
  }

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      apiCall();
      dispatch(userSettingApi());
    }
  }, [refresh]);

  // initial api & pagination:
  useEffect(() => {
    if (!refresh) {
      apiCall();
    }
  }, [vegToggle]);

  // reset the assessment:
  useEffect(() => {
    if (assesmentRoute && isFocus) {
      dispatch(setAssesmentRoute(false));
    }
    dispatch(
      setSummeryContent({
        bmi: '',
        yourMeal: '',
        yourGoal: '',
        age: '',
        weight: '',
        activity: '',
      }),
    );
  }, [isFocus]);

  // hit back to back press:
  useEffect(() => {
    if (isFocus) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (backPressCount === 0) {
            setBackPressCount(1);
            showToast(
              'custom',
              'Press Again',
              'Please press again to back',
              2000,
            );
            setTimeout(() => setBackPressCount(0), 2000);
          } else if (backPressCount === 1) {
            BackHandler.exitApp();
          }
          return true;
        },
      );
      return () => backHandler.remove();
    } else {
      setBackPressCount(0);
    }
  }, [backPressCount, isFocus]);

  //when the keyboard based chatbot:
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardVisible({
          show: true,
          height: e.endCoordinates.height,
        });
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible({
          show: false,
          height: 0,
        });
      },
    );

    // Cleanup the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // chatbotOption:
  const ChatbotOption = ({data, isPress}) => {
    const [press, setPress] = useState(false);
    const appColor = appColors();

    return (
      <Pressable
        onPress={() => {
          if (isPress) {
            setChatArray(pre => [
              ...pre,
              {
                chatbot: '',
                user: data,
                options: [],
              },
            ]);
            apiBotCall(false, data);
          }
        }}
        onPressIn={() => isPress && setPress(true)}
        onPressOut={() => isPress && setPress(false)}
        style={{
          borderRadius: 25,
          margin: 5,
          paddingHorizontal: 8,
          justifyContent: 'center',
          backgroundColor: press ? appColor.themeYellow : appColor.bgWhite,
          elevation: 2,
          shadowOpacity: 0.15,
          shadowOffset: 1,
          shadowRadius: 10,
        }}>
        <Text
          style={{
            padding: 10,
            fontSize: fontScalling(1.7),
            color: press ? appColor.textWhite : appColor.textBlack,
            fontFamily: appFont.rM,
          }}>
          {data}
        </Text>
      </Pressable>
    );
  };

  // api
  const apiBotCall = async (initial = false, options) => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      let formVar = {};
      if (!initial) {
        for (let [key, val] of Object.entries(formObj)) {
          if (val == '') {
            formVar = {...formObj, [key]: options ? options : userInput};
          }
        }
        setFormObj(formVar);
        // console.log(formVar, 'formVar');
        formData.append('chatbot', JSON.stringify(formVar));
      }
      // print(formData, 'formData');

      var requestOptions = {
        method: 'POST',
        body: !initial ? formData : null,
      };
      // get the response:
      const response = await fetch(url().chatBot, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'chatbot');
        if (initial) {
          setChatArray([
            {
              chatbot: resparse.data.initial_message,
              user: '',
              options: resparse.data.suggestions,
            },
          ]);
          setFormObj({input: ''});
        } else if (resparse?.data?.input == '') {
          setChatArray(pre => [
            ...pre,
            {
              chatbot: resparse?.data?.response,
              user: '',
              options: resparse?.data?.suggestions
                ? resparse?.data?.suggestions
                : [],
            },
          ]);
          setFormObj({input: ''});
        } else if (resparse?.data?.input && resparse?.data?.input != '') {
          setChatArray(pre => [
            ...pre,
            {
              chatbot: resparse?.data?.response,
              user: '',
              options: resparse?.data?.suggestions
                ? resparse?.data?.suggestions
                : [],
            },
          ]);
          setFormObj(pre => ({...pre, [resparse?.data?.input]: ''}));
        }
      } else {
        console.log('Chatbot status code:', response.status);
      }
    } catch (e) {
      console.log(e, 'error Chatbot');
    }
  };
  // console.log(formObj, 'form');

  useEffect(() => {
    apiBotCall(true);
  }, []);

  const Rotate = {
    //@@
    0: {
      transform: [{rotate: '0deg'}],
    },
    1: {
      transform: [{rotate: '360deg'}],
    },
  };

  const onPressTouch = () => {
    dispatch(setBottomTabPress(0));
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  useEffect(() => {
    if (bottomTabPress) {
      onPressTouch();
    }
  }, [bottomTabPress]);

  const chatbotScroll = () => {
    setTimeout(() => {
      botRef.current.scrollToEnd();
    }, 500);
  };

  useEffect(() => {
    if (botRef?.current) {
      chatbotScroll();
    }
  }, [keyboardVisible.show]);

  const slideDown = {
    0: {
      transform: [{translateY: 0}],
      // opacity: 1,
    },
    0.5: {
      transform: [{translateY: -5}],
      // opacity: 0.8,
    },
    1: {
      transform: [{translateY: 0}],
      // opacity: 1,
    },
  };

  return (
    <View style={{flex: 1, backgroundColor: appColor.white}}>
      <View style={{backgroundColor: appColor.bgBlack}}>
        <View
          style={[
            {
              marginHorizontal: 10,
              backgroundColor: appColor.cartBg,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
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
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: widthResponse ? -55 : -60,
          zIndex: 3,
          paddingBottom: 4,
        }}>
        <Pressable
          style={[
            styles.searchContainer,
            {flex: 1, justifyContent: 'space-between'},
          ]}
          onPress={() => {
            navigation.navigate('search');
          }}>
          <Icon
            ComponentName={'FontAwesome'}
            name={'search'}
            color={appColor.Textlightblack}
            size={widthResponse ? 20 : 25}
          />
          <Animatable.Text
            animation={'zoomIn'}
            duration={1000}
            iterationCount={'infinite'}
            style={styles.placeHolderStyle}>
            {dyKeyWord}
          </Animatable.Text>
          <Pressable
            onPress={async () => {
              const isEnabled = await checkPermission();
              console.log(isEnabled, 'isEnabled');
              if (isEnabled) {
                navigation.navigate('search', {query: true}); // Pass result to next screen
              } else {
                setPermissionModal(true);
              }
            }}
            style={{
              paddingHorizontal: 10,
              borderLeftWidth: 2,
              borderLeftColor: appColor.borderColor,
            }}>
            <Icon
              ComponentName={'FontAwesome'}
              name={'microphone'}
              color={appColor.ratingGold}
              size={widthResponse ? 23 : 25}
            />
          </Pressable>
        </Pressable>
        <Animatable.View
          animation={'zoomIn'}
          duration={400}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: appColor.borderColor,
            marginRight: 20,
            paddingHorizontal: 3,
            // borderWidth: 1,
            borderRadius: 15,
            marginLeft: 5,
            paddingVertical: 2,
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
      </View>
      {load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <DashShimmer />
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: appColor.cartBg,
            overflow: 'visible',
            // alignItems: 'center',
          }}>
          <ScrollView
            ref={scrollRef}
            maximumZoomScale={3}
            contentContainerStyle={{paddingBottom: widthResponse ? 91 : 140}} //@@
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[appColor.themeYellow]}
                tintColor={appColor.themeYellow}
              />
            }
            showsVerticalScrollIndicator={false}>
            {/* Deals Banner */}
            {objectLength(homeData) && arrayLength(homeData.banner) && (
              <View style={styles.banner1Bg}>
                <FastImage
                  source={{
                    priority: FastImage.priority.high,
                    uri: homeData?.banner[0]?.backgroundimage,
                  }}
                  resizeMode="cover"
                  style={{...StyleSheet.absoluteFillObject}}
                />
                <View style={styles.bnrContainer}>
                  {/* left container */}
                  <View style={[styles.leftContainer]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {homeData?.banner[0]?.heading &&
                        homeData?.banner[0]?.heading
                          .split(' ')
                          .map((data, index) => {
                            // print(index, 'index');
                            return (
                              <Text
                                key={index}
                                style={{
                                  color:
                                    index ==
                                    homeData?.banner[0].heading.split(' ')
                                      .length -
                                      1
                                      ? appColor.gold
                                      : appColor.white,
                                  fontFamily: appFont.bB,
                                  fontSize: fontScalling(3.5),
                                  marginBottom: 10,
                                  paddingRight: 5,
                                }}>
                                {data}
                              </Text>
                            );
                          })}
                      {homeData?.banner[0]?.button_text &&
                        homeData?.banner[0]?.button_text != '' && (
                          <Animatable.View animation={'zoomIn'} duration={1000}>
                            <Pressable
                              onPress={() => {
                                navigation.navigate('menu');
                              }}
                              style={{
                                backgroundColor: appColor.white,
                                marginTop: widthResponse ? 10 : 20,
                                paddingVertical: widthResponse ? 7 : 12,
                                paddingHorizontal: widthResponse ? 15 : 25,
                                borderRadius: 15,
                                elevation: 3,
                              }}>
                              <Text
                                style={{
                                  color: appColor.black,
                                  fontFamily: appFont.bB,
                                  fontSize: fontScalling(
                                    widthResponse ? 2 : 2.5,
                                  ),
                                  marginBottom: -3,
                                }}>
                                {homeData?.banner[0]?.button_text}
                              </Text>
                            </Pressable>
                          </Animatable.View>
                        )}
                    </View>
                  </View>
                  {/* right container   //@@ */}
                  <View style={styles.rightContainer}>
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transform: [{rotate: '45deg'}],
                        },
                      ]}>
                      <Animatable.View
                        resizeMode="contain"
                        animation={'bounceIn'}
                        duration={1500}
                        delay={100}>
                        <FastImage
                          resizeMethod="cover"
                          style={{
                            width: scrnWidth / 4.6, //@@
                            height: scrnWidth / 4.6, //@@
                          }}
                          source={{
                            priority: FastImage.priority.high,
                            uri: homeData?.banner[0].image2,
                          }}
                        />
                      </Animatable.View>
                      <Animatable.View
                        animation={'bounceIn'}
                        duration={1500}
                        delay={100}>
                        <FastImage
                          resizeMethod="cover"
                          style={{
                            width: scrnWidth / 4.5,
                            height: scrnWidth / 4.5,
                          }}
                          source={{
                            priority: FastImage.priority.high,
                            uri: homeData?.banner[0].image3,
                          }}
                        />
                      </Animatable.View>
                      <Animatable.View
                        animation={'zoomIn'}
                        duration={500}
                        delay={1000}
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bottom: 5,
                          right: 5,
                        }}>
                        <Animatable.View
                          animation={Rotate}
                          easing={'linear'}
                          duration={6000}
                          iterationCount={'infinite'}>
                          <FastImage
                            source={{
                              uri: homeData?.banner[0].image1,
                              priority: FastImage.priority.high,
                            }}
                            style={{
                              width: scrnWidth / 3.3,
                              height: scrnWidth / 3.3,
                            }}
                          />
                        </Animatable.View>
                      </Animatable.View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Sign up Intimation Block */}
            {userType === 'guest' && (
              <Pressable
                onPress={() => navigation.navigate('register')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 10,
                  borderColor: appColor.ratingGold,
                  borderWidth: 1,
                  marginHorizontal: 15,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  // marginBottom: 10,
                  backgroundColor: appColor.cardBack,
                  elevation: 10,
                  shadowColor: appColor.gold,
                  // width:'100%'
                }}>
                <Text
                  style={[
                    {
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(2),
                      color: appColor.gold,
                      width: '85%',
                    },
                  ]}>
                  Sign up now to receive exclusive offers & access to new
                  courses.
                </Text>
                <Animatable.View
                  style={{
                    borderRadius: 30,
                    borderColor: appColor.borderColor,
                    borderWidth: 0.7,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10,
                    shadowColor: appColor.ToastSuccess,
                    shadowRadius: 10,
                    shadowOpacity: 0.3,
                    shadowOffset: {height: 0},
                    backgroundColor: appColor.cardbg,
                  }}
                  animation={'zoomIn'}
                  iterationCount={'infinite'}
                  iterationDelay={500}>
                  <Icon
                    color={appColor.bgBlack}
                    size={15}
                    ComponentName={'Entypo'}
                    name={'login'}
                  />
                </Animatable.View>
              </Pressable>
            )}

            {/* Assesment container */}
            {homeData &&
              homeData.assessments &&
              homeData.assessments.length > 0 && (
                <AssessmentCorousel homeData={homeData} />
              )}

            {/* healthySnacks */}
            {objectLength(homeData) && arrayLength(homeData.healthySnacks) && (
              <>
                {/* Side Heading */}
                <SideHeading
                  title={'Super Bowls / Super Meals'}
                  onPress={() =>
                    navigation.navigate('productOverView', {
                      context: 'filteredProducts',
                      name: 'healthySnacks',
                    })
                  }
                />
                {/* card section */}
                <View
                  style={{
                    marginLeft: 15,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={applySizeFilterWithRate(homeData.healthySnacks).slice(
                      0,
                      4,
                    )}
                    style={{overflow: 'visible', marginVertical: 5}}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => {
                      return (
                        <ProductCard key={index} item={item} ind={index} />
                      );
                    }}
                  />
                </View>
              </>
            )}

            {/* Banner slider_1 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock1) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginTop: 30,
                }}>
                <SliderCarosal data={homeData.bannerBlock1} />
              </View>
            )}

            {/* vegetarianJuice */}
            {objectLength(homeData) &&
              arrayLength(homeData.vegetarianJuice) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Vegetarian food'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'vegetarian',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={applySizeFilterWithRate(
                        homeData.vegetarianJuice,
                      ).slice(0, 4)}
                      style={{overflow: 'visible', marginVertical: 5}}
                      keyExtractor={(item, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}

            {/* Banner slider_2 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock2) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  marginTop: 30,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}>
                <SliderCarosal data={homeData.bannerBlock2} />
              </View>
            )}

            {/* Banner slider_3 */}
            {objectLength(homeData) && arrayLength(homeData.bannerBlock2) && (
              <View
                style={{
                  marginLeft: 15,
                  marginVertical: 15,
                  marginTop: 30,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}>
                <SliderCarosal data={homeData.bannerBlock3} />
              </View>
            )}

            {/* Body Building Meals */}
            {objectLength(homeData) &&
              arrayLength(homeData.bodyBuildingmeals) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Healthy Quick Bites'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'bodyBuildingMeals',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={applySizeFilterWithRate(
                        homeData.bodyBuildingmeals,
                      ).slice(0, 4)}
                      style={{overflow: 'visible', marginVertical: 5}}
                      keyExtractor={(item, ind) => item.name.toString()}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}
            {/* traditionalFoods */}
            {objectLength(homeData) &&
              arrayLength(homeData.traditionalFoods) && (
                <>
                  {/* Side Heading */}
                  <SideHeading
                    title={'Traditional Foods'}
                    onPress={() =>
                      navigation.navigate('productOverView', {
                        context: 'filteredProducts',
                        name: 'traditionalFoods',
                      })
                    }
                  />
                  {/* card section */}
                  <View
                    style={{
                      marginLeft: 15,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      style={{overflow: 'visible', marginVertical: 5}}
                      data={applySizeFilterWithRate(
                        homeData.traditionalFoods,
                      ).slice(0, 6)}
                      keyExtractor={(data, index) => index}
                      renderItem={({item, index}) => {
                        return (
                          <ProductCard key={index} item={item} ind={index} />
                        );
                      }}
                    />
                  </View>
                </>
              )}

            {/* usp Content */}
            {((AppContents && AppContents?.usp?.length > 0) ||
              (AppContents && AppContents.fssai_pdf != '')) && (
              <View
                style={{
                  // height: scrnHeight / 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: widthResponse ? 10 : 15,
                  paddingVertical: widthResponse ? 15 : 20,
                  paddingHorizontal: 20,
                  marginHorizontal: 15,
                  overflow: 'hidden',
                  borderRadius: widthResponse ? 10 : 15,
                  flex: 1,
                }}>
                <FastImage
                  source={require('../../../assets/images/assesment_bg.png')}
                  style={{...StyleSheet.absoluteFillObject}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: widthResponse ? 8 : 17,
                    width: '100%',
                  }}>
                  {AppContents && AppContents.fssai_pdf != '' && (
                    <Pressable
                      onPress={() => {
                        dispatch(setTitle('FitSuvai Fssai'));
                        navigation.navigate('menuScreen', {
                          menuPdf: AppContents.fssai_pdf,
                          scrnShot: false,
                        });
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.roboto_light,
                          {
                            color: appColor.white,
                            fontSize: fontScalling(2.2),
                            fontFamily: appFont.bR,
                            textDecorationLine: 'underline',
                          },
                        ]}>
                        Fssai Certified :
                      </Text>
                      <FastImage
                        source={require('../../../assets/images/fssai.png')}
                        style={{
                          resizeMode: 'cover',
                          height: widthResponse ? 20 : 30,
                          borderRadius: 200,
                          width: widthResponse ? 40 : 60,
                          marginHorizontal: widthResponse ? 10 : 15,
                        }}
                      />
                      <Icon
                        color={appColor.white}
                        size={widthResponse ? 21 : 28}
                        ComponentName={'FontAwesome'}
                        name={'file-pdf-o'}
                      />
                    </Pressable>
                  )}
                </View>
                {AppContents && AppContents?.usp?.length > 0 && (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={{
                      borderRadius: 5,
                    }}
                    data={AppContents.usp}
                    renderItem={({item, index}) => {
                      return <BottomCard item={item} />;
                    }}
                  />
                )}
              </View>
            )}
          </ScrollView>

          {/* Sticky Blocks */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: widthResponse ? 90 : 140, //@@
              overflow: 'hidden',
              right: widthResponse ? 8 : 15,
            }}>
            {/* menu */}
            <Pressable
              onPress={() => {
                navigation.navigate('menu');
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: widthResponse ? 50 : 65,
                aspectRatio: 1,
                borderRadius: 60,
                backgroundColor: appColor.bgBlack,
                padding: widthResponse ? 12 : 15,
              }}>
              <Animatable.Image
                animation={'bounceIn'}
                duration={1000}
                resizeMode="contain"
                style={{
                  width: '90%',
                  height: '90%',
                }}
                source={require('../../../assets/images/book.png')}
              />
              <Text
                style={[
                  {
                    color: appColor.white,
                    fontFamily: appFont.bB,
                    paddingTop: widthResponse ? 2.5 : 4,
                    fontSize: fontScalling(widthResponse ? 1.5 : 1.6),
                    letterSpacing: 1,
                  },
                ]}>
                Menu
              </Text>
            </Pressable>
            {/* chat bot logo */}
            <Pressable
              onPress={() => setChatbot(true)}
              style={{
                marginTop: widthResponse ? 5 : 10,
                alignItems: 'center',
              }}>
              <LottieView
                resizeMode="contain"
                autoPlay={true}
                style={{width: widthResponse ? 85 : 90, aspectRatio: 1}}
                source={{
                  uri: 'https://lottie.host/27aeaf27-5b9e-4b35-b68f-4d722547dba7/JvTWInRvvO.lottie',
                }}
              />
              <Animatable.Text
                animation={slideDown}
                duration={1000}
                delay={1500}
                easing={'ease'}
                iterationCount={'infinite'}
                iterationDelay={500}
                style={{
                  color: appColor.white,
                  fontSize: fontScalling(widthResponse ? 1.5 : 1.7),
                  fontFamily: appFont.rM,
                  marginTop: -5,
                  marginBottom: 5,
                  borderRadius: 10,
                  overflow: 'hidden',
                  paddingHorizontal: widthResponse ? 5 : 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                  backgroundColor: appColor.bgBlack,
                }}>
                Chat
              </Animatable.Text>
            </Pressable>
          </View>

          {/* chatbot modal */}
          <ModalBottomSheet
            snapPoints={[
              widthResponse ? '90%' : '70%',
              widthResponse ? '90%' : '70%',
            ]}
            isVisible={chatbot}
            chatbot
            close={() => setChatbot(false)}>
            <View
              style={{
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                backgroundColor: appColor.bgWhite,
              }}>
              {/* header */}
              <View
                style={{
                  backgroundColor: appColor.themeYellow,
                  paddingHorizontal: widthResponse ? 15 : 20,
                  paddingVertical: widthResponse ? 15 : 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  ComponentName={'MaterialIcons'}
                  name={'chat'}
                  size={widthResponse ? 35 : 40}
                  color={appColor.bgWhite}
                />
                <Text
                  style={{
                    color: appColor.textWhite,
                    fontSize: fontScalling(3.2),
                    marginLeft: widthResponse ? 10 : 15,
                    fontFamily: appFont.bB,
                  }}>
                  Chat with our chatbot
                </Text>
                <Pressable
                  onPress={() => setChatbot(false)}
                  style={{
                    marginLeft: 'auto',
                  }}>
                  <Icon
                    ComponentName={'Fontisto'}
                    name={'close-a'}
                    size={20}
                    color={appColor.bgWhite}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                {/* chats */}
                <View style={{flex: 1}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    data={chatArray}
                    ref={botRef}
                    onContentSizeChange={chatbotScroll}
                    contentContainerStyle={{
                      paddingTop: widthResponse ? 20 : 25,
                      paddingBottom: widthResponse ? 0 : 25,
                      paddingHorizontal: widthResponse ? 20 : 25,
                    }}
                    ItemSeparatorComponent={() => {
                      return (
                        <View style={{marginBottom: widthResponse ? 15 : 20}} />
                      );
                    }}
                    renderItem={({item, index}) => {
                      return (
                        <View key={index}>
                          {/* chatbot message */}
                          {item.chatbot && item.chatbot != '' && (
                            <View
                              style={{
                                backgroundColor: appColor.bgBlack,
                                maxWidth: '70%',
                                marginRight: 'auto',
                                // marginBottom: widthResponse ? 15 : 20,
                                borderRadius: 15,
                                padding: 10,
                                borderBottomLeftRadius: 0,
                              }}>
                              <Text
                                style={{
                                  color: appColor.textWhite,
                                  fontFamily: appFont.rM,
                                  fontSize: fontScalling(1.7),
                                }}>
                                {item.chatbot}
                              </Text>
                            </View>
                          )}
                          {/* options */}
                          {item.options && item.options.length > 0 && (
                            <View
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                flexWrap: 'wrap',
                                opacity:
                                  chatArray.length - 1 == index ? 1 : 0.5,
                                zIndex: chatArray.length - 1 == index ? 15 : -1,
                                marginTop: widthResponse ? 15 : 20,
                              }}>
                              {item.options.map((data, i) => {
                                return (
                                  <ChatbotOption
                                    key={i}
                                    data={data}
                                    isPress={chatArray.length - 1 == index}
                                  />
                                );
                              })}
                            </View>
                          )}
                          {/* user Reply */}
                          {item.user && item.user != '' && (
                            <View
                              style={{
                                backgroundColor: appColor.greyBg,
                                maxWidth: '70%',
                                marginLeft: 'auto',
                                // marginBottom: widthResponse ? 15 : 20,
                                borderRadius: 15,
                                padding: 10,
                                borderBottomRightRadius: 0,
                              }}>
                              <Text
                                style={{
                                  fontSize: fontScalling(1.7),
                                  color: appColor.textBlack,
                                  fontFamily: appFont.rM,
                                }}>
                                {item.user}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
                {/* footer */}
                <View
                  style={{
                    paddingBottom:
                      (!keyboardVisible.show && safeArea.bottom != 0
                        ? safeArea.bottom
                        : widthResponse
                        ? 10
                        : 15) + keyboardVisible.height,
                    paddingHorizontal: widthResponse ? 20 : 25,
                    marginTop: widthResponse ? 10 : 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => apiBotCall(true)}>
                    <Icon
                      ComponentName={'Ionicons'}
                      name={'reload'}
                      size={widthResponse ? 25 : 30}
                      color={appColor.bgBlack}
                    />
                  </TouchableOpacity>
                  {/* input */}
                  <View
                    style={{
                      backgroundColor: appColor.greyBg,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginLeft: 10,
                      padding: 5,
                      paddingHorizontal: 10,
                    }}>
                    <TextInput
                      onChangeText={e => {
                        setUserInput(e);
                      }}
                      // autoFocus={true}
                      value={userInput}
                      style={{padding: 6, flex: 1, paddingRight: 10}}
                      placeholder="Ask your questions"
                      placeholderTextColor={appColor.placeHolderTextDark}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (userInput != '') {
                          setChatArray(pre => [
                            ...pre,
                            {
                              chatbot: '',
                              user: userInput,
                              options: [],
                            },
                          ]);
                          apiBotCall();
                          setUserInput('');
                        }
                      }}>
                      <Icon
                        ComponentName={'FontAwesome'}
                        name={'send'}
                        size={widthResponse ? 23 : 30}
                        color={appColor.Textlightblack}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ModalBottomSheet>
          {/* Modal for Voice recoganizing */}
          <VoiceRecordCard results={results} />
          <RecordModal
            isVisible={permissionModal}
            setPermissionModal={setPermissionModal}
            startRecognizing={startRecognizing}
            isDashboard={true}
          />
        </View>
      )}
    </View>
  );
};

export default DashBoard;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    ScrContainer: {
      overflow: 'visible',
      backgroundColor: appColor.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      paddingTop: 10,
      zIndex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderRadius: 15,
      backgroundColor: appColor.white,
      justifyContent: 'flex-start',
      // marginHorizontal: 20,
      marginLeft: 25,
      // marginTop: -55,
      zIndex: 3,
      overflow: 'visible',
      shadowOpacity: 0.2,
      shadowOffset: {height: 0},
      shadowRadius: 10,
    },
    placeHolderStyle: {
      fontFamily: appFont.rR,
      color: appColor.placeHolderText,
      fontSize: fontScalling(2),
      paddingLeft: 10,
    },
    banner1Bg: {
      width: scrnWidth - 30,
      flexDirection: 'row',
      marginBottom: widthResponse ? 15 : 30, //@@
      borderRadius: widthResponse ? 10 : 25, //@@
      overflow: 'hidden',
      alignSelf: 'center',
      marginVertical: 20,
    },
    bnrContainer: {
      paddingVertical: widthResponse ? 20 : 30,
      justifyContent: 'space-between',
      width: '100%',
      minHeight: scrnWidth / 2.3, //@@
      flexDirection: 'row',
    },
    leftContainer: {
      width: '50%',
      // height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: 30,
    },
    rightContainer: {
      width: '42%', //@@
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    assesMentContainer: {
      // width: '100%',
      paddingVertical: 15,
      marginTop: 15,
      overflow: 'hidden',
      borderRadius: widthResponse ? 10 : 15,
      elevation: 2,
      marginHorizontal: 15,
    },
    assInnerCon: {
      paddingHorizontal: widthResponse ? 15 : 20,
      paddingBottom: 8,
    },
    assCard: {
      // borderWidth: 1.5,
      paddingHorizontal: 15,
      borderRadius: 15,
      width: scrnWidth / (widthResponse ? 2.7 : 3), //@@
      height: scrnWidth / (widthResponse ? 2.2 : 2.5), //@@
      alignItems: 'center',
      justifyContent: 'center', //@@
      overflow: 'hidden',
      // marginBottom: 25,
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
  });
  return {styles};
};
