import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  total: {
    subTotal: 0,
    taxAmount: 0,
    discount: {code: null, amount: null, percent: null},
    sgst: 0,
    cgst: 0,
    sgstPercent: 0,
    cgstPercent: 0,
    delfee: 0,
    totalamt: 0,
    amount_reduced: 0,
    reward_percentage: 0,
    reward_point: 0,
    points_redeemed: 0,
    pointsShown: 0,
    vesselPrice: 0,
    vesselName: '',
    kms: 0,
    totalProtein: '',
    totalCalories: '',
    totalCarbs: '',
    totalFats: '',
    totalMinerals: '',
    totalVitamins: '',
  },
  deleteModal: {isModal: false, item: {}},
  ifCoinApply: 0,
  coinHub: 0,
};

export const CartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    AddToCart: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({...action.payload, quantity: 1});
      }
    },
    removeFromCart: (state, action) => {
      const itemRemove = state.cart.filter(
        item => item.id !== action.payload.id,
      );
      state.cart = itemRemove;
    },
    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      itemPresent.quantity++;
      let subTotal = state.cart.reduce((sum, item) => sum + item.offer, 0);
      // console.log(subTotal, 'subtotal++');
    },
    dicrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      itemPresent.quantity--;
      let subTotal = state.cart.reduce((sum, item) => sum - item.offer, 0);
      // console.log(subTotal, 'subtotal--');
    },
    deleteWholeCart: (state, action) => {
      state.cart = [];
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setIfCoinApply: (state, action) => {
      state.ifCoinApply = action.payload;
    },
    setDeleteModal: (state, action) => {
      state.deleteModal = action.payload;
    },
    coinsCollector: (state, action) => {
      state.coinHub = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const {
  AddToCart,
  removeFromCart,
  incrementQuantity,
  dicrementQuantity,
  deleteWholeCart,
  setTotal,
  setIfCoinApply,
  coinsCollector,
  setDeleteModal,
  setCart,
} = CartSlice.actions;

export default CartSlice.reducer;
