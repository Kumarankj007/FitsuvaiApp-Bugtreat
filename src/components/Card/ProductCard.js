import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../utilities/appColors';
import {
  currencyConvertor,
  fontScalling,
  scrnWidth,
  scrnHeight,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../utilities/appFont';
import OfferTag from '../CssShape/OfferTag';
import {useNavigation} from '@react-navigation/native';
import AddToCartBtn from '../Buttons/AddToCartBtn';
import FavIconButton from '../Buttons/FavIcon';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

const separator = widthResponse ? 15 : 15;
const container = 40;
const column = widthResponse ? 2 : 3;

const ProductCard = ({
  item,
  ind,
  calculative = false,
  collectionName = '',
  bgGrey = false,
  onPress = () => {},
}) => {
  const appColor = appColors();
  const {styles} = useStyles();
  const navigation = useNavigation();
  const {userType} = useSelector(state => state.auth);
  const [press, setPress] = useState(false);

  // const cardWidth = !calculative
  //   ? widthResponse
  //     ? scrnWidth / 2 - 27.5
  //     : scrnWidth / 2.7 - 27.5
  //   : scrnWidth / 3 - 27.5;

  const cardWidth = (scrnWidth - container - (column - 1) * separator) / column;

  return (
    <Pressable
      onPressIn={() => setPress(true)}
      onPressOut={() => setPress(false)}
      key={ind}
      style={[
        styles.card,
        {
          width: cardWidth,
          justifyContent: 'flex-end',
          marginBottom: calculative ? separator : 0,
          marginRight: separator,
          backgroundColor: bgGrey ? appColor.cardbg : appColor.white,
          shadowOpacity: press ? 0 : 0.2,
        },
      ]}
      onPress={() => {
        onPress;
        navigation.navigate('productDetail', {productId: item.id});
      }}>
      <View style={{alignSelf: 'flex-end', paddingTop: 5}}>
        {item.discount && item.discount != '' && item.discount != 0 && (
          <OfferTag offer={Number(item.discount).toFixed(0) + '% off'} />
        )}
      </View>
      {/* image */}
      <View
        style={{
          backgroundColor: appColor.cartBg,
          margin: 5,
          marginBottom: 10,
          marginVertical: widthResponse ? 8 : 14, //@@
          width: cardWidth / 1.5,
          height: cardWidth / 1.5,
          borderRadius: cardWidth / 3,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          shadowOpacity:press ? 0 : 0.2,
          shadowRadius: 3,
          shadowOffset: {height: 2},
        }}>
        {item && (
          <FastImage
            style={{
              width: '85%',
              height: '85%',
              borderRadius: 1000,
              // backgroundColor: appColor.TextInputborderbg,
            }}
            resizeMode="cover"
            source={{
              priority: FastImage.priority.high,
              uri:
                item.image && item.image != ''
                  ? item.image
                  : item.main_image && item.main_image != ''
                  ? item.main_image
                  : 'https://www.fitsuvai.com/uploads/product/16Tx1737022277_09db3e94bac2ac33e39f.png',
            }}
          />
        )}
      </View>
      {/* content */}
      <View style={{paddingLeft: widthResponse ? 8 : 20}}>
        {item.name && item.name != '' && (
          <Text
            numberOfLines={1}
            style={{
              color: appColor.black,
              fontFamily: appFont.bB,
              // paddingBottom: 3,
              paddingRight: 8, //@@
              // marginBottom: widthResponse ? 5 : 10,
              fontSize: widthResponse ? fontScalling(1.9) : fontScalling(2.3), //@@
            }}>
            {item.name}
          </Text>
        )}
        {/* product category and discount */}
        {item.category && item.category != '' && (
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: appColor.textGrey,
              fontFamily: appFont.bR, //@@
              fontSize: fontScalling(widthResponse ? 1.2 : 1.5),
              // paddingBottom: 10,
            }}>
            {item.category}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginVertical: widthResponse ? 10 : 15,
          }}>
          <View>
            {item.protein && (
              <Text
                style={{
                  color: appColor.Textlightblack,
                  fontSize: fontScalling(widthResponse ? 1.5 : 1.8),
                  fontFamily: appFont.rM,
                  paddingBottom: 3,
                  // width: '55%',
                }}>{`Protein : ${
                item.protein == 0 ? 'N/A' : item.protein + ' g'
              }`}</Text>
            )}
            {item.calories && (
              <Text
                style={{
                  color: appColor.Textlightblack,
                  fontSize: fontScalling(widthResponse ? 1.5 : 1.8),
                  fontFamily: appFont.rM,
                  // paddingBottom: 8,
                  // width: '55%',
                }}>{`Calories : ${
                item.calories == 0 ? 'N/A' : item.calories + ' cal'
              }`}</Text>
            )}
          </View>
          {/* {item.discount && item.discount != '' && item.discount != 0 && (
            <OfferTag offer={Number(item.discount).toFixed(0) + '% off'} />
          )} */}
        </View>
        {/* currency */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            marginBottom: 4,
          }}>
          {item.offer && item.offer != '' && (
            <Text
              numberOfLines={1}
              style={{
                // flex: 1,
                color: appColor.black,
                fontFamily: appFont.bB,
                fontSize: fontScalling(2.1),
                textAlignVertical: 'bottom',
              }}>
              {currencyConvertor(item.offer, 2)}
            </Text>
          )}
          {item.price && item.price != '' && item.discount != 0 && (
            <Text
              numberOfLines={1}
              style={{
                // flex: 1,
                color: appColor.textGrey,
                fontFamily: appFont.bR,
                fontSize: fontScalling(1.8),
                textAlignVertical: 'bottom',
                paddingLeft: 10,
                textDecorationLine: 'line-through',
              }}>
              {currencyConvertor(item.price, 2)}
            </Text>
          )}
        </View>
      </View>
      {/* Addtocart */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: userType == 'user' ? 'space-between' : 'flex-end',
          paddingTop: 8,
          // paddingVertical: 10,
          paddingRight: 5,
          paddingLeft: widthResponse ? 8 : 20, //@@
        }}>
        <AddToCartBtn data={item} />
        {userType == 'user' && item && (
          <FavIconButton pId={item} collectionName={collectionName} />
        )}
      </View>
    </Pressable>
  );
};

export default ProductCard;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    card: {
      paddingBottom: widthResponse ? 15 : 20, //@@
      borderRadius: widthResponse ? 10 : 20, //@@
      paddingTop: widthResponse ? 5 : 8,
      shadowOffset: {height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  });
  return {styles};
};
