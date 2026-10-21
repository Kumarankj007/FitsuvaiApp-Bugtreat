import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import appColors from '../../utilities/appColors';
import {
  widthResponse,
  fontScalling,
  scrnWidth,
  currencyConvertor,
  print,
  objectLength,
  scrnHeight,
} from '../../utilities/helperFunction';
import { appFont } from '../../utilities/appFont';
import MainOverflowCard from '../../components/Card/MainOverflowCard';
import { Icon } from '../../utilities/icon';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import FromToCard from '../../components/Card/FromToCard';
import { url } from '../../utilities/appApi';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { OrderdetailShimmer } from '../../utilities/appShimmer';
import { useShowToast } from '../../components/Toast/ToastAlert';
import OrderPriceContainer from '../../components/Card/OrderPriceContainer';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const OrderDetail = ({ navigation, route }) => {
  const { status, order_id, order_created, delivery_date, expect_delivery_time } =
    route.params;
  const appColor = appColors();
  const showToast = useShowToast();
  const isFocused = useIsFocused();
  const { styles } = useStyle();
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // customeraddress

  const address = `${details.address && details.address.hno} , ${details.address && details.address.street
    } , ${details.address && details.address.city} - ${details.address && details.address.pincode
    } , ${details.address && details.address.country} `;

  // owneraddress
  const siteAddress = `${details.site_data && details.site_data.address} , ${details.site_data && details.site_data.city
    } - ${details.site_data && details.site_data.postcode}`;

  // download file:
  const downloadFile = async url => {
    try {
      const fileName = `Fitsuvai #${order_id} Invioce.pdf`;
      let dirs = RNBlobUtil.fs.dirs;
      RNBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
        path: `${dirs.DocumentDir}/${fileName}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'File downloaded by download manager.',
          mime: 'application/pdf',
        },
      })
        .fetch('GET', url)
        .then(res => {
          // print(res, 'res');
          if (Platform.OS === 'ios') {
            const filepath = res.path();
            let options = {
              type: 'application/pdf',
              url: filepath,
              saveToFiles: true,
            };
            Share.open(options)
              .then(resp => {
                // print(resp, 'response');
              })
              .catch(err => {
                err && console.log(err, 'err');
              });
          }
          showToast('success', 'Invoice Download', 'Download success', 2000);
        })
        .catch(err => console.log('BLOB ERROR -> ', err));
    } catch (e) {
      console.log(e, 'err');
    }
  };
  // console.log(order_id);

  //api call
  const apiCall = async () => {
    try {
      if (!objectLength(details)) {
        setLoad(true);
      }
      // request data for backend:
      var myHeaders = new Headers();
      const formdata = new FormData();
      formdata.append('id', order_id);
      formdata.append('context', 'orderDetails');

      // print(formdata, 'formdata');

      var requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(url().myOrder, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'Success') {
          setDetails(resparse.data);
        }
      } else {
        print(response.status, 'status in orderDetail screen');
      }
      setLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'Error in order detail');
      setRefresh(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (isFocused && !refresh) {
      apiCall();
    }
  }, [isFocused]);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    refresh && apiCall();
  }, [refresh]);

  const apiCallStates = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const formdata = new FormData();

      const data = {
        country: 'India',
        // state: 'Tamil Nadu'
      };

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: 'follow',
      };

      // get the response:
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries/states',
        requestOptions,
      );
      // print(response.status, 'response')
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,'resparse')
      }

      setLoad(false);
      setRefresh(false);
    } catch (error) {
      setLoad(false);
      setRefresh(false);
      console.log(error, 'Error in my order');
    }
  };

  useEffect(() => {
    apiCallStates();
  }, []);

  return (
    <MainOverflowCard
      borderRadius={40}
      altStyle={{ paddingTop: 20 }}
      refresh={refresh}
      onRefresh={onRefresh}>
      {load ? (
        <OrderdetailShimmer />
      ) : objectLength(details) ? (
        <>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {/* logo */}
            <View
              style={{
                marginBottom: 10,
                width: widthResponse ? 70 : 100,
                height: widthResponse ? 70 : 100,
              }}>
              <FastImage
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
                source={require('../../../assets/images/splash_logo.png')}
              />
            </View>
            {order_id && order_id != '' && (
              <Text style={[styles.roboto_light, { marginBottom: 10 }]}>
                <Text style={{ color: appColor.Textlightblack }}>
                  Order Id: #
                </Text>
                {order_id}
              </Text>
            )}
            {/* download pdf */}
            {details?.order_details?.invoicePdf &&
              details?.order_details?.invoicePdf != '' && (
                <PrimaryButton
                  onPress={() =>
                    downloadFile(details?.order_details?.invoicePdf)
                  }
                  altStyle={{
                    flex: 0,
                    paddingHorizontal: 25,
                    paddingVertical: 7,
                  }}
                  parentStyle={{ marginBottom: widthResponse ? 30 : 40 }}
                  Title={'Download Invoice'}
                  black
                  download
                />
              )}
          </View>
          {/* light line */}
          <View
            style={{
              height: 1,
              width: scrnWidth,
              left: -23,
              backgroundColor: appColor.lightGreyLine,
            }}
          />
          {/* from and to */}
          <View style={{ paddingVertical: 15 }}>
            {/* from */}
            {objectLength(details?.site_data) && (
              <FromToCard
                title={details.site_data.name && details.site_data.name}
                // location={siteAddress && siteAddress}
                phone={details.site_data.phone && details.site_data.phone}
                email={details.site_data.email && details.site_data.email}
              />
            )}
            {/* to */}
            {objectLength(details?.address) && (
              <FromToCard
                title={details.address.name && details.address.name}
                to
                // deliveredTime={details.address.to.deliveredTime}
                location={address && address}
                phone={details.address.phone && details.address.phone}
                email={details.address.email && details.address.email}
              />
            )}
          </View>
          <PrimaryButton
            Title={'Track Order'}
            onPress={() => {
              navigation.navigate('order_track', {
                order_id: order_id,
                cancelled:
                  details?.order_details?.deleted &&
                  details?.order_details?.deleted,
                delivery_date:
                  details?.order_details?.delivery_date &&
                  details?.order_details?.delivery_date,
                order_created,
                delivery_date,
                expect_delivery_time,
              });
            }}
            parentStyle={{ padding: 0, paddingBottom: 20 }}
          />
          {/* products */}

          {details.product_details && details.product_details.length > 0 && (
            <FlatList
              scrollEnabled={false}
              data={details?.product_details}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      marginVertical: 20,
                      backgroundColor: appColor.lightGreyLine,
                    }}
                  />
                );
              }}
              keyExtractor={(data, index) => index}
              renderItem={({ item, index }) => {
                return (
                  <Pressable key={item.product_id} style={[styles.card_in]}>
                    {/* images */}
                    <View style={styles.img_view}>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 200, //@@
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: appColor.greyBg,
                        }}>
                        {item.product_image && item.product_image != '' && (
                          <FastImage
                            style={{
                              width: '70%',
                              height: '70%',
                              borderRadius: 100,
                            }} //@@
                            resizeMode="cover" //@@
                            source={{
                              uri: item.product_image,
                              priority: FastImage.priority.high,
                            }} //@@
                          />
                        )}
                      </View>
                    </View>
                    {/* details */}
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                      }}>
                      {item.product_name && (
                        <Text
                          numberOfLines={1}
                          style={[styles.baby_blk, { marginBottom: 3 }]}>
                          {item.product_name}
                        </Text>
                      )}
                      {item.product_count && item.product_price && (
                        <Text style={[styles.roboto_light, { marginBottom: 7 }]}>
                          {item.product_count} x{' '}
                          {currencyConvertor(item.product_price, 2)}
                        </Text>
                      )}
                      {item.product_total && (
                        <Text
                          style={[
                            styles.roboto_light,
                            {
                              fontFamily: appFont.rB,
                              color: appColor.themeYellow,
                            },
                          ]}>
                          {currencyConvertor(item.product_total, 2)}
                        </Text>
                      )}
                    </View>
                    {/* Add Review */}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {details?.status_history[4]?.value != 0 &&
                        item.review_posted != 0 && (
                          <Pressable
                            onPress={() => {
                              navigation.navigate('ReviewProduct', {
                                item: item,
                                id: 'addReview',
                              });
                            }}
                            style={{
                              paddingHorizontal: 25,
                              paddingVertical: 8,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: appColor.lightGreyLine,
                            }}>
                            <Text
                              style={[
                                styles.baby_blk,
                                { bottom: -2, fontSize: fontScalling(2) },
                              ]}>
                              Add Review
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
          {/* Total */}
          <View
            style={{
              width: scrnWidth,
              left: -23,
              marginVertical: 20,
              // paddingVertical: 15,   //@@
              // paddingHorizontal: 23,   //@@
              backgroundColor: appColor.greyBg,
            }}>
            {/* subtotal */}
            {details?.order_details && details.address.distance && (
              <OrderPriceContainer
                data={details.order_details}
                isPersent={true}
                km={details.address.distance}
              />
            )}
          </View>
          {/* note */}
          <View style={{ marginBottom: 20 }}>
            {details.notes && details.notes != '' && (
              <>
                <Text
                  style={[
                    styles.roboto_light,
                    {
                      textTransform: 'uppercase',
                      fontSize: fontScalling(1.9),
                      marginBottom: 10,
                    },
                  ]}>
                  NOTE:
                </Text>
                <Text style={styles.roboto_light}>{details.notes}</Text>
              </>
            )}
          </View>
          {/* Thanks for rating */}
          <View
            style={{
              width: '100%',
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              borderRadius: 6,
              padding: widthResponse ? 8 : 12, //@@
              backgroundColor: appColor.themeyellowLight,
              alignItems: 'center',
            }}>
            <Icon
              name={'thumbs-up'}
              ComponentName={'Feather'}
              size={widthResponse ? 15 : 20}
              color={appColor.themeYellow}
            />
            <Text
              style={[
                styles.roboto_light,
                { color: appColor.themeYellow, marginLeft: 4 },
              ]}>
              Thanks for the rating !....
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: (scrnHeight / 2) - 100,
          }}>
          <Text style={[styles.baby_blk, { color: appColor.themeYellow }]}>
            Order is empty
          </Text>
        </View>
      )}
    </MainOverflowCard>
  );
};

export default OrderDetail;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    card_in: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    img_view: {
      width: widthResponse ? 80 : 150,
      height: widthResponse ? 80 : 150,
      backgroundColor: appColor.bgWhite,
    },
    imglength: {
      borderWidth: 1,
      borderRadius: 6,
      height: '100%',
      width: '100%',
      padding: 3,
      borderColor: appColor.bgBlack,
      backgroundColor: appColor.bgBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    baby_blk: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.3),
      color: appColor.textBlack,
    },
    roboto_light: {
      fontFamily: appFont.rR,
      fontSize: fontScalling(1.7),
      color: appColor.textBlack,
    },
  });

  return { styles };
};
