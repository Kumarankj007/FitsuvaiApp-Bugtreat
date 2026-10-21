import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useIsFocused} from '@react-navigation/native';
// file import:
import {appFont} from '../../utilities/appFont';
import {
  authReset,
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {InputText} from '../../components/InputField/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {url} from '../../utilities/appApi';
import {useShowToast} from '../../components/Toast/ToastAlert';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setUserSkipOption,
  setProfileData,
  setUserType,
} from '../../redux/authSlice';
import SplashScreen from 'react-native-splash-screen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardVisible from '../../Hooks/KeyboardVisible';

const Login = ({navigation, route}) => {
  const appColor = appColors();
  const textFocus = useRef(null);
  const isFocus = useIsFocused();
  const showToast = useShowToast();
  const [load, setLoad] = useState(false);
  const keyboardVisible = KeyboardVisible(true);
  const dispatch = useDispatch();

  const {storeAddress} = useSelector(state => state.setting);

  const regEmail =
    route && route?.params && route?.params?.email && route?.params?.email != ''
      ? route?.params?.email
      : '';

  useEffect(() => {
    if (regEmail == '') {
      SplashScreen.hide();
      GoogleSignin.configure({
        webClientId: url().currentClientid,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      googleLogin(true);
    }
  }, []);

  const googleLogin = async (silent = false) => {
    setLoad(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      let userInfo;
      // Try silent sign-in first
      if (silent) {
        // userInfo = await GoogleSignin.signInSilently();
        userInfo = await GoogleSignin.signIn();
        console.log('Google One Tap Sign-In Silently:', userInfo);
      }

      //   if (!userInfo?.data?.user || !silent) {
      //     // If no saved credentials, trigger One Tap account creation
      //   }

      if (userInfo?.data?.user) {
        console.log('Google One Tap Sign-In Successful:', userInfo);

        // Retrieve last logged-in user from local storage
        const lastLoggedInUserEmail = await AsyncStorage.getItem(
          'lastLoggedInUserEmail',
        ); // or AsyncStorage
        console.log('Last Logged-In User Email:', lastLoggedInUserEmail);
        // Check if the current user is the same as the last logged-in user

        regApiCall(
          userInfo?.data?.user?.name,
          userInfo?.data?.user?.email,
          userInfo?.data?.user?.photo,
        );
        AsyncStorage.setItem(
          'lastLoggedInUserEmail',
          userInfo?.data?.user?.email,
        ); // Save the new user email
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.error('Google One Tap Sign-In Error:', error);
      setLoad(false);
    }
  };

  // reset the data:
  useEffect(() => {
    if (!isFocus) {
      reset();
    }
  }, [isFocus]);

  // validation:
  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email('Please Enter a valid Email')
        .required('Email is required'),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // api
  const apiCall = async (email = '') => {
    try {
      // request data for backend:
      // var myHeaders = new Headers();
      setLoad(true);
      const formData = new FormData();
      email && email != '' && formData.append('email', email);
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      // get the response:
      const response = await fetch(url().login, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // Keyboard.dismiss();
          showToast('success', '', `${resparse.message} ${email}`, 5200);
          // dispatch(setUserSkipOption(1));
          navigation.navigate('otpScreen', {email: email});
          setLoad(false);
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          // setTimeout(()=>{navigation.navigate('otpScreen');},1500)
          setLoad(false);
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        showToast('info', '', resparse.message, 2500);
        setLoad(false);
      } else {
        print(response.status, 'status in home screen');
        setLoad(false);
      }
    } catch (e) {
      console.log(e, 'error in Login screen');
      showToast('info', '', 'something went wrong', 2500);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (regEmail != '') {
      apiCall(regEmail);
    }
  }, [regEmail]);

  // register Login
  const regApiCall = async (name = '', email = '', photo = '') => {
    try {
      setLoad(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', name);

      if (photo != '') {
        formData.append('image', photo);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      print(formData, 'formData');
      // get the response:
      const response = await fetch(url().signUp, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'success') {
          Keyboard.dismiss();
          showToast('success', '', resparse.message, 1200);
          dispatch(setUserType('user'));
          dispatch(
            setProfileData({
              userId: resparse.userId,
            }),
          );
          navigation.navigate('main');
        } else if (
          resparse.status == 'error' &&
          resparse.message == 'user already exists'
        ) {
          apiCall(email);
        } else if (resparse.status == 'warning') {
          showToast('info', '', resparse.message, 2500);
          setLoad(false);
        }
      } else if (response.status == 404) {
        Keyboard.dismiss();
        const resparse = await response.json();
        showToast('info', '', resparse.message, 2500);
        setLoad(false);
      } else {
        print(response.status, 'status in home screen');
        setLoad(false);
      }
    } catch (e) {
      console.log(e, 'error in Register screen');
      setLoad(false);
    }
  };

  // navigation:
  const onPressSend = data => {
    Keyboard.dismiss();
    apiCall(data.email);
  };

  return (
    <View style={{flex: 1}}>
      <FastImage
        source={require('../../../assets/images/background_reg.png')}
        resizeMode="stretch"
        style={{...StyleSheet.absoluteFillObject}}
      />
      {/* <MemberRegBack /> */}
      {load && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            flex: 1,
            height: scrnHeight,
            width: scrnWidth,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColor.lightBackground,
          }}>
          <LottieView
            autoPlay={true}
            style={{width: scrnWidth * 0.5, height: scrnWidth * 0.5}}
            source={require('../../../assets/lottieFiles/load.json')}
          />
        </View>
      )}
      <View
        style={{
          opacity: load ? 0.8 : 1,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
        }}>
        <View>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{
              paddingHorizontal: 20,
              alignItems: 'center',
              // paddingTop: widthResponse ? 0 : 20,
              paddingBottom: keyboardVisible + 10,
            }}
            enableAutomaticScroll={false}
            extraHeight={500}
            ref={textFocus}
            showsVerticalScrollIndicator={false}>
            {/* image */}
            <View
              style={{
                height: widthResponse ? 180 : 250,
                width: widthResponse ? 250 : 350,
                marginBottom: 15,
              }}>
              <FastImage
                resizeMode="contain"
                style={{height: '100%', width: '100%'}}
                source={require('../../../assets/images/reg_img.png')}
              />
            </View>
            {/* Title */}
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(3),
                color: appColor.textWhite,
                marginBottom: 15,
              }}>
              Login Account
            </Text>
            {/* form */}
            <View style={{width: '100%', marginBottom: 30}}>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputText
                    placeholder={'Enter email address'}
                    value={value}
                    dark
                    leftIcon
                    keyboardType={'email-address'}
                    autoCapitalize
                    autoFocus={true}
                    icon={'Feather'}
                    iconName={'mail'}
                    iconSize={18}
                    Title={'Email Address'}
                    onChangeText={onChange}
                    formError={errors.email}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                )}
              />
            </View>
            {/* Register */}
            <PrimaryButton
              Title={'Login'}
              onPress={handleSubmit(onPressSend)}
              altStyle={{elevation: 10}}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 12.5,
              }}>
              <View
                style={{
                  height: 0.4,
                  backgroundColor: appColor.borderColor,
                  width: '40%',
                }}
              />
              <Text
                style={{
                  color: appColor.greyBg,
                  fontFamily: appFont.rR,
                  fontSize: fontScalling(2.2),
                  paddingHorizontal: 8,
                }}>
                or
              </Text>
              <View
                style={{
                  height: 0.4,
                  backgroundColor: appColor.borderColor,
                  width: '40%',
                }}
              />
            </View>
            <PrimaryButton
              img={true}
              Title={'Sign in with Google'}
              onPress={() => {
                googleLogin();
              }}
              // onPress={handleSubmit(onPressSend)}
              altStyle={{elevation: 10}}
            />

            {/* login Redirect */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // marginVertical: 20,
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: appColor.textWhite,
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.6),
                }}>
                Dont't have an Account?{'  '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('register');
                }}>
                <Text
                  style={{
                    color: appColor.themeYellow,
                    fontFamily: appFont.rM,
                    fontSize: fontScalling(1.6),
                  }}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
            {/* Skip */}
            <TouchableOpacity
              style={{
                padding: 4,
                paddingHorizontal: 14,
                backgroundColor: appColor.greyBack,
                borderRadius: 10,
                shadowColor: appColor.borderColor,
                shadowOpacity: 0.2,
                shadowRadius: 6,
                shadowOffset: {height: 0},
                marginTop: 20,
              }}
              onPress={() => {
                dispatch(setUserSkipOption(1));
                storeAddress && storeAddress?.stored
                  ? authReset(navigation)
                  : navigation.navigate('locationSearch');
              }}>
              <Text
                style={{
                  color: appColor.textWhite,
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(1.6),
                  paddingBottom: 3,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default Login;
