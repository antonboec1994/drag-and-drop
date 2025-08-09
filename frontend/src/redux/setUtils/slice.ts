import { createSlice } from '@reduxjs/toolkit';
import { setUtilsSliceType } from './types';
import { getProportionFromLS } from '../../utils/LocalStorage/getLocalStorage';

const lsData = getProportionFromLS();

const initialState: setUtilsSliceType = {
	proportion: lsData ? lsData : 1,
	proportionSplit: '',
	countToShow: 8,
	resetRef: false,
	wrapperSize: {},
	wrapperClass: '',
	endDragCoordinates: [],
	wrapperAnimation: false,
};

export const setUtilsSlice = createSlice({
	name: 'utils',
	initialState,
	reducers: {
		setProportion(state) {
			const proportionString = state.proportion.toString();
			state.proportionSplit = proportionString.replaceAll('.', '');
		},
		resetProportion(state) {
			state.proportion = 1;
		},
		changeProportion(state, action) {
			state.proportion = action.payload;
			const proportionString = state.proportion.toString();
			state.proportionSplit = proportionString.replaceAll('.', '');
		},
		setCountToShow(state, action) {
			state.countToShow = action.payload;
		},
		setResetRef(state, action) {
			state.resetRef = action.payload;
		},
		setCoordinates(state, action) {
			const uuId = action.payload.uuId;
			const left = action.payload.coordinates.left;
			const top = action.payload.coordinates.top;
			state.endDragCoordinates.push({
				id: uuId,
				left: left,
				top: top,
			});
		},
		getWrapperSize(state, action) {
			state.wrapperSize = action.payload;
		},
		setWrapperClass(state, action) {
			state.wrapperClass = action.payload;
		},
		setWrapperAnimation(state, action) {
			state.wrapperAnimation = action.payload;
		},
	},
});

export const {
	setProportion,
	resetProportion,
	changeProportion,
	setCountToShow,
	setResetRef,
	setCoordinates,
	getWrapperSize,
	setWrapperClass,
	setWrapperAnimation,
} = setUtilsSlice.actions;
export default setUtilsSlice.reducer;
