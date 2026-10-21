import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';

export default function ToggleButton({
  switchOne,
  switchTwo,
  onSelect,
  activeSwitch,
  button_for_notify,
}) {
  const [active, setActive] = useState(activeSwitch);
  const appColor = appColors();
  const Switching = sno => {
    setActive(sno);
    onSelect(sno);
  };
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <TouchableOpacity
          style={{
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Switching(1);
          }}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color:
                  active == 1 ? appColor.textBlack : appColor.Textlightblack,
                fontFamily: appFont.rM,
                fontSize: fontScalling(2.1),
              }}>
              {switchOne}
            </Text>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 50,
                backgroundColor: appColor.bgBlack,
                marginTop: 5,
                display: active == 1 ? 'flex' : 'none',
              }}></View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Switching(2);
          }}>
          <View style={{flexDirection: 'row'}}>
            {button_for_notify ? (
              <View>
                <Icon
                  ComponentName={'MaterialCommunityIcons'}
                  name={'android-messages'}
                  size={widthResponse ? 20 : 30}
                  color={
                    active == 2 ? appColor.bgBlack : appColor.Textlightblack
                  }
                />
              </View>
            ) : null}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  marginLeft: 5,
                  color:
                    active == 2 ? appColor.textBlack : appColor.Textlightblack,
                  fontFamily: appFont.rM,
                  fontSize: fontScalling(2.1),
                }}>
                {switchTwo}
              </Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  backgroundColor: appColor.bgBlack,
                  marginTop: 5,
                  display: active == 2 ? 'flex' : 'none',
                }}></View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
