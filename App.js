import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
// file import:
import {ToastConfig, useShowToast} from './src/components/Toast/ToastAlert';
import {AuthStack} from './src/navigations/Stack';
import {
  BottomSheetFlatList,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  checkNotificationPermission,
  fontScalling,
  MyStatusBar,
  print,
  scrnWidth,
  widthResponse,
} from './src/utilities/helperFunction';
import appColors from './src/utilities/appColors';
import {Text, View, AppState, LogBox} from 'react-native';
import {appFont} from './src/utilities/appFont';
import {useNetInfo} from '@react-native-community/netinfo';
import NetworkUnavailable from './src/components/NetworkUnavailable/NetworkUnavailable';
import {useDispatch, useSelector} from 'react-redux';
import {addToFavApi, listProductApi, setFavModal} from './src/redux/favSlice';
import ModalBottomSheet from './src/components/BottomSheet/ModalBottomSheet';
import FavCard from './src/components/Card/FavCard';
import PrimaryButton from './src/components/Buttons/PrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserSkipOption, setUserType} from './src/redux/authSlice';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  ContentApi,
  setStoreAddress,
  userSettingApi,
} from './src/redux/SettingSlice';

const App = navigation => {
  // LogBox.ignoreAllLogs();
  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();
  const {userSettings, vegToggle, fcmToken} = useSelector(
    state => state.setting,
  );
  const {userType, profileData} = useSelector(state => state.auth);
  const appColor = appColors();
  const showToast = useShowToast();
  const {favModal, collections, prodId, checkCollections} = useSelector(
    state => state.fav,
  );

  const [fcmTrigger, setTriggerFcmToken] = useState(0);

  // when the app state is background hide the modal
  useEffect(() => {
    const state = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        dispatch(setFavModal(false));
        // console.log('AppState', nextAppState);
      }
    });
    return () => {
      state.remove();
    };
  }, []);

  // push notification permissions and token generation
  useEffect(() => {
    checkNotificationPermission(dispatch, setTriggerFcmToken, isConnected);
  }, [fcmTrigger]);

  // Wishlist:
  useEffect(() => {
    if (userSettings?.userInfo?.user_id) {
      dispatch(listProductApi());
    }
  }, [userSettings]);

  useEffect(() => {
    if (vegToggle) {
      showToast('success', '', 'You are now vegetarian mode', 2000);
    } else if (!vegToggle) {
      // showToast('success', '', 'You are general mode', 2000);
    }
  }, [vegToggle]);

  // call userSetting Api when app will invoke
  useEffect(() => {
    dispatch(userSettingApi());
    dispatch(ContentApi());
  }, [profileData]);

  // test:
    // useEffect(() => {
    //   (async () => {
    //     await AsyncStorage.clear();
    //     dispatch(setUserSkipOption(0));
    //     dispatch(setUserType('guest'));
    //     dispatch(
    //       setStoreAddress({
    //         flat: '',
    //         street: '',
    //         city: '',
    //         state: '',
    //         pincode: '',
    //         stored: false,
    //       }),
    //     );
    //   })();
    // }, []);
  return (
    <>
      {/* {false &&()} */}
      <SafeAreaProvider>
        <MyStatusBar backgroundColor={appColor.bgBlack} />
        <NavigationContainer independent={true}>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              {isConnected ? <AuthStack /> : <NetworkUnavailable />}
              {/* collectionsModal bottomSheet */}
              <ModalBottomSheet
                snapPoints={['40%', '45%']}
                isVisible={favModal}
                close={() => {
                  dispatch(setFavModal(false));
                }}>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingBottom: 15,
                      paddingHorizontal: 15,

                      // flex: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: appFont.bB,
                        color: appColor.textBlack,
                        fontSize: fontScalling(2.5),
                        marginLeft: 10,
                      }}>
                      save item to...
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {collections && collections.length > 0 && (
                      <BottomSheetFlatList
                        data={collections.filter(item => item.collection != '')}
                        renderItem={({item, index}) => {
                          if (item) {
                            const [name, value] = item.split('|');
                            return (
                              <>
                                {name != '' && (
                                  <FavCard
                                    key={index}
                                    title={name}
                                    qty={value}
                                  />
                                )}
                              </>
                            );
                          }
                        }}
                      />
                    )}
                    <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
                      <PrimaryButton
                        Title={'Done'}
                        onPress={async () => {
                          if (prodId != '') {
                            const result = await dispatch(
                              addToFavApi({pId: prodId}),
                            );
                            if (result?.payload && result?.payload != '') {
                              showToast(
                                //@@
                                result?.payload?.status === 'added'
                                  ? 'success'
                                  : 'error',
                                result?.payload?.status.toUpperCase(),
                                `${
                                  result?.payload?.status === 'added'
                                    ? 'Added to'
                                    : 'Removed from'
                                } ${
                                  checkCollections.length == 0
                                    ? 'Mywishlist'
                                    : checkCollections.join(', ')
                                } collection${
                                  checkCollections.length > 1 ? 's' : ''
                                }`,
                                2000,
                              );
                            }
                          } else {
                            dispatch(listProductApi());
                            dispatch(setFavModal(false));
                          }
                        }}
                      />
                    </View>
                  </View>
                </View>
              </ModalBottomSheet>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
        <Toast config={ToastConfig()} />
      </SafeAreaProvider>
    </>
  );
};

export default App;
