import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, Text} from 'react-native';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {Icon} from '../../utilities/icon';
import * as Animatable from 'react-native-animatable';
import MainCard from '../../components/Card/MainCard';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../redux/titleSlice';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from '../../components/Card/ImageView';

const SubcategoryScreen = ({route, navigation}) => {
  const {subcategories} = route.params;
  const dispatch = useDispatch();
  const appColor = appColors();
  const separator = widthResponse ? 10 : 15;
  const container = 40;
  const column = widthResponse ? 3 : 4;

  const handlePress = subcategory => {
    if (subcategory.subcategory?.length > 0) {
      // Navigate to the same screen with the next level of subcategories
      dispatch(setTitle(subcategory.name));
      navigation.push('Subcategory', {subcategories: subcategory.subcategory});
    } else {
      alert('No further subcategories available');
    }
  };

  const MenuCard = ({item, index}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 0.5,
          position: 'relative',
          backgroundColor: appColor.white,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: appColor.borderColor,
          width: (scrnWidth - container - (column - 1) * separator) / column,
          marginRight: (index + 1) % column && separator,
          backgroundColor: appColor.white,
          shadowOffset: {height: 1},
          shadowOpacity: 0.2,
          shadowRadius: 1,
          padding: widthResponse ? 1.5 : 2,
        }}>
        <Pressable
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: widthResponse ? 10 : 20,
            overflow: 'hidden',
          }}
          onPress={
            item.subcategory && item.subcategory.length > 0
              ? () => {
                  handlePress(item);
                }
              : () => {
                  navigation.navigate('productOverView', {
                    context: 'categories',
                    catId: item.id,
                  });
                }
          }>
          <ImageView image={item.image} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: widthResponse ? 10 : 20,
              marginTop: widthResponse ? 10 : 20,
            }}>
            {item.name && item.name != '' && (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: appFont.bR,
                  fontSize: fontScalling(1.7),
                  color: appColor.Textlightblack,
                  flex: 1,
                  letterSpacing: 1,
                }}>
                {item.name}
              </Text>
            )}
            {item.subcategory && item.subcategory.length > 0 && (
              <Pressable
                style={{
                  borderRadius: 100,
                  padding: 1,
                  borderWidth: widthResponse ? 0.7 : 1,
                  borderColor: appColor.borderColor,
                }}
                onPress={() => {
                  handlePress(item);
                  // toggleSubArr(index);
                }}>
                <Animatable.View
                  animation={'zoomIn'}
                  isInteraction={true}
                  iterationCount={'infinite'}>
                  <Icon
                    ComponentName={'Entypo'}
                    name={'chevron-small-right'}
                    color={appColor.bgBlack}
                    size={widthResponse ? 20 : 25}
                  />
                </Animatable.View>
              </Pressable>
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {/* <AppHeaders title={'Menu'} /> */}
      <MainCard cartBg>
        {subcategories && subcategories.length > 0 && (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={column}
              scrollEnabled={true}
              data={subcategories}
              keyExtractor={(data, index) => index}
              contentContainerStyle={{
                //   paddingHorizontal: 10,
                paddingBottom: widthResponse ? 90 : 150,
              }}
              renderItem={({item, index}) => {
                //   print(item, 'item');
                return <MenuCard item={item} index={index} />;
              }}
              ItemSeparatorComponent={() => {
                return <View style={{paddingBottom: separator}} />;
              }}
            />
          </>
        )}
      </MainCard>
    </>
  );
};

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    ScrContainer: {
      height: widthResponse ? 100 : 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appColor.bgBlack,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomWidth: 5,
      borderColor: appColor.themeYellow,
    },
    card: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: widthResponse ? 20 : 25,
      paddingVertical: widthResponse ? 15 : 20,
      borderBottomWidth: 1,
      borderColor: appColor.lightGreyLine,
    },
    text: {
      marginLeft: 15,
      fontFamily: appFont.rM,
      fontSize: fontScalling(1.8),
      color: appColor.textBlack,
    },
    categoryText: {
      fontFamily: appFont.rR,
      width: scrnWidth - 230,
      // marginTop: widthResponse ? 15 : 20,
      fontSize: fontScalling(1.8),
      color: appColor.textBlack,
    },
  });
  return {styles};
};

export default SubcategoryScreen;
