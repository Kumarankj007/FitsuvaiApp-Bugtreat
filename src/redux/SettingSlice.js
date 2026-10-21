import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {url} from '../utilities/appApi';
import {print} from '../utilities/helperFunction';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

export const userSettingApi = createAsyncThunk(
  'userSettingApi',
  async (data = '', {getState}) => {
    // print(data, 'data')
    try {
      const state = getState();
      // request data for backend:
      var myHeaders = new Headers();
      const formData = new FormData();
      formData.append('device_id', await DeviceInfo.getUniqueId());
      if (data && data != '') {
        if (data && data?.street != '') {
          formData.append('street', data?.street);
        }
        if (data && data?.city != '') {
          formData.append('city', data?.city);
        }
        if (data && data?.state != '') {
          formData.append('state', data?.state);
        }
        if (data && data?.pincode != '') {
          formData.append('pincode', data?.pincode);
        }
      }
      if (
        state?.auth?.profileData?.userId != '' &&
        state?.auth?.profileData?.userId != null &&
        state?.auth?.userType != 'guest'
      ) {
        formData.append('userId', state?.auth?.profileData?.userId);
      }
      formData.append('platform', Platform.OS);
      if (state?.setting?.fcmToken != '') {
        formData.append('fcm_token', state?.setting?.fcmToken);
      }
      var requestOptions = {
        method: 'POST',
        body: state?.auth?.profileData?.userId ? formData : null,
      };
      print(state?.auth?.profileData?.userId, 'userId');
      // get the response:
      const response = await fetch(url().userSettings, requestOptions);
      if (response.status == 200) {
        // console.log(response.status, 'response.status')
        const resparse = await response.json();
        if (resparse.status == 'success') {
          return resparse.data;
        }
      } else {
        print(response.status, 'status in userSettings');
      }
    } catch (e) {
      console.log(e, 'status in userSetting');
    }
  },
);

export const ContentApi = createAsyncThunk(
  'ContentApi',
  async (_, {getState}) => {
    try {
      // const state = getState();

      // request data for backend:
      var myHeaders = new Headers();
      var requestOptions = {
        method: 'POST',
      };
      // get the response:
      const response = await fetch(url().content, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          return resparse.data;
        }
      } else {
        print(response.status, 'status in ContentApi');
      }
    } catch (e) {
      console.log(e, 'status in ContentApi');
    }
  },
);

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    position: 'center',
    userSettings: {},
    userSettingLoad: false,
    locationGranted: false,
    notifeeTrigger: 0,
    orderTrigger: 0,
    fcmToken: '',
    stateName: 'Tamil Nadu',
    adminLocation: {latitude: '', longitude: ''},
    assesmentRoute: false,
    vegToggle: false,
    bottomTabPress: 0,
    // selectedTime: new Date(),
    AppContents: {},
    appContentLoad: false,
    voiceText: [],
    storeAddress: {
      flat: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      stored: false,
    },
  },
  reducers: {
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setUserSetting: (state, action) => {
      state.userSettings = action.payload;
    },
    setNotifeeTrigger: (state, action) => {
      state.notifeeTrigger = action.payload;
    },
    setOrderTrigger: (state, action) => {
      state.orderTrigger = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setAdminLocation: (state, action) => {
      state.adminLocation = action.payload;
    },
    setStateName: (state, action) => {
      state.stateName = action.payload;
    },
    setLocationGranted: (state, action) => {
      state.locationGranted = action.payload;
    },
    setAssesmentRoute: (state, action) => {
      state.assesmentRoute = action.payload;
    },
    setVegToggle: (state, action) => {
      state.vegToggle = action.payload;
    },
    setBottomTabPress: (state, action) => {
      state.bottomTabPress = action.payload;
    },
    // setSelectedTime: (state, action) => {
    //   state.selectedTime = action.payload;
    // },
    setAppContent: (state, action) => {
      state.AppContents = action.payload;
    },
    setVoicetext: (state, action) => {
      state.voiceText = action.payload;
    },
    setStoreAddress: (state, action) => {
      state.storeAddress = action.payload;
    },
  },

  // userSetting API
  extraReducers: builder => {
    builder.addCase(userSettingApi.fulfilled, (state, action) => {
      // print(action.payload, 'userSetting');
      state.userSettings = action.payload;
      state.userSettingLoad = false;
    });
    builder.addCase(userSettingApi.pending, (state, action) => {
      state.userSettings = {};
      if (Object.keys(state.userSettings).length == 0) {
        state.userSettingLoad = true;
      }
    });
    builder.addCase(userSettingApi.rejected, (state, action) => {
      state.userSettings = {};
      if (Object.keys(state.userSettings).length == 0) {
        state.userSettingLoad = true;
      }
    });

    // Content API
    builder.addCase(ContentApi.fulfilled, (state, action) => {
      state.AppContents = action.payload;
      state.appContentLoad = false;
    });
    builder.addCase(ContentApi.pending, (state, action) => {
      state.AppContents = {};
      if (Object.keys(state.AppContents).length == 0) {
        state.appContentLoad = true;
      }
    });
    builder.addCase(ContentApi.rejected, (state, action) => {
      state.AppContents = {};
      if (Object.keys(state.AppContents).length == 0) {
        state.appContentLoad = true;
      }
    });
  },
});

export const {
  setPosition,
  setUserSetting,
  setNotifeeTrigger,
  setOrderTrigger,
  setFcmToken,
  setAdminLocation,
  setStateName,
  setLocationGranted,
  setAssesmentRoute,
  setVegToggle,
  setBottomTabPress,
  // setSelectedTime,
  setAppContent,
  setVoicetext,
  setStoreAddress,
} = settingSlice.actions;
export default settingSlice.reducer;
