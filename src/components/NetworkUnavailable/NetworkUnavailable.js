import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {fontScalling} from '../../utilities/helperFunction';
import {scrnHeight, scrnWidth} from '../../utilities/helperFunction';
import MainCard from '../Card/MainCard';
import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';

const NetworkUnavailable = () => {
  const appColor = appColors();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <MainCard>
      <StatusBar backgroundColor={appColor.bgBlack} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Animatable.View
          duration={900}
          iterationDelay={50}
          animation={'fadeIn'}
          iterationCount={'infinite'}
          isInteraction={true}
          style={{
            width: scrnWidth / 2,
            height: scrnHeight / 3,
          }}>
          <FastImage
            resizeMode="contain"
            style={{width: '100%', height: '100%'}}
            source={require('../../../assets/images/network_unavailable.png')}
          />
        </Animatable.View>
        <Animatable.Text
          duration={1000}
          animation={'zoomIn'}
          style={{
            fontFamily: appFont.bB,
            color: appColor.boldBlacktext,
            fontSize: fontScalling(4),
            textAlign: 'center',
          }}>
          NETWORK UNAVAILABLE
        </Animatable.Text>
      </View>
      <View style={{height: 80}}></View>
    </MainCard>
  );
};

export default NetworkUnavailable;
