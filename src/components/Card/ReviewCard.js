import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {appFont} from '../../utilities/appFont';
import RatingComponent from '../RatingComponents/RatingComponent';
import {useNavigation} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import ReadMore from '../Buttons/ReadMore';
import FastImage from 'react-native-fast-image';

const ReviewCard = ({data, edit = false, deleteFn, productList = true}) => {
  const appColor = appColors();
  const {styles} = useStyle();
  const navigation = useNavigation();
  const [imgIndex, setImgIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: appColor.cardbg,
        marginBottom: 15,
        borderRadius: 10,
        padding: 15,
      }}>
      {productList && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
          {data.prod_name && data.prod_name != '' && (
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                paddingRight: widthResponse ? 5 : 10,
                color: appColor.textBlack,
                fontFamily: appFont.bB,
                fontSize: fontScalling(3),
              }}>
              {data.prod_name}
            </Text>
          )}
          <View style={{flexDirection: 'row'}}>
            {edit && (
              <Pressable
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  // console.log(data, 'data');
                  navigation.navigate('ReviewProduct', {
                    item: data,
                    id: 'editReview',
                  });
                }}>
                <Icon
                  ComponentName={'AntDesign'}
                  name={'edit'}
                  color={appColor.themeYellow}
                  size={widthResponse ? 17 : 30} //@@
                />
                <Text
                  style={{
                    fontFamily: appFont.rM,
                    color: appColor.themeYellow,
                    fontSize: fontScalling(2.3),
                    marginLeft: 6,
                  }}>
                  Edit
                </Text>
              </Pressable>
            )}
            {deleteFn && (
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}
                onPress={() => {
                  deleteFn(data.id);
                }}>
                <Icon
                  ComponentName={'Feather'}
                  name={'trash-2'}
                  color={appColor.boldBlacktext}
                  size={widthResponse ? 20 : 30}    //@@
                />
              </Pressable>
            )}
          </View>
        </View>
      )}
      {/* <Text style={[styles.text, {marginBottom: 10}]}>{data.review}</Text> */}
      <ReadMore
        content={data.review}
        numOfLine={2}
        contentStyle={[styles.text]}
        parentStyle={{marginBottom: 10}}
        readStyle={{
          backgroundColor: appColor.greyBg,
        }}
      />
      <View
        style={{
          paddingTop: 10,
          borderTopWidth: 1,
          borderColor: appColor.borderColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {/* //@@ */}
        <RatingComponent
          rating={data.rating}
          size={widthResponse ? 15 : 25}
          fullbg
        />
        <Text style={[styles.text, {fontSize: fontScalling(1.8)}]}>
          {productList ? 'Last Edited' : 'Posted on'} : {data.modified_at}
        </Text>
      </View>
      {data.images && data.images.split(',').length > 0 && (
        <FlatList
          data={data.images.split(',')}
          keyExtractor={(item, index) => index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 15}}
          renderItem={({item, index}) => {
            const isLastItem = index === data.images.length - 1;
            return (
              <Pressable
                onPress={() => {
                  setImgIndex(index);
                  setIsVisible(true);
                }}
                key={index}
                style={{flexDirection: 'row', marginRight: isLastItem ? 0 : 8}}>
                {item && item != '' && (
                  <FastImage
                    style={{
                      width: scrnWidth / 5,
                      height: scrnWidth / 5,
                      borderRadius: 10,
                      backgroundColor: appColor.placeHolderTextDark,
                    }}
                    source={{uri: item, priority: FastImage.priority.high,}}
                  />
                )}
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* review images full screen view */}
      <ImageView
        images={data.images.split(',').map(data => ({uri: data}))}
        imageIndex={imgIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default ReviewCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    text: {
      color: appColor.textBlack,
      fontSize: fontScalling(2.1),
      fontFamily: appFont.rR,
      lineHeight: fontScalling(2.9),
    },
  });

  return {styles};
};
