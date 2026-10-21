import {View, Text, ImageBackground, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {Image} from 'react-native-animatable';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// file import:
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import FastImage from 'react-native-fast-image';
import {Icon} from '../../utilities/icon';
import {useNavigation} from '@react-navigation/native';
import KeyboardVisible from '../../Hooks/KeyboardVisible';

export const MemberRegBack = () => {
  const appColor = appColors();
  const navigation = useNavigation();
  return (
    <Pressable
      style={{
        backgroundColor: `${appColor.textGrey}99`,
        padding: 6,
        // margin: 40,
        // marginRight: 'auto',
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 1000,
        borderRadius: 100,
        borderWidth: 0.6,
        borderColor: appColor.ToastErrorBack,
        shadowOpacity: 0.7,
        shadowOffset: {height: 0, width: 0},
        shadowRadius: 15,
        shadowColor: appColor.black,
      }}
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Dashboard', {screen: 'home'});
        }
      }}>
      <View style={{left: widthResponse ? 4 : 6}}>
        <Icon
          ComponentName={'MaterialIcons'}
          name={'arrow-back-ios'}
          size={widthResponse ? 18 : 30}
          color={appColor.white}
        />
      </View>
    </Pressable>
  );
};

export const MemberRegCard = ({textFocus, children}) => {
  const appColor = appColors();
  const keyboardVisible = KeyboardVisible(true);
  return (
    <View style={{flex: 1}}>
      <FastImage
        source={require('../../../assets/images/background_reg.png')}
        resizeMode="cover"
        style={{...StyleSheet.absoluteFillObject}}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <MemberRegBack />
        <View>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
              // paddingTop: widthResponse ? 100 : 120,
              paddingBottom: keyboardVisible + 10,
            }}
            scrollEnabled={true}
            enableAutomaticScroll={false}
            extraHeight={300}
            ref={textFocus}
            showsVerticalScrollIndicator={false}>
            {/* image */}
            <View
              style={{
                height: widthResponse ? 180 : 250,
                width: widthResponse ? 250 : 350,
                marginBottom: widthResponse ? 15 : 25,
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
                marginBottom: fontScalling(2.5),
              }}>
              Get Summary
            </Text>
            {children}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

// export default MemberRegCard;
