import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as Progress from 'react-native-progress';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import Carousel from 'react-native-reanimated-carousel';
import MainCard from '../../components/Card/MainCard';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import StepHeading from '../../components/Card/StepHeading';
import {useDispatch, useSelector} from 'react-redux';
import {setPosition} from '../../redux/SettingSlice';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setassesMentIds, setStepsIndex} from '../../redux/SummerySlice';
import {url} from '../../utilities/appApi';
import {appFont} from '../../utilities/appFont';
import AppHeaders from '../../components/Headers/AppHeaders';
import FastImage from 'react-native-fast-image';

const Assesments = ({route}) => {
  const [progressvalue, setProgressValue] = useState(0.25);
  const [heading, setHeading] = useState('Your Goals');
  const [pageIndex, setPageIndex] = useState(0);
  const [assesData, setAssesMent] = useState({});
  const [assTitle, setAssesMentTitle] = useState('');
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFocus = useIsFocused();

  const [pageSwipe, setPageSwipe] = useState(true);

  const appColor = appColors();
  const carosalRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const assId = route?.params?.id ? route?.params?.id : '';

  const assesmentContent = [
    {
      img: require('../../../assets/images/hwk5.png'),
      content1: 'Personal',
      content2: 'Trainer',
    },
    {
      img: require('../../../assets/images/hwk1.png'),
      content1: 'Personal',
      content2: 'Nutritionist',
    },
    {
      img: require('../../../assets/images/hwk2.png'),
      content1: 'tasty',
      content2: 'meals',
    },
    {
      img: require('../../../assets/images/hwk3.png'),
      content1: 'Weekly ',
      content2: 'Health Checks',
    },
    {
      img: require('../../../assets/images/delivery-man-hov.png'),
      content1: 'Doorstep',
      content2: 'Delivery',
    },
  ];

  //CarosalPage Spec
  const baseOptions = {
    vertical: false,
    width: scrnWidth,
    height: scrnHeight,
  };

  const {stepsIndex, assesMentIds, summeryContent, triggerEdit} = useSelector(
    state => state.summary,
  );

  // page ScrollAnimation
  const goToPage = index => {
    if (carosalRef.current && carosalRef.current.scrollTo) {
      carosalRef.current.scrollTo({index, animated: true});
    }
  };

  // stepIndex Updation
  useEffect(() => {
    dispatch(setStepsIndex(0));
  }, []);

  const onProgressChange = (_, absoluteProgress) => {
    const newIndex = Math.trunc(absoluteProgress);
    if (
      (pageIndex == 0 &&
        String(summeryContent[1].age)?.length > 0 &&
        String(summeryContent[2].height)?.length > 0 &&
        String(summeryContent[3].height)?.length > 0 &&
        String(summeryContent[10].activity)?.length > 0) ||
      (pageIndex == 1 &&
        assesMentIds[1]?.yourMealId &&
        String(assesMentIds[1]?.yourMealId)?.length > 0) ||
      (pageIndex == 2 &&
        assesMentIds[2]?.yourGoalId &&
        String(assesMentIds[2]?.yourGoalId)?.length > 0) ||
      pageIndex == 3
    ) {
      setPageIndex(newIndex);
    } else if (absoluteProgress < pageIndex) {
      setPageIndex(pageIndex - 1);
    } else {
      carosalRef.current?.scrollTo({index: pageIndex});
    }
    // if (pageIndex == 0) {
    //   if (
    //     String(summeryContent[1].age)?.length > 0 &&
    //     String(summeryContent[2].height)?.length > 0 &&
    //     String(summeryContent[3].height)?.length > 0
    //   ) {
    //     setPageIndex(newIndex);
    //   } else {
    //     carosalRef.current?.scrollTo({index: pageIndex});
    //   }
    // } else if (pageIndex == 1) {
    //   if (
    //     assesMentIds[1]?.yourMealId &&
    //     String(assesMentIds[1]?.yourMealId)?.length > 0
    //   ) {
    //     setPageIndex(newIndex);
    //   } else if (absoluteProgress < pageIndex) {
    //     setPageIndex(pageIndex - 1);
    //   } else {
    //     carosalRef.current?.scrollTo({index: pageIndex});
    //   }
    // } else if (pageIndex == 2) {
    //   if (
    //     assesMentIds[2]?.yourGoalId &&
    //     String(assesMentIds[2]?.yourGoalId)?.length > 0
    //   ) {
    //     setPageIndex(newIndex);
    //   } else if (absoluteProgress < pageIndex) {
    //     setPageIndex(pageIndex - 1);
    //   } else {
    //     carosalRef.current?.scrollTo({index: pageIndex});
    //   }
    // }
  };

  // useEffect(() => {
  //   goToPage(stepsIndex);
  // }, [stepsIndex]);

  useEffect(() => {
    goToPage(stepsIndex);
    setPageIndex(stepsIndex);
  }, [stepsIndex, triggerEdit]);

  // click to back press previous step:
  // console.log(pageIndex, 'pageIndex');
  useEffect(() => {
    if (isFocus) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          backPress();
        },
      );
      return () => backHandler.remove();
    }
  }, [pageIndex, isFocus]);

  // changes
  const backPress = () => {
    if (pageIndex != 0) {
      goToPage(pageIndex - 1);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Dashboard', {screen: 'home'});
      }
    }
    return true;
  };

  // api
  const apiCall = async () => {
    try {
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('context', 'plan');
      if (route.params.id) {
        formData.append('assessment', route.params.id);
      }
      var requestOptions = {
        method: 'POST',
        body: formData,
      };

      // loading enable:
      if (Object.keys(assesData).length == 0) {
        setLoad(true);
      }
      if (route?.params?.assName) {
        setAssesMentTitle(route?.params?.assName);
      }
      // get the response:
      const response = await fetch(url().assesment, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, 'data')
          setAssesMent(resparse.data);
          dispatch(setassesMentIds({assessmentId: 5}));
          dispatch(setassesMentIds({yourMealId: ''}));
          dispatch(setassesMentIds({yourGoalId: ''}));
        }
      } else {
        print(response.status, 'status in assesmentScreen');
      }
      setLoad(false);
      setRefresh(false);
    } catch (e) {
      console.log(e, 'error in assesmentScreen');
      setRefresh(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (assId != '') {
      apiCall();
    }
  }, [assId]);

  // HeadingUpdate
  useEffect(() => {
    if (assesMentIds) {
      switch (pageIndex) {
        case 0: {
          setHeading('bmi calculator');
          break;
        }
        case 1: {
          setHeading('your meal');
          break;
        }
        case 2: {
          setHeading('your goals');
          break;
        }
        case 3: {
          setHeading('plan preferences');
          break;
        }
      }
    }
  }, [pageIndex]);

  // render page based on Condition
  const renderItem = ({item, index}) => {
    switch (index) {
      case 0: {
        return <Step1 handlePage={goToPage} />;
      }
      case 1: {
        return (
          <Step2
            handlePage={goToPage}
            mealData={assesData['food_preferences']}
          />
        );
      }
      case 2: {
        return (
          <Step3
            ind={index}
            handlePage={goToPage}
            goalData={assesData['goals']}
          />
        );
      }
      case 3: {
        return <Step4 handlePage={goToPage} />;
      }
    }
  };

  const AssTopCard = ({data}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginRight: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          resizeMode="contain"
          style={{width: 35, height: 35}}
          source={data.img}
        />
        <View style={{alignItems: 'flex-start', paddingHorizontal: 10}}>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(1.8),
              paddingBottom: 3,
              color: appColor.bgBlack,
            }}>
            {data.content1}
          </Text>
          <Text
            style={{
              fontFamily: appFont.bB,
              fontSize: fontScalling(1.8),
              color: appColor.gold,
            }}>
            {data.content2}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <AppHeaders
        title={'START YOUR MEAL'}
        backIconFn={() => backPress()}
        toggleDisable={false}
      />
      <MainCard>
        {load ? (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <ActivityIndicator color={appColor.gold} size={'large'} />
          </View>
        ) : (
          <View
            style={{
              height: '100%', //@@
            }}>
            <View style={{paddingVertical: 10, alignSelf: 'center'}}>
              {assTitle && assTitle != '' && (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: appFont.bB,
                    color: appColor.bgBlack,
                    // paddingBottom: 15,
                    fontSize: fontScalling(3),
                  }}>
                  {assTitle}
                </Text>
              )}
              <Text
                style={{
                  fontFamily: appFont.bB,
                  color: appColor.textGrey,
                  fontSize: fontScalling(2.2),
                  paddingTop: 8,
                  textAlign: 'center',
                }}>
                Welcome to Fitsuvai's Personalized Food Experience
              </Text>
              <View
                style={{
                  height: scrnHeight / 11.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}
                  horizontal={true}
                  data={assesmentContent}
                  renderItem={({item, index}) => {
                    return <AssTopCard key={index} data={item} />;
                  }}
                  keyExtractor={(item, index) => index}
                  ItemSeparatorComponent={() => {
                    return (
                      <View
                        style={{
                          borderRightWidth: 0.6,
                          borderColor: appColor.borderColor,
                          marginVertical: 10,
                          marginRight: 15,
                        }}
                      />
                    );
                  }}
                />
              </View>
              <Progress.Bar
                progress={progressvalue}
                width={scrnWidth - 70}
                height={9}
                borderRadius={10}
                borderColor={appColor.white}
                color={appColor.gold}
                unfilledColor={appColor.sliderGreyBg}
              />
            </View>
            <View
              style={{
                flex: 1, //@@
                // paddingTop: 5,
              }}>
              <StepHeading
                title={heading}
                btnInActive={
                  !(summeryContent && summeryContent[4].bmi.length > 0)
                }
                onPress={() => {
                  dispatch(setPosition('right'));
                  navigation.getParent().openDrawer();
                }}
              />
              <Carousel
                {...baseOptions}
                loop={false}
                ref={carosalRef}
                style={{
                  flex: 1, //@@
                  alignSelf: 'center',
                }}
                autoPlay={false}
                data={[1, 2, 3, 4]}
                pagingEnabled={true}
                snapEnabled={false}
                onProgressChange={onProgressChange}
                onSnapToItem={index => {
                  // setPageIndex(index);
                  setProgressValue(0.25 * (index + 1));
                }}
                enabled={pageSwipe}
                renderItem={renderItem}
              />
            </View>
          </View>
        )}
      </MainCard>
    </>
  );
};

export default Assesments;

const styles = StyleSheet.create({});
