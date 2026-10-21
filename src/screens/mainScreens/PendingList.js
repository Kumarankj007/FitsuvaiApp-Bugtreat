import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {Icon} from '../../utilities/icon';
import {
  fontScalling,
  scrnWidth,
  scrnHeight,
  widthResponse,
} from '../../utilities/helperFunction';
import ReviewCard from '../../components/Card/ReviewCard';

export default function PendingList({
  data,
  load,
  deleteFn,
  pullRefresh,
  refresh,
}) {
  const appColor = appColors();
  const renderItem = ({item, index}) => {
    return (
      <>
        <ReviewCard data={item} edit deleteFn={deleteFn} />
      </>
    );
  };

  return (
    <>
      {load ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: scrnHeight - 200,
          }}>
          <ActivityIndicator size={'large'} color={appColor.gold} />
        </View>
      ) : (
        <View style={{width: '100%'}}>
          {data.length > 0 ? (
            <View
              style={{
                padding: 5,
                paddingTop: 15,
                backgroundColor: appColors.cartBg,
              }}>
              <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 95 : 140,
                }}
                keyExtractor={(data, index) => index}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={pullRefresh}
                    colors={[appColor.themeYellow]}
                    tintColor={appColor.themeYellow}
                  />
                }
              />
            </View>
          ) : (
            !load && (
              <>
                {/* //@@ */}
                <View style={{height: '100%', justifyContent: 'center'}}>
                  <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={pullRefresh}
                      colors={[appColor.themeYellow]}
                      tintColor={appColor.themeYellow}
                    />
                  }
                    contentContainerStyle={{
                      // flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 15,
                      paddingVertical: 35,
                      backgroundColor: appColor.cardbg,
                      borderRadius: 15,
                    }}>
                    <View
                      style={{
                        backgroundColor: appColor.themeYellow,
                        borderRadius: 50,
                        width: 80,
                        height: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 5,
                      }}>
                      <Icon
                        ComponentName={'Foundation'}
                        name={'clipboard-pencil'}
                        color={appColor.white}
                        size={40}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: appFont.bB,
                        color: appColor.textBlack,
                        fontSize: fontScalling(3),
                        paddingTop: 15,
                        paddingBottom: 10,
                      }}>
                      No Pending Reviews
                    </Text>
                    <Text
                      style={{
                        fontFamily: appFont.rM,
                        color: appColor.textBlack,
                      }}>
                      You have no products to review right now
                    </Text>
                  </ScrollView>
                </View>
              </>
            )
          )}
        </View>
      )}
    </>
  );
}
