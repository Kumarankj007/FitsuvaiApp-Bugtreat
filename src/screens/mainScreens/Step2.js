import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {appFont} from '../../utilities/appFont';
import appColors from '../../utilities/appColors';
import {url} from '../../utilities/appApi';
import {useDispatch} from 'react-redux';
import {setassesMentIds, setSummeryContent} from '../../redux/SummerySlice';
import {Icon} from '../../utilities/icon';
import InfoCard from '../../components/Card/InfoCard';

const Step2 = ({ind, handlePage, mealData}) => {
  const appColor = appColors();
  const [activeCard, setActiveCard] = useState('string');
  const dispatch = useDispatch();
  const container = 20; //@@
  const gap = widthResponse ? 10 : 15; //@@

  return (
    <View
      style={{
        flex: 1, //@@
        width: '100%',
        // paddingBottom: (scrnHeight * 1.13) / (widthResponse ? 2 : 2.3), //@@
        paddingHorizontal: container,
      }}>
      {mealData && mealData.length > 0 && (
        <FlatList
          numColumns={2}
          data={mealData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: (scrnHeight * 1.13) / (widthResponse ? 2.1 : 2.3),
          }} //@@
          nestedScrollEnabled={true}
          ItemSeparatorComponent={() => {
            return <View style={{marginBottom: gap}} />; //@@
          }}
          renderItem={({item, index}) => {
            const active = index == activeCard;
            return (
              <>
                <InfoCard
                  item={item}
                  active={active}
                  index={index}
                  onPress={() => {
                    dispatch(setassesMentIds({yourMealId: item.id}));
                    dispatch(setSummeryContent({yourMeal: item.name}));
                    setActiveCard(index);
                    handlePage(2);
                  }}
                />
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default Step2;

const styles = StyleSheet.create({});
