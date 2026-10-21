import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import MapView, {
  Circle,
  MapCircle,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import React, {useEffect, useState} from 'react';
import {
  fontScalling,
  MyStatusBar,
  objectLength,
  print,
  scrnHeight,
  widthResponse,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import AppHeaders from '../../components/Headers/AppHeaders';
import {Marker} from 'react-native-maps';
import {appFont} from '../../utilities/appFont';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import {
  getUserLocation,
  onRadiusValid,
} from '../../utilities/GeolocationFunctions';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData, setUserLocation} from '../../redux/authSlice';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '../../utilities/icon';
import {userSettingApi} from '../../redux/SettingSlice';

const MapViewScreen = ({route}) => {
  const styles = useStyle();
  const appColor = appColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();
  const {profileData} = useSelector(state => state.auth);
  const {location, coordinates, centerCoordinates, radius, page} =
    route?.params;

  const [regionLoad, setRegionLoad] = useState(false);
  const [regionChange, setRegionChange] = useState({});
  const [destination, setDestination] = useState({
    address: '',
    object: {},
  });

  useEffect(() => {
    (async () => {
      if (location && location != '' && coordinates) {
        setRegionLoad(true);
        const getLocation = await getUserLocation(coordinates);
        // const arr = location?.split(',');
        // const ind = arr.findIndex(val => val.trim() == 'Madurai');
        // const street = arr.slice(0, ind);
        // print(arr, 'arr');
        const street = location?.split(',');
        street.pop();
        setDestination({
          address: location,
          object: {...getLocation, street: street.join('')},
        });
        onRadiusValid({coordinate: coordinates}, centerCoordinates, radius);
        setRegionChange(coordinates);
        setRegionLoad(false);
      }
    })();
  }, [location]);

  return (
    <View style={[styles.container]}>
      <View style={{height: '100%', width: '100%'}}>
        <MapView
          style={styles.map}
          // mapType="terrain"
          onPress={async ({nativeEvent}) => {
            const radiusValid = onRadiusValid(
              nativeEvent,
              centerCoordinates,
              radius,
            );
            if (radiusValid) {
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
                  setRegionLoad(false);
                }
              }
            }
          }}
          region={{
            ...centerCoordinates,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}>
          <Circle
            center={centerCoordinates}
            radius={radius}
            strokeWidth={5}
            strokeColor={appColor.toggleGreen}
          />
          <Marker
            coordinate={
              objectLength(regionChange) ? regionChange : coordinates
            }>
            <FastImage
              source={require('../../../assets/images/location.png')}
              style={styles.marker}
            />
          </Marker>
        </MapView>
      </View>
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
        {
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
        }
        <PrimaryButton
          onPress={() => {
            (async () => {
              // dispatch(setUserLocation(destination.object));
              // dispatch(userSettingApi(destination.object));
              setTimeout(() => {
                navigation.navigate('main', {
                  screen: 'BottomTab',
                  params: {
                    screen: page == 'myAddress' ? 'Profile' : '',
                    params: {
                      screen: page,
                      params: {maps: destination.object},
                    },
                  },
                });
              }, 1000);
            })();
          }}
          Title={'Confirm Location'}
          altStyle={{marginTop: 15}}
        />
      </View>
    </View>
  );
};

export default MapViewScreen;

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: appColor.white,
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
  return styles;
};
