// import react from 'react';
// import {View, Text} from 'react-native';

// const AutoHeightWebView = () => {
//   return (
//     <View>
//       <Text>gfcxfcgh</Text>
//     </View>
//   );
// };

// export default AutoHeightWebView;
import {StyleSheet, Text, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import React from 'react';
import {scrnWidth} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';
import {scrnHeight} from '../../../src_old/utilities/helperFunction';

const AutoHeightHTML = ({url}) => {
  const htmlContent = 
  `<html>
      <head>
        <style>
          @font-face {
            font-family: 'MyCustomFont';
            src: url('https://app.smart-golf.eu/assets/fonts/Roboto-regular.ttf') format('truetype');
          }
          body {
            font-family: 'MyCustomFont', sans-serif;
            font-size:17px;
            padding-top: 0px;
            padding-right: 15px;
            padding-bottom: 0px;
            padding-left: 15px;
            text-align: left;
            }
            *{
            color:${appColors().bgBlack};
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            color:#000;
          }
          th {
            background-color: #fff;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${url}
      </body>
    </html>`;

  return (
    <AutoHeightWebView
      style={{
        width: scrnWidth - 40,
        padding: 10,
      }}
      scrollEnabled={false}
      onSizeUpdated={size => {}}
      files={[
        {
          href: 'cssfileaddress',
          type: 'text/css',
          rel: 'stylesheet',
        },
      ]}
      source={{
        html: htmlContent,
      }}
      scalesPageToFit={false}
      viewportContent={
        'width=device-width,height=device-height, user-scalable=no'
      }
    />
  );
};

export default AutoHeightHTML;

const styles = StyleSheet.create({});
