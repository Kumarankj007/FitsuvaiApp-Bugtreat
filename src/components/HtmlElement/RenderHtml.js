import {View, Text} from 'react-native';
import React from 'react';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
// import Videos from 'react-native-video';
import appColors from '../../utilities/appColors';
import {appFont} from '../../utilities/appFont';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../utilities/helperFunction';

export default function HtmlView({
  url,
  uri,
  padding = 0,
  width,
  whiteText,
  ElementStyle = {},
}) {
  const appColor = appColors();
  const customHTMLElementModels = {
    html: HTMLElementModel.fromCustomModel({
      tagName: 'html',
      contentModel: HTMLContentModel.mixed,
    }),
    link: HTMLElementModel.fromCustomModel({
      tagName: 'link',
      contentModel: HTMLContentModel.mixed,
    }),
    font: HTMLElementModel.fromCustomModel({
      tagName: 'font',
      contentModel: HTMLContentModel.mixed,
    }),
    embed: HTMLElementModel.fromCustomModel({
      tagName: 'embed',
      contentModel: HTMLContentModel.mixed,
    }),
    ul: HTMLElementModel.fromCustomModel({
      tagName: 'ul',
      contentModel: HTMLContentModel.mixed,
    }),
    iframe: iframeModel,
    table: tableModel,
    webViewProps: {
      allowsFullScreen: true,
      androidLayerType: 'software',
      allowsFullscreenVideo: true,
      scalesPageToFit: true,
      textSelectable: true,
    },
    // video: HTMLElementModel.fromCustomModel({
    //   tagName: 'video',
    //   contentModel: HTMLContentModel.block,
    //   isVoid: false,
    // }),
  };

  const renderers = {
    iframe: IframeRenderer,
    table: TableRenderer,
    // video: ({TDefaultRenderer, ...props}) => {
    //   return <Videos source={{uri: props.tnode.init.domNode.attribs.src}} />;
    // },
  };
  const htmlContent = `
          <html>
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
                    margin:0
                }
                      table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                }
                th, td {
                  border: 1px solid #000;
                  text-align: center;
                  color:#000;
                }
                th {
                  background-color: #fff;
                  font-weight: bold;
                }
                ul {
                  list-style-type: none;
                }
              </style>
            </head>
            <body>
              ${url}
            </body>
          </html>`;
  return (
    <View>
      <RenderHTML
        renderers={renderers}
        defaultTextProps={{allowFontScaling: false}}
        source={{html: `${url}`, uri: uri}}
        contentWidth={scrnWidth}
        tagsStyles={{
          body: {
            whiteSpace: 'normal',
            color: whiteText ? appColor.textWhite : appColor.textBlack,
            font: appFont.rM,
            // lineHeight: fontScalling(2.2),
            width: width ? width : scrnWidth - padding,
            // overflow: 'hidden',
            fontSize: fontScalling(1.8),
          },
          h6: {
            color: whiteText ? appColor.white : appColor.textBlack,
            width: '100%',
            alignSelf: 'center',
            fontSize: fontScalling(1.8),
          },
          p: {
            color: whiteText ? appColor.white : appColor.textBlack,
            width: '100%',
            alignSelf: 'center',
            fontSize: fontScalling(1.8),
          },
          iframe: {
            alignSelf: 'center',
            opacity: 0.99,
          },
          // video: {
          //   width: '100%',
          //   alignSelf: 'center',
          //   height: scrnWidth / 1.8,
          // },
          table: {
            alignSelf: 'center',
            width: '100%',
          },
          ...ElementStyle,
        }}
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              allowsFullScreen: true,
              androidLayerType: 'software',
              textSelectable: true,
            },
          },
        }}
        customHTMLElementModels={customHTMLElementModels}
        WebView={WebView}
      />
    </View>
  );
}
