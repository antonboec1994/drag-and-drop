import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import getItemsSlice from './getItems/slice';
import setDraggedItemsSlice from './setDraggedItems/slice';
import setUtilsSlice from './setUtils/slice';

export const store = configureStore({
	reducer: {
		items: getItemsSlice,
		dragged: setDraggedItemsSlice,
		utils: setUtilsSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
