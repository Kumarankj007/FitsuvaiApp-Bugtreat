import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Pdf from 'react-native-pdf';
import {
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {setTermsPage} from '../../redux/titleSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  addListener,
  disableSecureView,
  enabled,
  enableSecureView,
} from 'react-native-screenshot-prevent';
import {useShowToast} from '../../components/Toast/ToastAlert';

const MenuScreen = ({route, navigation}) => {
  const {styles} = useStyle();
  const showToast = useShowToast();
  const source = {
    uri: route.params.menuPdf,
    cache: true,
  };
  const scrnShot = route?.params?.scrnShot == false ? route?.params?.scrnShot : true;

  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  
  // handle bottomtab
  useEffect(() => {
    if (isFocus) {
      dispatch(setTermsPage(true));
    } else if (!isFocus) {
      dispatch(setTermsPage(false));
    }
  }, [isFocus]);

  // handle scrnShot:
  useEffect(() => {
    if (isFocus && !scrnShot) {
      // disable Screenshot
      enabled(true);
      enableSecureView();
      const subscription = addListener(() => {
        console.log('Screenshot taken');
        showToast(
          'info',
          '',
          'You have taken a screenshot of the app. This is prohibited due to security reasons.',
          2000,
        );
      });
      return () => {
        subscription.remove();
      };
    } else if (!isFocus) {
      // enable Screenshot
      enabled(false);
      disableSecureView();
    }
  }, [isFocus]);

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={source}
        showsVerticalScrollIndicator={false}
        onLoadComplete={(numberOfPages, filePath) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
          navigation.goBack();
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default MenuScreen;

const useStyle = () => {
  const safeArea = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pdf: {
      width: scrnWidth - (widthResponse ? 20 : 10),
      height: '100%',
    },
  });
  return {styles};
};
