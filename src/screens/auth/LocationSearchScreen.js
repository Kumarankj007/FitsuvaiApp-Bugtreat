import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  authReset,
  fontScalling,
  print,
  scrnHeight,
  widthResponse,
} from '../../utilities/helperFunction';
import LottieView from 'lottie-react-native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {setUserLocation} from '../../redux/authSlice';
import {
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../../utilities/GeolocationFunctions';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {setStoreAddress, userSettingApi} from '../../redux/SettingSlice';
import {Icon} from '../../utilities/icon';

const LocationSearchScreen = ({navigation}) => {
  const {styles} = useStyles();
  const appColor = appColors();
  const [loadCL, setLoadCl] = useState(false);
  const dispatch = useDispatch();
  const {userType} = useSelector(state => state.auth);
  const {storeAddress} = useSelector(state => state.setting);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const getUserLocations = async () => {
    setLoadCl(true);
    const userCurrentLocation = await getUserLocation();
    if (userCurrentLocation && Object.keys(userCurrentLocation).length > 0) {
      print(userCurrentLocation, 'userCurrentLocation');
      if (userType == 'user') {
        dispatch(userSettingApi(userCurrentLocation));
      }
      dispatch(setStoreAddress({...userCurrentLocation, stored: true}));
      // navigation.navigate('main');
      authReset(navigation);
      dispatch(setUserLocation(userCurrentLocation));
      setLoadCl(false);
    } else {
      setLoadCl(false);
    }
  };

  return (
    <>
      {/* <MyStatusBar backgroundColor={appColor.white} barStyle={'dark-content'} /> */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: appColor.white,
        }}>
        {loadCL && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 1000,
              backgroundColor: appColor.lightBackground,
            }}>
            <LottieView
              autoPlay={true}
              style={{width: 200, height: 200}}
              source={require('../../../assets/lottieFiles/load.json')}
            />
          </View>
        )}
        {storeAddress && storeAddress?.stored && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 10,
              top: widthResponse ? 10 : 20,
              left: widthResponse ? 20 : 30,
              backgroundColor: appColor.white,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 10,
              shadowOpacity: 0.3,
              shadowOffset: {height: 0},
              shadowRadius: 10,
            }}>
            <Icon
              ComponentName={'Ionicons'}
              name={'chevron-back'}
              color={appColor.gold}
              size={25}
            />
          </Pressable>
        )}
        <View>
          <ScrollView>
            <Text style={styles.primaryText}>
              Enable Location for a Better Experience
            </Text>
            <Text
              style={[styles.primaryText, {color: appColor.Textlightblack}]}>
              🌍 To provide accurate and personalized services, we need access
              to your location.
            </Text>
            <Text style={styles.primaryText}>
              ✅ Use My Current Location – Get instant and precise results.
            </Text>
            <Text style={styles.primaryText}>
              📍 Enter Manually – Prefer to type it yourself? No problem!
            </Text>
            <Text
              style={[styles.primaryText, {color: appColor.Textlightblack}]}>
              We respect your privacy and only use your location to improve your
              experience.
            </Text>
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 15,
                borderRadius: 12,
                // backgroundColor: appColor.white,
                margin: 20,
                // elevation: 0.8,
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              <LottieView
                resizeMode="cover"
                autoPlay={true}
                style={{
                  width: 280,
                  height: scrnHeight / 5,
                }}
                source={
                  require('../../../assets/lottieFiles/location.json')
                  //   {
                  //   uri: 'https://lottie.host/c226957a-1120-44d4-992e-c31ddd3dd03b/22dLu92OBg.lottie',
                  // }
                }
              />
            </View>
            <View style={{paddingHorizontal: 20, paddingTop: 80}}>
              <PrimaryButton
                load={loadCL}
                onPress={async () => {
                  //   setLoadCl(true);
                  const isGranted = await requestLocationPermission();
                  if (isGranted && isGranted != 'settings') {
                    getUserLocations();
                  } else {
                    await handleLocationPermission();
                  }
                }}
                download
                iconName="my-location"
                iconComponent="MaterialIcons"
                Title={'Enable Device Location'}
                textStyle={{fontSize: fontScalling(2)}}
              />
              <PrimaryButton
                onPress={() => {
                  navigation.navigate('manualLocation', {page: 'home'});
                }}
                download
                iconName="FontAwesome"
                iconComponent="hand-o-up"
                black={true}
                Title={'Enter Your Location Manually'}
                altStyle={{marginTop: 15}}
                textStyle={{fontSize: fontScalling(2)}}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default LocationSearchScreen;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    primaryText: {
      color: appColor.gold,
      fontFamily: appFont.rB,
      fontSize: fontScalling(2.2),
      paddingHorizontal: 30,
      paddingBottom: 5,
      textAlign: 'center',
    },
  });
  return {styles};
};
