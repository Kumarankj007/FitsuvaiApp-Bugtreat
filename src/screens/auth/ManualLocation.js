import {
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, {useEffect, useRef, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {url} from '../../utilities/appApi';
import 'react-native-get-random-values';
import appColors from '../../utilities/appColors';
import {
  authReset,
  Capitalize,
  fontScalling,
  objectLength,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {
  getUserLocation,
  manualAddressBaseCoordinates,
  onRadiusValid,
} from '../../utilities/GeolocationFunctions';
import {useDispatch, useSelector} from 'react-redux';
import {useShowToast} from '../../components/Toast/ToastAlert';
import MapView, {Circle, Marker} from 'react-native-maps';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {setStoreAddress, userSettingApi} from '../../redux/SettingSlice';
import LottieView from 'lottie-react-native';
import KeyboardVisible from '../../Hooks/KeyboardVisible';

const ManualLocation = ({navigation, route}) => {
  const {page = 'home', verify = ''} =
    route && route?.params ? route?.params : {page: '', verify: ''};

  const ref = useRef();
  const appColor = appColors();
  const {styles} = useStyles();
  const safeArea = useSafeAreaInsets();
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const {userSettings, storeAddress} = useSelector(state => state.setting);
  const {userType} = useSelector(state => state.auth);
  const keyboardVisible = KeyboardVisible().valueOf();

  const mapTypeArr = ['standard', 'satellite', 'terrain'];
  const mapTypeImgs = [
    require('../../../assets/images/Standard.png'),
    require('../../../assets/images/satelite.png'),
    require('../../../assets/images/terrain.png'),
  ];
  let coordinates = {};

  const radius = (userSettings?.RADIUS ? userSettings?.RADIUS : 25) * 1000;
  // print(radius, 'radius');
  const adminCoordinates = {
    latitude:
      userSettings?.SITEINFO?.location &&
      userSettings?.SITEINFO?.location != '' &&
      userSettings?.SITEINFO?.location.split(',')[0] &&
      Number(userSettings?.SITEINFO?.location.split(',')[0]),
    longitude:
      userSettings?.SITEINFO?.location &&
      userSettings?.SITEINFO?.location != '' &&
      userSettings?.SITEINFO?.location.split(',')[1] &&
      Number(userSettings?.SITEINFO?.location.split(',')[1]),
  };

  const [mapType, setMapType] = useState(mapTypeArr[0]);
  const [layerSheet, setLayerSheet] = useState(false);
  const [regionLoad, setRegionLoad] = useState(false);
  const [regionChange, setRegionChange] = useState(adminCoordinates);
  const [destination, setDestination] = useState({
    address: '',
    object: {},
  });

  const pickSuggesstion = (description = '') => {
    // setSearch('');
    (async () => {
      if (description != '') {
        coordinates = await manualAddressBaseCoordinates(description, '');
      }
      let coordinate = {
        latitude: coordinates.lat,
        longitude: coordinates?.lng,
      };
      const radiusValid = onRadiusValid({coordinate}, adminCoordinates, radius);
      if (radiusValid) {
        // navigation.navigate('mapViewScreen', {
        //   page: page,
        //   location: description,
        //   coordinates: coordinate,
        //   centerCoordinates: adminCoordinates,
        //   radius: radius,
        // });
        if (description && description != '' && coordinate) {
          setRegionLoad(true);
          const getLocation = await getUserLocation(coordinate);
          const street = description?.split(',');
          street.pop();
          setDestination({
            address: description,
            object: {...getLocation, street: street.join('')},
          });
          setRegionChange(coordinate);
          showToast(
            'custom',
            'Delivery location Fixed please ensure its close to you ',
            '',
            2500,
          );
          setRegionLoad(false);
        }
      } else {
        showToast(
          'info',
          'Warning',
          'Your selected delivery location is outside the allowed radius. Please choose a location within the radius.',
          4000,
        );
      }
    })();
  };

  return (
    <>
      <View style={{flex: 1}}>
        {Platform.OS == 'android' && (
          <StatusBar
            backgroundColor={appColor.white}
            barStyle={'dark-content'}
          />
        )}
        {/* location search */}
        <GooglePlacesAutocomplete
          placeholder="Enter Location"
          keyboardShouldPersistTaps="always"
          renderLeftButton={() => {
            return (
              <Icon
                ComponentName={'Feather'}
                name={'search'}
                size={widthResponse ? 18 : 25}
                color={appColor.gold}
              />
            );
          }}
          textInputProps={
            {
              // value: keyboardVisible ? search : '',
              // onChangeText: e => {
              //   setSearch(e);
              // },
            }
          }
          styles={{
            container: {
              width: scrnWidth - 30,
              backgroundColor: appColor.white,
              borderRadius: 20,
              zIndex: 2,
              position: 'absolute',
              alignSelf: 'center',
              marginTop: 10,
              padding: 5,
              shadowRadius: 20,
              shadowOpacity: 0.5,
              shadowColor: appColor.black,
              shadowOffset: {height: 0},
            },
            textInput: {
              color: appColor.bgBlack,
              borderRadius: 10,
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: -2,
            },
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
            },
            textInputContainer: {
              // borderWidth: 2,
              color: appColor.textGrey,
              borderColor: appColor.borderColor,
              borderRadius: 20,
              alignItems: 'center',
              overflow: 'hidden',
              flexDirection: 'row',
              paddingHorizontal: 10,
            },

            description: {
              color: appColor.Textlightblack,
              borderRadius: 20,
              fontSize: fontScalling(2),
              fontFamily: appFont.rB,
            },
            separator: {
              borderWidth: 1,
              borderColor: appColor.borderColor,
            },
          }}
          ref={ref}
          onPress={({description}) => {
            pickSuggesstion(description);
          }}
          query={{
            key: url().apiKey,
            language: 'en',
          }}
        />
        {/* map */}
        {adminCoordinates &&
        Object.values(adminCoordinates).length > 0 &&
        adminCoordinates.latitude &&
        adminCoordinates.longitude ? (
          <MapView
            style={styles.map}
            mapType={mapType == 'satellite' ? 'hybrid' : mapType}
            onPress={async ({nativeEvent}) => {
              const radiusValid = onRadiusValid(
                nativeEvent,
                adminCoordinates,
                radius,
              );
              if (radiusValid) {
                Keyboard.dismiss();
                // setSearch('');
                const data = nativeEvent.coordinate;
                if (data && data?.latitude && data?.longitude) {
                  setRegionLoad(true);
                  setRegionChange({
                    latitude: data?.latitude,
                    longitude: data?.longitude,
                  });
                  const getLocation = await getUserLocation({
                    latitude: data?.latitude,
                    longitude: data?.longitude,
                  });
                  if (getLocation && objectLength(getLocation)) {
                    setDestination({
                      address: `${getLocation.street},${getLocation.city},${getLocation?.state},${getLocation?.pincode}`,
                      object: getLocation,
                    });
                    showToast(
                      'custom',
                      `Your delivery location has been set. Please make sure it's convenient and close to you.`,
                      '',
                      2500,
                    );
                    setRegionLoad(false);
                  }
                  Toast.hide();
                }
              } else {
                showToast(
                  'info',
                  'Warning',
                  'Your selected delivery location is outside the allowed radius. Please choose a location within the radius.',
                  4000,
                );
              }
            }}
            region={{
              ...adminCoordinates,
              latitudeDelta: 0.45,
              longitudeDelta: 0.45,
            }}>
            <Circle
              center={adminCoordinates}
              radius={radius}
              strokeWidth={2}
              strokeColor={appColor.toggleGreen}
            />
            {regionChange &&
              regionChange.latitude &&
              regionChange.longitude && (
                <Marker coordinate={regionChange}>
                  <FastImage
                    source={require('../../../assets/images/location.png')}
                    style={styles.marker}
                  />
                </Marker>
              )}
          </MapView>
        ) : (
          <View
            style={{
              position: 'absolute',
              zIndex: 100,
              flex: 1,
              height: scrnHeight,
              width: scrnWidth,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LottieView
              autoPlay={true}
              style={{width: scrnWidth * 0.5, height: scrnWidth * 0.5}}
              source={require('../../../assets/lottieFiles/load.json')}
            />
          </View>
        )}

        {/* map layer button */}
        <TouchableOpacity
          onPress={() => setLayerSheet(!layerSheet)}
          style={{
            padding: 10,
            borderRadius: 100,
            shadowRadius: 5,
            shadowOffset: {height: 0},
            shadowOpacity: 0.3,
            backgroundColor: appColor.white,
            zIndex: 100000,
            position: 'absolute',
            right: 15,
            bottom: 30,
          }}>
          <Icon
            ComponentName={'MaterialCommunityIcons'}
            name={'layers-outline'}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {/* picked Location */}
      {destination.address != '' && (
        <View
          style={{
            backgroundColor: appColor.white,
            width: '100%',
            paddingVertical: 20,
            paddingHorizontal: 15,
            paddingBottom: safeArea.bottom == 0 ? 10 : safeArea.bottom,
          }}>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2.5),
              color: appColor.gold,
            }}>
            Delivering Your order to
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              style={{width: widthResponse ? 30 : 35, aspectRatio: 0.8}}
              source={require('../../../assets/images/location.png')}
            />
            {regionLoad ? (
              <SkeletonPlaceholder>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: widthResponse ? 40 : 70,
                      height: widthResponse ? 12 : 18,
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      width: widthResponse ? 20 : 40,
                      height: widthResponse ? 12 : 18,
                      borderRadius: 5,
                      marginLeft: 5,
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            ) : (
              <Text
                style={{
                  flex: 1,
                  fontFamily: appFont.bR,
                  fontSize: fontScalling(2),
                  color: appColor.bgBlack,
                }}>
                {destination.address}
              </Text>
            )}
          </View>
          <PrimaryButton
            onPress={() => {
              // dispatch(setUserLocation(destination.object));
              if (userType == 'user' || storeAddress && storeAddress?.stored) {
                page == 'home' &&
                  userType == 'user' &&
                  dispatch(userSettingApi(destination.object));
                navigation.navigate(
                  'main',
                  page == 'home'
                    ? null
                    : {
                        screen: 'BottomTab',
                        params: {
                          screen:
                            (page == 'myAddress' || page == 'EditProfile') &&
                            verify == ''
                              ? 'Profile'
                              : page == 'checkOut' || verify == 'checkout'
                              ? 'Carts'
                              : page == 'member_2'
                              ? 'Dashboard'
                              : '',
                          params: {
                            screen: page == 'member_2' ? 'noTab' : page,
                            params:
                              page == 'member_2'
                                ? {
                                    screen: page,
                                    params: {maps: destination.object},
                                  }
                                : {maps: destination.object, verify: verify},
                          },
                        },
                      },
                );
              } else if (userType == 'guest' && storeAddress && !storeAddress?.stored) {
                dispatch(
                  setStoreAddress({...destination.object, stored: true}),
                );
                // navigation.navigate('main');
                authReset(navigation);
              }
              showToast(
                'custom',
                'Your delivery location has been set. Please make sure it is convenient and close to you.',
                '',
                2500,
              );
            }}
            Title={'Confirm Location'}
            altStyle={{marginTop: 15}}
          />
        </View>
      )}

      {/* bottom sheet layer */}
      <ModalBottomSheet
        snapPoints={widthResponse ? ['30%', '30%'] : ['20%', '25%']}
        isVisible={layerSheet}
        close={() => setLayerSheet(false)}>
        <Text
          style={{
            fontFamily: appFont.bB,
            fontSize: fontScalling(3),
            color: appColor.black,
            paddingBottom: 15,
            paddingHorizontal: 20,
          }}>
          Map Type
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            marginTop: 10,
          }}>
          {mapTypeArr &&
            mapTypeArr.map((val, ind) => {
              const active = mapType == val;
              return (
                <Pressable
                  onPress={() => {
                    setMapType(val);
                    // setLayerSheet(false);
                  }}
                  key={ind}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    // marginHorizontal: 25,
                    backgroundColor: appColor.cartBg,
                    shadowOpacity: active ? 0.3 : 0,
                    shadowRadius: 10,
                    shadowOffset: {height: 0},
                  }}>
                  {/* Image button */}
                  <View
                    style={{
                      borderRadius: 15,
                      borderWidth: 2,
                      padding: 2,
                      borderColor: active ? appColor.gold : 'transparent',
                      elevation: 2,
                      width: 70,
                      aspectRatio: 1,
                      shadowColor: appColor.gold,
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={mapTypeImgs[ind]}
                      style={{width: '100%', aspectRatio: 1, borderRadius: 12}}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(2),
                      color: active ? appColor.gold : appColor.black,
                      paddingTop: 8,
                    }}>
                    {Capitalize(val)}
                  </Text>
                </Pressable>
              );
            })}
        </View>
      </ModalBottomSheet>
    </>
  );
};

export default ManualLocation;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appColor.white,
      zIndex: 2,
      padding: 10,
    },
    primaryText: {
      color: appColor.gold,
      fontFamily: appFont.rM,
      fontSize: fontScalling(2.2),
      paddingBottom: 5,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.2),
    },
    marker: {
      width: widthResponse ? 25 : 30,
      aspectRatio: 0.5,
      position: 'absolute',
      left: widthResponse ? -12 : -16,
      bottom: widthResponse ? -6 : -7,
      zIndex: 100,
    },
  });
  return {styles};
};
