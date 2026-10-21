import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ImageView from 'react-native-image-viewing';
import appColors from '../../utilities/appColors';
import {
  arrayLength,
  currencyConvertor,
  fontScalling,
  objectLength,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import { appFont } from '../../utilities/appFont';
import RatingComponent from '../../components/RatingComponents/RatingComponent';
import OfferTag from '../../components/CssShape/OfferTag';
import FavIconButton from '../../components/Buttons/FavIcon';
import { Icon } from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import SideHeading from '../../components/Card/SideHeading';
import ProductCard from '../../components/Card/ProductCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import AddToCartBtn from '../../components/Buttons/AddToCartBtn';
import ReviewCard from '../../components/Card/ReviewCard';
import { url } from '../../utilities/appApi';
import AutoHeightHTML from '../../components/HtmlElement/AutoHeightWebView';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { DetailShimmer } from '../../utilities/appShimmer';
import { useSelector } from 'react-redux';
import MainOverflowCard from '../../components/Card/MainOverflowCard';
import RadioButton from '../../components/Buttons/RadioButton';
import ReadMore from '../../components/Buttons/ReadMore';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';

const ProductDetails = ({ route, navigation }) => {
  const { styles } = useStyles();
  const appColor = appColors();

  const [imgIndex, setImgIndex] = useState(0);
  const [listBtn, setListBtn] = useState(false);
  const [listBtnRight, setListBtnright] = useState(false);
  const [toggleButton, setToggleButton] = useState(0);
  const dateRef = useRef(null);
  const [productInfo, setProductInfo] = useState({});
  const [reviewList, setReviewList] = useState([]);
  const [load, setLoad] = useState(false);
  const [loadShare, setLoadShare] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeIndex, setSizeIndex] = useState(0);

  const { userSettings, vegToggle } = useSelector(state => state.setting);
  const { userType } = useSelector(state => state.auth);

  const scrollSizeRef = useRef(null);

  const NutritionCard = ({ keys, values, altStyle = {} }) => {
    // print(values, 'values');
    return (
      <>
        {values != 0 && (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-around',
                paddingVertical: 8,
                borderBottomWidth: 0.4,
                borderBlockColor: appColor.lightGreyLine,
                // paddingLeft: 20,
                // paddingHorizontal: 25,
              },
              altStyle,
            ]}>
            <Animatable.Text
              animation={'fadeInLeft'}
              duration={1000}
              style={[
                styles.normalText,
                {
                  width: '20%',
                  textTransform: 'capitalize',
                  fontFamily: appFont.bB,
                  color: appColor.gold,
                },
              ]}>
              {keys}
            </Animatable.Text>
            <Text style={styles.normalText}>:</Text>
            <ReadMore
              numOfLine={2}
              content={values}
              contentStyle={[styles.normalText, { paddingLeft: 5 }]}
              parentStyle={{ width: '50%' }}
              readStyle={{ backgroundColor: appColor.white }}
            />
            {/* <Animatable.Text
              animation={'fadeInRight'}
              duration={1000}
              style={[
                styles.normalText,
                {width: '35%', textTransform: 'capitalize'},
              ]}>
              {values}
            </Animatable.Text> */}
          </View>
        )}
      </>
    );
  };

  const apiCall = async (product_id = '') => {
    const productId = product_id != '' ? product_id : route?.params?.productId;
    try {
      // loading enable:
      if (!objectLength(productInfo)) {
        setLoad(true);
      }
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('context', 'info');
      formData.append('veg_filter', vegToggle ? 1 : 0);
      if (route?.params?.productId) {
        formData.append('productId', productId);
      }
      if (
        userSettings &&
        userSettings?.userInfo &&
        userSettings?.userInfo?.user_id
      ) {
        formData.append('userId', userSettings?.userInfo?.user_id);
      }
      // print(formData, 'formData');
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // get the response:
      const response = await fetch(url().productDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse?.data, 'resparse');
          if (resparse?.data?.product) {
            setProductInfo(resparse.data.product);
            if (resparse?.data?.product?.size) {
              setSizes(resparse?.data?.product?.size);
            }
            if (resparse?.data?.reviewslist) {
              setReviewList(resparse?.data?.reviewslist);
            }
            if (refresh) {
              setSizeIndex(0);
            }
            setLoad(false);
            setRefresh(false);
          }
        }
      } else {
        print(response.status, 'status in product Detail');
        setLoad(false);
        setRefresh(false);
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in product detail');
      setLoad(false);
      setRefresh(false);
    }
  };

  // print(productInfo, 'pi');

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  const {
    id,
    name,
    images,
    main_image,
    size,
    offer,
    discount,
    price,
    category,
    product_sku,
    stock,
    product_group,
    short_description,
    product_description,
    additional_info,
    protein,
    calories,
    fats,
    vitamins,
    minerals,
    carbs,
    related,
    url: uri,
    gi,
    gl,
    ingredients,
  } = productInfo;

  const productToReview = {
    product_name: name,
    product_id: id,
    product_price: price,
    product_unit: stock,
    offer: offer,
    product_image:
      images && images != undefined && images.length > 0 ? images[0] : '',
    carbs: carbs,
  };

  const productsToCart = {
    id: id,
    name: name,
    image: images && images != undefined && images.length > 0 ? images[0] : '',
    main_image:
      main_image && main_image != undefined && main_image.length > 0
        ? main_image[0]
        : '',
    size: size,
    offer: offer,
    discount: discount,
    price: price,
    category: category,
    stock: stock,
    product_group: product_group,
    protein,
    calories,
    fats,
    vitamins,
    minerals,
    carbs,
  };
  // console.log(productInfo, 'productsToCart');

  const productsToShow = {
    id: id,
    name: name,
    image:
      images && images != undefined && images.length > 0 ? images : main_image,
    size: size,
    offer_price: offer,
    offer: discount,
    price: price,
    category: category,
    stock: stock,
    product_group: product_group,
  };

  const onShare = async () => {
    if (
      images && images.length > 0
        ? images[0]
        : main_image && main_image.length > 0 && main_image[0]
    ) {
      setLoadShare(true);
      const validImage =
        images && images.length > 0
          ? images[0]
          : main_image && main_image.length > 0 && main_image[0];
      const filename = validImage && validImage.split('/').slice(-1).toString();
      try {
        const filePath = RNFS.DocumentDirectoryPath + `/${filename}`;
        const response = await fetch(validImage);
        const blob = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onloadend = async () => {
          const base64data = fileReaderInstance.result;
          await RNFS.writeFile(filePath, base64data.split(',')[1], 'base64');
          const options = {
            title: `Check out this product: ${name}\nPrice: ${price}\ncatoegory: ${category}\n ${uri}`,
            url: 'file://' + filePath,
            type: 'image/jpeg',
            message: `Check out this product: ${name}\nPrice: ${price}\ncatoegory: ${category}\n ${uri}`,
          };
          setLoadShare(false);
          await Share.open(options).catch(e => console.log(e));
        };
      } catch (error) {
        Alert.alert(error.message);
        setLoadShare(false);
      }
    }
  };

  useEffect(() => {
    (() => {
      apiCall();
    })();
  }, [route, refresh, vegToggle]);

  // handleImageChange:   //@@@
  const handleImageChange = click => {
    if (click == 'next') {
      if (imgIndex < productsToShow.image.length - 1) {
        setImgIndex(imgIndex + 1);
        dateRef.current.scrollToIndex({
          animated: true,
          index: imgIndex,
        });
      } else if (imgIndex == productsToShow.image.length - 1) {
        setImgIndex(0);
        dateRef.current.scrollToIndex({
          animated: true,
          index: 0,
        });
      }
    }
    if (dateRef.current && click == 'prev') {
      if (imgIndex > 0) {
        setImgIndex(imgIndex - 1);
        dateRef.current.scrollToIndex({
          animated: true,
          index: imgIndex - (imgIndex == 1 ? 1 : 2),
        });
      } else if (imgIndex == 0) {
        setImgIndex(productsToShow.image.length - 1);
        dateRef.current.scrollToIndex({
          animated: true,
          index: productsToShow.image.length - 1,
        });
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <ReviewCard edit={false} data={item} review={true} productList={false} />
    );
  };

  useEffect(() => {
    // print(productsToShow?.id, 'id');
    setImgIndex(0);
  }, [productsToShow?.id]);

  return (
    <MainOverflowCard
      onRefresh={onRefresh}
      refresh={refresh}
      productId={productsToShow?.id}
      borderRadius={50}
      altStyle={{ paddingTop: 23, paddingHorizontal: 0 }}>
      {load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <DetailShimmer />
        </ScrollView>
      ) : (
        objectLength(productsToShow) && (
          <>
            {productsToShow.name && (
              <Text style={[styles.HeadingText, { textAlign: 'center' }]}>
                {productsToShow.name}
              </Text>
            )}
            {reviewList &&
              reviewList.reviewdata &&
              reviewList.reviewdata.average && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    // paddingBottom: 15,
                  }}>
                  <RatingComponent rating={reviewList.reviewdata.average} />
                  <Text style={[styles.subText]}>
                    {'  ( ' +
                      reviewList.reviewdata.review_count +
                      ' Reviews' +
                      ')'}
                  </Text>
                </View>
              )}
            {/* banner Image */}
            {arrayLength(productsToShow.image) && (
              <Pressable
                onPress={() => {
                  setIsVisible(true);
                }}
                style={{
                  borderRadius: 15,
                  backgroundColor: appColor.cartBg,
                  height: widthResponse ? scrnHeight / 3.5 : scrnWidth / 2,
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: 15,
                  // borderWidth: 1,
                  overflow: 'hidden',
                }}>
                <FastImage
                  source={{
                    uri: productsToShow.image
                      ? productsToShow.image[imgIndex]
                      : '',
                    priority: FastImage.priority.high,
                  }}
                  resizeMode="cover"
                  style={{ ...StyleSheet.absoluteFillObject }}
                />
                <View
                  style={{ width: '100%', height: '100%' }} //@@
                >
                  <Animatable.View
                    // animation={'zoomIn'}
                    // duration={1000}
                    // iterationDelay={200}
                    // iterationCount={'infinite'}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: 0,
                    }}>
                    {productsToShow.offer && productsToShow.offer != 0 && (
                      <OfferTag
                        offer={
                          Number(productsToShow.offer).toFixed(0) + '% OFF'
                        }
                        reverse={true}
                      />
                    )}
                  </Animatable.View>
                  <View
                    style={{
                      position: 'absolute',
                      top: '7%',
                      right: widthResponse ? '5%' : 20, //@@
                    }}>
                    {userType == 'user' && (
                      <FavIconButton pId={productsToCart} />
                    )}
                    <Pressable
                      onPress={loadShare ? () => { } : onShare}
                      style={{
                        width: widthResponse ? 30 : 45, //@@
                        height: widthResponse ? 30 : 45, //@@
                        borderRadius: 200,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        backgroundColor: appColor.white,
                        marginTop: 10,
                        elevation: 0.3,
                        shadowOffset: 2,
                      }}>
                      {loadShare ? (
                        <LottieView
                          autoPlay={true}
                          style={{
                            width: widthResponse ? 80 : 100, //@@
                            height: widthResponse ? 80 : 100, //@@
                            top: widthResponse ? 2 : 5,
                          }}
                          source={require('../../../assets/lottieFiles/load.json')}
                        />
                      ) : (
                        <Icon
                          ComponentName={'MaterialCommunityIcons'}
                          name={'share'}
                          color={appColor.bgBlack}
                          size={widthResponse ? 23 : 35} //@@
                        />
                      )}
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
            {/* list items */}
            {productsToShow &&
              arrayLength(productsToShow.image) &&
              productsToShow?.image?.length > 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 15,
                    width: scrnWidth - 100,
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={() => setListBtn(true)}
                    onPressOut={() => setListBtn(false)}
                    style={[
                      styles.arrow,
                      {
                        //@@
                        backgroundColor: listBtn
                          ? appColor.bgBlack
                          : appColor.cartBg,
                      },
                    ]}
                    onPress={() => {
                      handleImageChange('prev');
                    }}>
                    <Icon
                      name={'arrow-back-ios-new'}
                      ComponentName={'MaterialIcons'} //@@
                      size={widthResponse ? 14 : 25}
                      color={listBtn ? appColor.white : appColor.bgBlack}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      // flex: 1,
                      overflow: 'hidden',
                      marginHorizontal: widthResponse ? 10 : 20,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}>
                    <FlatList
                      data={productsToShow.image}
                      ref={dateRef}
                      keyExtractor={(item, index) => index}
                      style={{
                        width:
                          productsToShow?.image?.length > 2
                            ? scrnWidth / 2
                            : null,
                        alignSelf: 'center',
                      }}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      ItemSeparatorComponent={() => {
                        return <View style={{ padding: 7 }} />;
                      }}
                      renderItem={({ item, index }) => {
                        return (
                          <Pressable
                            style={{
                              padding: 5,
                              backgroundColor: appColor.cartBg,
                              width: scrnWidth / 7,
                              height: scrnWidth / 7,
                              borderRadius: 5,
                              opacity: imgIndex == index ? 1 : 0.4,
                            }}
                            key={index}
                            onPress={() => {
                              setImgIndex(index);
                            }}>
                            {item && item != '' && (
                              <FastImage
                                resizeMode="contain"
                                style={{ width: '100%', height: '100%' }}
                                source={{
                                  uri: item,
                                  priority: FastImage.priority.high,
                                }}
                              />
                            )}
                          </Pressable>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={() => setListBtnright(true)}
                    onPressOut={() => setListBtnright(false)}
                    style={[
                      styles.arrow,
                      {
                        backgroundColor: listBtnRight
                          ? appColor.bgBlack
                          : appColor.cartBg,
                      },
                    ]}
                    onPress={() => {
                      handleImageChange('next');
                    }}>
                    <Icon
                      name={'arrow-forward-ios'}
                      ComponentName={'MaterialIcons'}
                      size={widthResponse ? 14 : 25}
                      color={listBtnRight ? appColor.white : appColor.bgBlack}
                    />
                  </TouchableOpacity>
                </View>
              )}
            {productsToShow?.price && (
              <Text
                style={[
                  styles.HeadingText,
                  {
                    alignSelf: 'center',
                    color: appColor.gold,
                    marginTop: productsToShow?.image?.length < 2 ? 15 : 0,
                  },
                ]}>
                {currencyConvertor(productsToShow?.offer_price, 2) + '  '}
                {productsToShow?.price &&
                  productsToShow?.offer_price &&
                  productsToShow?.price != productsToShow?.offer_price && (
                    <Text
                      style={[
                        styles.price,
                        { marginLeft: 15, textDecorationLine: 'line-through' },
                      ]}>
                      {currencyConvertor(productsToShow?.price, 2)}
                    </Text>
                  )}
              </Text>
            )}
            {/* {(protein != '0' ||
              vitamins != '0' ||
              calories != '0' ||
              fats != '0' ||
              minerals != '0') && (
              <Text style={[styles.normalText, {alignSelf: 'center'}]}>
                Nutrients in food
              </Text>
            )} */}
            {calories && calories != 0 && (
              <NutritionCard keys={'calories'} values={`${calories} cal`} />
            )}
            {protein && protein != 0 && (
              <NutritionCard keys={'Protein'} values={`${protein} g`} />
            )}
            {carbs && carbs != 0 && (
              <NutritionCard keys={'carbs'} values={`${carbs} g`} />
            )}
            {fats && fats != 0 && (
              <NutritionCard keys={'Fats'} values={`${fats} g`} />
            )}
            {vitamins && vitamins != 0 && (
              <NutritionCard keys={'vitamins'} values={vitamins} />
            )}
            {minerals && minerals != 0 && (
              <NutritionCard keys={'Minerals'} values={minerals} />
            )}
            {gi && gi != 0 && <NutritionCard keys={'GI'} values={gi} />}
            {gl && gl != 0 && (
              <NutritionCard
                keys={'GL'}
                values={gl}
                altStyle={{ marginBottom: 15 }}
              />
            )}
            {product_sku && product_sku != 0 && (
              <NutritionCard keys={'sku'} values={`${product_sku} `} />
            )}
            {category && category != 0 && (
              <NutritionCard keys={'Category'} values={`${category} `} />
            )}

            {short_description && (
              <View style={{ flex: 1, paddingBottom: 10 }}>
                <AutoHeightHTML url={short_description} />
              </View>
            )}
            {/* <View style={styles.line} /> */}
            {/* Button Block */}
            <View style={{ flex: 1, marginTop: 10 }}>
              <AddToCartBtn data={productsToCart} detail={true} />
            </View>
            {/* Product size */}
            {sizes && sizes.length > 0 && (
              <FlatList
                ref={scrollSizeRef}
                data={sizes}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginVertical: widthResponse ? 10 : 20, //@@
                }}
                renderItem={({ item: data, index }) => {
                  const activeIndex = sizes.findIndex(data => data.id == id);
                  const active = activeIndex == index;
                  return (
                    <Animatable.View
                      animation={'bounceInRight'}
                      duration={1500 * (index + 0.5)}>
                      <RadioButton
                        onPress={() => {
                          setSizeIndex(index);
                          if (
                            scrollSizeRef &&
                            scrollSizeRef.current &&
                            scrollSizeRef.current.scrollToIndex
                          ) {
                            scrollSizeRef.current.scrollToIndex({
                              index: index,
                              animation: true,
                            });
                          }
                          apiCall(data.id);
                        }}
                        isChecked={active}
                        text={`${data.size.toUpperCase()} @ ${currencyConvertor(
                          Number(data.offer).toFixed(2),
                        )}`}
                        altStyle={{
                          borderWidth: 1,
                          borderColor: active
                            ? appColor.gold
                            : appColor.bgBlack,
                          width: scrnWidth / (widthResponse ? 2 : 3), //@@
                          paddingHorizontal: 10,
                          marginRight:
                            index !== sizes.length - 1
                              ? widthResponse
                                ? 10
                                : 20
                              : 0, //@@
                          color: active ? appColor.gold : appColor.bgBlack,
                        }}
                        altText={{
                          color: active ? appColor.gold : appColor.bgBlack,
                        }}
                      />
                    </Animatable.View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {/* Details, Ratings & reviews button */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              {((product_description && product_description != '') || (ingredients && ingredients != '')) && (
                <Pressable
                  onPress={() => setToggleButton(0)}
                  style={{ alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.HeadingText,
                      {
                        color:
                          toggleButton == 0 ? appColor.gold : appColor.bgBlack,
                        textDecorationLine: 'underline',
                      },
                    ]}>
                    Descriptions
                  </Text>
                </Pressable>
              )}
              {((reviewList &&
                reviewList.reviews &&
                reviewList.reviews.length > 0) || (productInfo?.review_posted == 1 &&
                  productInfo?.review_status)) && (
                  <Pressable
                    onPress={() => setToggleButton(1)}
                    style={{
                      // paddingLeft: product_description && 50,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.HeadingText,
                        {
                          color:
                            toggleButton == 1
                              ? appColor.gold
                              : appColor.bgBlack,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      Ratings & Reviews
                    </Text>
                  </Pressable>
                )}
            </View>
            {/* details tab */}
            {toggleButton == 0 && (
              <>
                {product_description && (
                  <Animatable.View
                    animation={'fadeInUp'}
                    duration={1000}
                    style={{ padding: 0 }}>
                    {product_description && (
                      <>
                        <AutoHeightHTML url={product_description} />
                        {additional_info && (
                          <View style={{ paddingTop: 10 }}>
                            <AutoHeightHTML url={additional_info} />
                          </View>
                        )}
                      </>
                    )}
                  </Animatable.View>
                )}
                {ingredients && ingredients != '' && (
                  <View style={{ paddingTop: 0 }}>
                    {/* <HtmlView url={additional_info} /> */}
                    <Text
                      style={[
                        styles.normalText,
                        {
                          // textAlign: 'center',
                          textDecorationLine: 'underline',
                          fontSize: fontScalling(2.2),
                          fontFamily: appFont.bB,
                          marginTop: 10,
                          // paddingLeft: 20,
                        },
                      ]}>
                      Ingredients :
                    </Text>
                    <AutoHeightHTML url={ingredients} />
                  </View>
                )}
              </>
            )}

            {/* review tab */}
            {(toggleButton == 1) && (
              <>
                {reviewList &&
                  reviewList.reviews &&
                  reviewList.reviews.length > 0 && (
                    <FlatList
                      scrollEnabled={false}
                      data={reviewList.reviews.slice(0, 4)}
                      keyExtractor={(item, index) => index}
                      renderItem={renderItem}
                      style={{ marginTop: 10 }}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                {reviewList &&
                  reviewList.reviews &&
                  reviewList.reviews.length > 3 && (
                    <PrimaryButton
                      Title={'see more reviews'}
                      altStyle={{ marginBottom: 10 }}
                      onPress={() => {
                        navigation.navigate('reviewOverView', {
                          productId: productInfo.id,
                        });
                      }}
                      outLine
                    />
                  )}
                {productInfo?.review_posted == 1 &&
                  productInfo?.review_status && (
                    <PrimaryButton
                      Title={'Write a review'}
                      parentStyle={{ marginTop: 10 }}
                      // altStyle={{marginTop: 10}}
                      // black
                      onPress={() => {
                        navigation.navigate('Profile', {
                          screen: 'ReviewProduct',
                          initial: false,
                          params: { item: productToReview, id: 'addReview' },
                        });
                      }}
                    />
                  )}
              </>
            )}
            {/* related products */}
            {related && arrayLength(related) && (
              <>
                {/* Related products */}
                <SideHeading
                  title={'Related Foods'}
                  altStyle={{ paddingHorizontal: 0 }}
                  onPress={() => {
                    navigation.navigate('productOverView', {
                      context: 'relatedProducts',
                      productId: productsToShow.id,
                    });
                  }}
                />
                {/* card section */}
                <View
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    width: scrnWidth,
                  }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={related.slice(0, 4)}
                    keyExtractor={(item, ind) => item.name.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <ProductCard
                          key={index}
                          item={item}
                          ind={index}
                          bgGrey={true}
                        />
                      );
                    }}
                  />
                </View>
              </>
            )}
          </>
        )
      )}
      <ImageView
        images={
          images && images.length > 0
            ? images.map(data => ({ uri: data }))
            : main_image && main_image.length > 0
              ? main_image.map(data => ({ uri: data }))
              : null
        }
        imageIndex={imgIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </MainOverflowCard>
  );
};

export default ProductDetails;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    HeadingText: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(3),
      color: appColor.black,
      paddingBottom: 5,
    },
    subText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.5),
      color: appColor.black,
    },
    normalText: {
      fontFamily: appFont.rM,
      fontSize: fontScalling(2),
      color: appColor.black,
    },
    price: {
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.2),
      color: appColor.textGrey,
    },
    line: {
      width: scrnWidth,
      height: 0.5,
      backgroundColor: appColor.textGrey,
      alignSelf: 'center',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.bgBlack,
      marginTop: 5,
    },
    dotWhite: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: appColor.white,
      marginTop: 5,
    },
    arrow: {
      borderRadius: 100,
      padding: widthResponse ? 5 : 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0.5,
      shadowOpacity: 0.2,
      shadowOffset: { height: 2 },
      shadowRadius: 5,
      shadowColor: appColor.bgBlack,
    },
  });

  return { styles };
};
