import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import * as Animatable from 'react-native-animatable';
import appColors from '../../utilities/appColors';
import {widthResponse} from '../../utilities/helperFunction';

const Toggle = ({onPress, isActive, style, type = 'default'}) => {
  // console.log(isActive,"switch");
  const appColor = appColors();
  let background = '';
  let thumb = '';

  switch (type) {
    case 'green':
      background = isActive ? appColor.toggleGreen : appColor.textGrey;
      thumb = !isActive ? appColor.white : appColor.white;
      break;
    case 'default':
      background = isActive ? appColor.primary : appColor.smokeBack;
      thumb = !isActive ? appColor.primary : appColor.white;
      break;
    case 'lightGreen':
      background = isActive ? appColor.paid : appColor.bgWhite;
      thumb = !isActive ? appColor.paid : appColor.white;
  }

  return (
    <Pressable onPress={onPress} style={[style]}>
      <View
        style={[
          {
            backgroundColor: background,
            borderRadius: 30,
            width: widthResponse ? 35 : 45,
            height: widthResponse ? 12 : 15,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: isActive ? appColor.toggleGreen : appColor.gold,
            padding: 0,
            margin: 0,
            elevation: 2,
            zIndex: 2,
          },
        ]}>
        <Animatable.View
          animation={{
            from: {
              translateX: isActive ? 0 : 15,
            },
            to: {
              translateX: isActive ? (widthResponse ? 15 : 25) : -1,
            },
          }}
          style={{
            width: 20,
            height: 20,
            borderRadius: 7,
            backgroundColor: thumb,
            borderWidth: 2.5,
            borderColor: isActive ? appColor.toggleGreen : appColor.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          duration={400}
          easing={'ease'}>
          <View
            style={{
              width: widthResponse ? 8 : 10,
              height: widthResponse ? 8 : 10,
              borderRadius: 8,
              backgroundColor: isActive ? appColor.toggleGreen : appColor.gold,
            }}
          />
        </Animatable.View>
      </View>
    </Pressable>
  );
};

export default Toggle;

const styles = StyleSheet.create({});
