import {View, Text, Pressable, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import { setTitle } from '../../redux/titleSlice';

const CheckBox = ({
  checkBox,
  onPress,
  label,
  color = false,
  terms,
  altStyle = {},
  multiLabel,
}) => {
  const appColor = appColors();
  const {userSettings} = useSelector(state => state.setting);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <Pressable
      style={[{flexDirection: 'row', alignItems: 'center'}, altStyle]}
      onPress={onPress}>
      <View
        style={{
          height: widthResponse ? 18 : 23, //@@
          width: widthResponse ? 18 : 23, //@@
          backgroundColor: checkBox ? appColor.themeYellow : 'transparent',
          borderRadius: 3,
          borderWidth: 1,
          borderColor: !checkBox
            ? color
              ? appColor.black
              : appColor.bgWhite
            : appColor.themeYellow,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {checkBox && (
          <Icon
            ComponentName={'Entypo'}
            name={'check'}
            size={widthResponse ? 13 : 19} //@@
            color={appColor.bgWhite}
          />
        )}
      </View>
      {multiLabel && (
        <Text
          style={{
            marginLeft: 8,
            color: color ? appColor.black : appColor.textWhite,
            fontFamily: appFont.rR,
            fontSize: widthResponse ? fontScalling(1.6) : fontScalling(1.8), //@@
          }}>
          Accept
          <Text style={{color: appColor.themeYellow}}> Fitsuvai </Text>
          Terms & Conditions
        </Text>
      )}
      {label && (
        <>
          <Text
            style={{
              marginLeft: 8,
              color: color ? appColor.black : appColor.textWhite,
              fontFamily: appFont.rR,
              fontSize: widthResponse ? fontScalling(1.6) : fontScalling(1.8), //@@
              textTransform: 'capitalize',
            }}>
            {label}
          </Text>
        </>
      )}
      {terms && (
        <Text
          style={{
            marginLeft: 8,
            color: color ? appColor.black : appColor.textWhite,
            fontFamily: appFont.rR,
            fontSize: widthResponse ? fontScalling(1.6) : fontScalling(1.8), //@@
            justifyContent: 'center',
          }}>
          I agree to the{' '}
          <TouchableOpacity
            onPress={() => {
              //@@
              console.log(userSettings?.links)
              if (
                userSettings?.links['terms & conditions'] &&
                userSettings?.links['terms & conditions'] != ''
              ) {
                // Linking.openURL(userSettings?.links?.terms_and_conditions);
                dispatch(setTitle('terms & conditions'));
                navigation.navigate('chefLogin', {
                  url: userSettings?.links['terms & conditions'],
                });
              }
            }}>
            <Text
              style={{
                color: appColor.themeYellow,
                top: widthResponse ? 4 : 3,
                fontFamily: appFont.rR,
                fontSize: widthResponse ? fontScalling(1.6) : fontScalling(1.8), //@@
              }}>
              terms and conditions
            </Text>
          </TouchableOpacity>{' '}
          of Fitsuvai
        </Text>
      )}
    </Pressable>
  );
};

export default CheckBox;
