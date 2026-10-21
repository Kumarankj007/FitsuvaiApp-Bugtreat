import {StyleSheet, View, Dimensions, Animated, Text} from 'react-native';
import React from 'react';
import spinner from './Spinner';
import {scrnWidth} from '../../utilities/helperFunction';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('screen');

const BallWithSpin = ({
  style = {},
  imgSrc = null,
  imgStyle = {},
  duration,
  containerStyle = {},
  localImg = false,
}) => {
  const spin = spinner('clock', duration);
  const antiSpin = spinner('anti', duration);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          {transform: [{rotate: spin}], width: '100%', height: '100%'},
          style,
        ]}>
        {imgSrc != null && (
          <FastImage
            resizeMode={'contain'}
            source={!localImg ? imgSrc : {uri: imgSrc, priority: FastImage.priority.high,}}
            style={[imgStyle]}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default BallWithSpin;

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
