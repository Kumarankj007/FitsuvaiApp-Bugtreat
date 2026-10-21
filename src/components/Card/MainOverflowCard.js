import {View, Text, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {scrnWidth, widthResponse} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';

// Note : To render the overflow content must give these style:
// {
//   left: 15 + paddingLeft,
//   width: scrnWidth,
// }

const MainOverflowCard = ({
  altStyle,
  children,
  borderRadius = 50,
  refresh = false,
  onRefresh = () => {},
  productId = false,
}) => {
  const appColor = appColors();
  const scrollRef = useRef(null);

  // product detail click to animation to get current product:
  useEffect(() => {
    if (productId) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
        duration: 900,
      });
    }
  }, [productId]);

  return (
    <View
      style={{
        flex: 1,
        zIndex: 1,
        position: 'relative',
        backgroundColor: 'white',
      }}>
      {/* curve stucture */}
      <View
        style={{
          width: '100%',
          height: 60,
          borderTopRightRadius: borderRadius,
          borderTopLeftRadius: borderRadius,
          borderWidth: 15,
          borderTopWidth: 15,
          borderBottomWidth: 0,
          position: 'absolute',
          top: -10,
          zIndex: 100,
          backgroundColor: 'transparent',
        }}></View>
      {/* scroll view */}
      <View style={{width: scrnWidth}}>
        {/* side black */}
        <View
          style={{
            height: 50,
            width: 15,
            zIndex: 20,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'black',
          }}></View>
        <ScrollView
          stickyHeaderIndices={[0, 2]}
          ref={scrollRef}
          refreshControl={
            // refresh && (
            // )
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[appColor.themeYellow]}
              tintColor={appColor.themeYellow}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{marginTop: -10, zIndex: 10}}
          contentContainerStyle={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingBottom: widthResponse ? 90 : 130,
          }}>
          {/* side black */}
          <View
            style={{
              height: 50,
              width: 15,
              zIndex: 2,
            }}></View>
          {/* content View */}
          <View
            style={[
              {
                flex: 1,
                zIndex: 0,
                paddingHorizontal: 8,
                paddingTop: 15,
              },
              altStyle,
            ]}>
            {children}
          </View>

          {/* side black */}
          <View
            style={{
              zIndex: 2,
              height: 50,
              width: 15,
            }}></View>
        </ScrollView>
        {/* side black */}
        <View
          style={{
            zIndex: 20,
            height: 50,
            width: 15,
            backgroundColor: 'black',
            position: 'absolute',
            top: 0,
            right: 0,
          }}></View>
      </View>
    </View>
  );
};

export default MainOverflowCard;
