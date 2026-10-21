import {Image, Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {ScrollView} from 'react-native-gesture-handler';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {SvgCssUri} from 'react-native-svg';
import {Icon} from '../../utilities/icon';
import FastImage from 'react-native-fast-image';

const gap = widthResponse ? 10 : 15; //@@
const logoSize = widthResponse ? 80 : 180;   //@@
const container = 20; //@@
const InfoCard = ({item, active, index, onPress = () => {}}) => {
  const appColor = appColors();
  const [Ipress, setIpress] = useState(false);
  return (
    <>
      <Pressable
        onPress={onPress}
        style={{
          width: (scrnWidth - 2 * container - gap) / 2, //@@
          height: (scrnWidth - 2 * container - gap) / 2, //@@
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderRadius: widthResponse ? 15 : 20, //@@
          backgroundColor: active ? appColor.gold : appColor.cartBg,
          marginLeft: index % 2 == 0 ? 0 : gap, //@@
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: appFont.bB,
            fontSize: widthResponse ? fontScalling(2.2) : fontScalling(2.5),
            color: active ? appColor.white : appColor.black,
            // paddingBottom: 10,
          }}>
          {item.name}
        </Text>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {!Ipress && (
            <>
              {item.image &&
              item.image != null &&
              item.image.split('.').pop().toUpperCase() == 'SVG' ? (
                <>
                  <SvgCssUri
                    fill={active ? appColor.white : appColor.black}
                    width={logoSize} //@@
                    height={logoSize} //@@
                    uri={item.image}
                    onError={error => {
                      console.error('Failed to load SVG:', error);
                    }}
                  />
                </>
              ) : item.image.split('.').pop().toUpperCase() == 'PNG' ||
                'JPG' ||
                'JPEG' ||
                'WEBG' ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    width: logoSize,
                    height: logoSize,
                    borderRadius: 10,
                  }}>
                  <FastImage
                    resizeMode="cover"
                    style={{width: '100%', height: '100%'}}
                    source={{uri: item.image, priority: FastImage.priority.high,}}
                  />
                </View>
              ) : null}
            </>
          )}
          {Ipress && item.description && item.description != '' && (
            <View style={{}}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{margin: 'auto'}}
                style={{marginVertical: widthResponse ? 7 : 10}}>
                <Pressable>
                  <Text
                    style={{
                      fontFamily: appFont.rM,
                      fontSize: fontScalling(1.9),
                      color: active ? appColor.white : appColor.black,
                      textAlign: 'center',
                    }}>
                    {item.description}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          )}
        </View>
        {item.description && item.description != '' && (
          <View style={{width: '100%'}}>
            <Pressable
              onPress={() => setIpress(!Ipress)}
              style={{
                alignSelf: 'flex-end',
                opacity: Ipress ? 0.3 : 1,
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'info-with-circle'}
                size={widthResponse ? 20 : 35}
                color={
                  Ipress
                    ? appColor.bgBlack
                    : active
                    ? appColor.white
                    : appColor.themeYellow
                }
              />
            </Pressable>
          </View>
        )}
      </Pressable>
    </>
  );
};

export default InfoCard;
