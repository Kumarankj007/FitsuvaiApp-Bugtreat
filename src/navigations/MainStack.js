import React, {useEffect} from 'react';
// file import:
import BottomTab from './BottomTab';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {scrnWidth, widthResponse} from '../utilities/helperFunction';
import DrawerScreen from '../screens/mainScreens/DrawerScreen';
import {useDispatch, useSelector} from 'react-redux';
import {ContentApi, userSettingApi} from '../redux/SettingSlice';

const Drawer = createDrawerNavigator();

const MainStack = () => {
  const {position} = useSelector(state => state.setting);
  const {profileData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // // call userSetting Api when app will invoke
  // useEffect(() => {
  //   dispatch(userSettingApi());
  //   dispatch(ContentApi());
  // }, [profileData]);

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: position,
          headerShown: false,
          swipeEnabled: false,
          drawerStatusBarAnimation: 'slide',
          swipeEdgeWidth: 20,
          drawerType: 'front',
          drawerStyle: {
            width: widthResponse ? scrnWidth - 75 : scrnWidth / 1.5,
          },
        }}
        drawerContent={DrawerScreen}>
        <Drawer.Screen name="BottomTab" component={BottomTab} />
      </Drawer.Navigator>
    </>
  );
};

export default MainStack;
