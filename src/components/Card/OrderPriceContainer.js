import React, { useState } from 'react';
import {View, Text, LayoutAnimation, Pressable, Image} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  currencyConvertor,
  fontScalling,
  print,
  widthResponse,
} from '../../utilities/helperFunction';
import {useSelector} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Icon } from '../../utilities/icon';

const OrderPriceContainer = ({
  data,
  refer,
  km,
  orders = false,
  pinkColor = false,
  nutrition = false,
  isPersent = false,
  feePerMeal = false,
  isDropDown = false
}) => {
  const {userSettings} = useSelector(state => state.setting);
  const appColor = appColors();
  // print(data, 'data');
const [dropDown, setDropDown] = useState(isDropDown);

  const togglePress = () => {
    setDropDown(!dropDown);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: pinkColor ? appColor.subtotalBack : appColor.cartBg,
          paddingVertical: 10,
          borderRadius: 10,
          paddingHorizontal: 10,
        }}>
      <Pressable
          onPress={() => {
            togglePress();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isDropDown ? 'space-between' : 'center',
            paddingVertical: isDropDown ? 10 : null,
            paddingHorizontal: isDropDown ? 10 : null,
            backgroundColor: isDropDown ? appColor.white : null,
            marginBottom: isDropDown ? 5 : null,
            borderRadius: isDropDown ? 10 : null,
            shadowOpacity: isDropDown ? 0.6 : 0,
            shadowColor: appColor.gold,
            shadowOffset:{width:1,height:1}
          }}>
          <View style={{flexDirection: 'row'}}>
            {isDropDown && (
              <Image
                style={{width: widthResponse? 25:35, height: widthResponse? 25:35}}
                source={require('../../../assets/images/invoice.png')}
              />
            )}
            <View style={{alignItems: 'flex-start'}}>
              <Animatable.Text
                style={{
                  fontFamily: isDropDown ? appFont.bB : appFont.rB,
                  fontSize: fontScalling(widthResponse?2:2.5),
                  color: appColor.black,
                  textAlign: isDropDown ? 'left' : 'center',
                  textTransform: 'uppercase',
                  textDecorationLine: isDropDown ? 'none' : 'underline',
                  letterSpacing: 1,
                  paddingHorizontal: isDropDown ? 10 : 0,
                }}>
                {isDropDown
                  ? `To Pay ${
                      data.totalamt
                        ? currencyConvertor(Number(data.totalamt), 2)
                        : currencyConvertor(0.0)
                    }`
                  : 'Bill Details'}
              </Animatable.Text>
              {isDropDown && (
                <Text
                  style={{
                    fontFamily: appFont.rR,
                    fontSize: fontScalling(widthResponse?1.5:1.8),
                    color: appColor.textGrey,
                    paddingHorizontal: isDropDown ? 10 : 0,
                  }}>
                  Incl all taxes & Charges
                </Text>
              )}
            </View>
          </View>
          {isDropDown && (
            <Icon
              ComponentName={'Entypo'}
              name={dropDown ? 'chevron-down' : 'chevron-up'}
              color={appColor.textGrey}
              size={widthResponse?22:30}
            />
          )}
        </Pressable>
       {!dropDown&& <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            Sub Total :
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            {' '}
            {data.subTotal
              ? currencyConvertor(data.subTotal, 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>
        {!orders && (
          <>
            {data.discount &&
            data.discount?.amount &&
            data.discount.amount != 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: appFont.rB,
                    fontSize: fontScalling(2),
                    color: appColor.gold,
                  }}>
                  Discount Amount :{' '}
                  {!isPersent &&
                    `(${
                      data?.discount?.percent && data.discount.percent != ''
                        ? Number(data.discount.percent).toFixed(
                            Number(data.discount.percent) % 1 == 0 ? 0 : 2,
                          )
                        : ''
                    }%)`}
                </Text>

                <Text
                  style={{
                    fontFamily: appFont.bB,
                    fontSize: fontScalling(2),
                    color: appColor.gold,
                  }}>
                  -{' '}
                  {data.discount.amount && data.discount.amount != 0
                    ? currencyConvertor(data.discount.amount, 2)
                    : currencyConvertor(0.0)}
                </Text>
              </View>
            ) : null}
          </>
        )}

        <>
          {data.disCount && data.disCount != 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontFamily: appFont.rB,
                  fontSize: fontScalling(2),
                  color: appColor.gold,
                }}>
                Discount Amount :{' '}
                {!isPersent &&
                  `(${
                    data?.disCount?.percent && data.disCount.percent != ''
                      ? data.disCount.percent
                      : ''
                  }%)`}
                {data?.discount_percent &&
                  data?.discount_percent != '' &&
                  '(' + data?.discount_percent + '%)'}
              </Text>

              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                  color: appColor.gold,
                }}>
                -{' '}
                {data.disCount && data.disCount != 0
                  ? currencyConvertor(data.disCount, 2)
                  : currencyConvertor(0.0)}
              </Text>
            </View>
          ) : null}
        </>

        {data.amount_reduced && data.amount_reduced != 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              Reward redeemed amount :
            </Text>
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              -
              {data.amount_reduced
                ? currencyConvertor(data.amount_reduced, 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.Textlightblack,
            }}>
            CGST {userSettings?.CGST && ' ' + `(${userSettings?.CGST}%)`} :
          </Text>
          {
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.black,
              }}>
              +{' '}
              {data.cgst
                ? currencyConvertor(Number(data.cgst), 2)
                : currencyConvertor(0.0)}
            </Text>
          }
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.Textlightblack,
            }}>
            SGST {userSettings?.SGST && ' ' + `(${userSettings?.SGST}%)`} :
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            +{' '}
            {data.sgst
              ? currencyConvertor(Number(data.sgst), 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>
        {data.vesselPrice > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              Package :{`${'(' + data.vesselName + ')'}`}
            </Text>

            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              +{' '}
              {data.vesselPrice > 0
                ? currencyConvertor(data.vesselPrice, 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        )}
        {data.delfee && data.delfee != 0 && km != 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: appFont.rB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              {km && km > 0
                ? 'Delivery Fee :' +
                  ' (' +
                  (Number(km).toFixed(2) + ' Km') +
                  ')'
                : 'Delivery Fee :'}
            </Text>
            <Text
              style={{
                fontFamily: appFont.bB,
                fontSize: fontScalling(2),
                color: appColor.gold,
              }}>
              <Text
                style={{
                  fontFamily: appFont.bB,
                  fontSize: fontScalling(2),
                  color: appColor.bgBlack,
                }}>
                {feePerMeal &&
                  currencyConvertor(
                    Number(data.delfee) / Number(data.dishCount),
                  ) + '/Meal '}
              </Text>
              {data.delfee
                ? feePerMeal
                  ? ` ( ${currencyConvertor(Number(data.delfee), 0)} )`
                  : ' + ' + currencyConvertor(Number(data.delfee), 2)
                : currencyConvertor(0.0)}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontFamily: appFont.rB,
              fontSize: fontScalling(2),
              color: appColor.black,
            }}>
            Total
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(2),
              color: appColor.gold,
              fontSize: 20,
            }}>
            {' '}
            {data.totalamt
              ? currencyConvertor(Number(data.totalamt), 2)
              : currencyConvertor(0.0)}
          </Text>
        </View>
        </>}
      </View>
    </View>
  );
};

export default OrderPriceContainer;
