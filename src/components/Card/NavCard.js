import React, {useState} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {Icon} from '../../utilities/icon';
import {fontScalling, widthResponse} from '../../utilities/helperFunction';

const NavCard = ({icon, title, onpress, iconName, cardbg, deletePage}) => {
  //@@
  const appColor = appColors();
  const {styles} = useStyle();
  const [active, setActive] = useState(false);
  return (
    <Pressable
      style={[
        styles.card,
        {
          paddingHorizontal: 10,
          shadowOffset: {height: 1},
          shadowOpacity: active ? 0 : 0.2,
          shadowRadius: 2,
          backgroundColor: cardbg
            ? active
              ? appColor.white
              : appColor.cardbg
            : appColor.white,
          borderRadius: cardbg ? 10 : null,
          marginBottom: cardbg ? 15 : null,
          paddingRight: cardbg ? 5 : null,
          borderWidth: cardbg ? 1 : null,
          borderColor: cardbg
            ? active
              ? appColor.themeYellow
              : 'transparent'
            : 'transparent',
        },
      ]}
      onPress={onpress}
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon
          ComponentName={icon}
          name={iconName}
          color={!active ? appColor.themeYellow : appColor.black}
          size={widthResponse ? 20 : 30} //@@
        />
        <Text
          style={[
            styles.title,
            {
              color: active ? appColor.themeYellow : appColor.Textlightblack,
              fontFamily: deletePage ? appFont.rM : appFont.bB, //@@
            },
          ]}>
          {title}
        </Text>
        <MaterialCommunityIcon
          name="chevron-right"
          size={widthResponse ? 25 : 35} //@@
          color={active ? appColor.themeYellow : appColor.black}
        />
      </View>
    </Pressable>
  );
};

export default NavCard;

const useStyle = () => {
  const appColor = appColors();

  const styles = StyleSheet.create({
    card: {
      paddingVertical: widthResponse ? 10 : 15, //@@
    },
    title: {
      flex: 1,
      paddingLeft: 10,
      fontSize: fontScalling(2.1),
    },
    title1: {
      color: appColors.Text,
      fontFamily: appFont.bB,
      fontSize: fontScalling(2.1),
      flex: 1,
      paddingLeft: 10,
    },
  });
  return {styles};
};
