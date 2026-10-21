import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../utilities/appColors';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';

const SideHeading = ({title, onPress, altStyle = {}}) => {
  const appColor = appColors();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          marginTop: widthResponse ? 15 : 30,
          marginBottom: widthResponse ? 10 : 20,
        },
        altStyle,
      ]}>
      <Text
        style={{
          color: appColor.black,
          fontFamily: appFont.bB,
          fontSize: fontScalling(2.6),
        }}>
        {title}
      </Text>
      {/* <View style={{borderBottomWidth: 1}}>
        <Text
          onPress={onPress}
          style={{
            color: appColor.black,
            fontFamily: appFont.rM,
            fontSize: fontScalling(1.5),
          }}>
          VIEW ALL
        </Text>
      </View> */}
      <Pressable
        onPress={onPress}
        style={{
          borderRadius: 16,
          width: widthResponse ? 23 : 33,
          // height: 23,
          aspectRatio: 1,
          backgroundColor: appColor.sliderGreyBg,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 2,
        }}>
        <Icon
          ComponentName={'FontAwesome6'}
          name={'angle-right'}
          size={widthResponse ? 17 : 25}
          color={appColor.white}
        />
      </Pressable>
    </View>
  );
};

export default SideHeading;

const styles = StyleSheet.create({});
