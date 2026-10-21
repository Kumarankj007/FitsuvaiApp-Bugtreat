import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddToCart,
  dicrementQuantity,
  incrementQuantity,
  removeFromCart,
  setDeleteModal,
} from '../../redux/CartSlice';
import {Icon} from '../../utilities/icon';
import appColors from '../../utilities/appColors';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import useCartPriceInfo from '../../Hooks/useCartPriceInfo';
import PrimaryButton from './PrimaryButton';
import {useNavigation} from '@react-navigation/native';

const AddToCartBtn = ({data, detail = false, cartBtn = false}) => {
  const dispatch = useDispatch();
  const {cart, total} = useSelector(state => state.cart);
  // console.log(data, 'data');
  const navigation = useNavigation();

  const appColor = appColors();
  const {styles} = useStyles();

  const [focus, setFocus] = useState(false);
  const [focusMinus, setFocusMins] = useState(false);

  const {calculatePriceInfo} = useCartPriceInfo();

  useEffect(() => {
    calculatePriceInfo(
      {
        code: null,
        percent: null,
      },
      total.delfee,
      0,
      0,
      'dummy',
      0,
      0,
    );
  }, [total.subTotal, cart]);

  const cartPresent = cart?.length > 0 && cart.find(item => item.id == data.id);

  let count =
    cart?.length > 0
      ? cart
          .filter(item => item.id == data.id)
          .map(item => item.quantity)
          .join()
      : 0;

  const btnValidator =
    cartPresent &&
    Object.keys(cartPresent).length > 0 &&
    count &&
    Number(count) >= 1;

  return btnValidator ? (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Pressable
        style={[
          styles.increMentBtn,
          {
            flex: detail ? (widthResponse ? 1 : 0.4) : 0,
            alignItems: 'stretch', //@@
            marginRight: detail ? 25 : 0,
            // borderWidth: cartBtn ? 0 : 1,
            overflow: 'visible',
            borderRadius: detail ? 20 : 7,
          },
        ]}>
        {/* minus and delete button */}
        <Pressable
          style={[
            styles.plusMinus,
            {
              justifyContent: 'center', //@@
              paddingVertical: detail
                ? widthResponse
                  ? 10
                  : 15
                : widthResponse
                ? 5
                : 10, //@@
              paddingHorizontal: detail
                ? widthResponse
                  ? 10
                  : 15
                : widthResponse
                ? 5
                : 10, //@@
              // borderRadius: cartBtn ? 200 : 0, //@@
              borderRadius: cartBtn || detail ? 15 : 5,
              backgroundColor:
                cartBtn || detail
                  ? focusMinus
                    ? appColor.Textlightblack
                    : appColor.cardbg
                  : appColor.Textlightblack,
              elevation: 1,
            },
          ]}
          onPressIn={() => setFocusMins(true)}
          onPressOut={() => setFocusMins(false)}
          onPress={() => {
            if (count && Number(count) == 1) {
              cartBtn
                ? dispatch(setDeleteModal({isModal: true, item: data}))
                : dispatch(removeFromCart(data));
            } else {
              dispatch(dicrementQuantity(data));
            }
          }}>
          {count && Number(count) == 1 ? (
            <Icon
              ComponentName={'Feather'}
              name={'trash-2'}
              size={
                detail ? (widthResponse ? 24 : 30) : widthResponse ? 18 : 25 //@@
              }
              color={
                cartBtn || detail
                  ? focusMinus
                    ? appColor.white
                    : appColor.bgBlack
                  : appColor.white
              }
            />
          ) : (
            <Icon
              ComponentName={'Entypo'}
              name={'minus'}
              size={
                detail ? (widthResponse ? 24 : 30) : widthResponse ? 18 : 25 //@@
              }
              color={
                cartBtn || detail
                  ? focusMinus
                    ? appColor.white
                    : appColor.bgBlack
                  : appColor.white
              }
            />
          )}
        </Pressable>
        {/* count */}
        <View style={{justifyContent: 'center'}}>
          <Text
            style={[
              styles.textColor,
              {
                paddingHorizontal: 15,
                color: appColor.black,
                fontFamily: appFont.bB,
                fontSize: detail
                  ? fontScalling(3)
                  : fontScalling(widthResponse ? 1.8 : 2.2), //@@
              },
            ]}>
            {count <= 9 ? 0 + count : count}
          </Text>
        </View>
        {/* plus button */}
        <Pressable
          onPressIn={() => setFocus(true)}
          onPressOut={() => setFocus(false)}
          style={[
            styles.plusMinus,
            {
              justifyContent: 'center',
              paddingVertical: detail
                ? widthResponse
                  ? 10
                  : 15
                : widthResponse
                ? 5
                : 10, //@@
              paddingHorizontal: detail
                ? widthResponse
                  ? 10
                  : 15
                : widthResponse
                ? 5
                : 10, //@@
              // borderRadius: cartBtn ? 200 : 0, //@@
              borderRadius: cartBtn || detail ? 15 : 5,
              backgroundColor:
                cartBtn || detail
                  ? focus
                    ? appColor.Textlightblack
                    : appColor.cardbg
                  : appColor.Textlightblack,
            },
          ]}
          onPress={() => {
            dispatch(incrementQuantity(data));
          }}>
          <Icon
            ComponentName={'Entypo'}
            name={'plus'}
            size={detail ? (widthResponse ? 24 : 30) : widthResponse ? 18 : 25} //@@
            color={
              cartBtn || detail
                ? focus
                  ? appColor.white
                  : appColor.bgBlack
                : appColor.white
            }
          />
        </Pressable>
      </Pressable>
      {detail && (
        <PrimaryButton
          onPress={() => navigation.navigate('Carts', {screen: 'cart'})}
          Title={'Go To Cart'}
          parentStyle={{flex: 1}}
        />
      )}
    </View>
  ) : (
    <Pressable
      onPress={() => {
        dispatch(AddToCart(data));
      }}
      style={[
        styles.addButton,
        {
          flex: detail ? 1 : null,
          flexDirection: 'row',
          borderRadius: detail ? 20 : 5,
          paddingHorizontal: detail ? 0 : widthResponse ? 20 : 30, //@@
          paddingVertical: detail ? 12.5 : widthResponse ? 7 : 12, //@@
          marginRight: detail ? 10 : 0,
        },
      ]}>
      {detail && (
        <Icon
          color={appColor.white}
          ComponentName={'AntDesign'}
          name={'shoppingcart'}
          size={widthResponse ? 22 : 40} //@@
        />
      )}
      <Text
        style={[
          styles.textColor,
          {
            marginLeft: detail ? (widthResponse ? 7 : 12) : 0,
            fontSize: detail
              ? fontScalling(2.5)
              : widthResponse //@@
              ? fontScalling(1.6)
              : fontScalling(1.8),
          },
        ]}>
        Add to cart
      </Text>
    </Pressable>
  );
};

export default AddToCartBtn;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    addButton: {
      backgroundColor: appColor.Textlightblack,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0.7,
      shadowOffset: 0.5,
    },
    increMentBtn: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 5,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    textColor: {
      color: appColor.white,
      fontSize: fontScalling(1.6),
      fontFamily: appFont.bR,
      textAlignVertical: 'center',
    },
    plusMinus: {
      padding: 5,
      backgroundColor: appColor.bgBlack,
      shadowOffset: {width: 1, height: 1},
      shadowColor: 'black',
      shadowOpacity: 0.2,
      elevation: 3,
    },
  });
  return {styles};
};
