import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getItemsStateType, Status } from './types';
import { getInitialItemsFromLS } from '../../utils/LocalStorage/getLocalStorage';
import { apiClient } from '../../api/intex';

export const fetchList = createAsyncThunk('list/fetchListStatus', async () => {
	const url = `/list`;
	const { data, headers } = await apiClient.get(url);

	const headersCount = headers['x-total-count'];
	return { data, headersCount };
});

const lsData = getInitialItemsFromLS();

const initialState: getItemsStateType = {
	items: lsData,
	status: Status.LOADING,
};

export const getItemsSlice = createSlice({
	name: 'items',
	initialState,
	reducers: {
		getItems(state, action) {
			state.items = action.payload;
		},
		addItem(state, action) {
			state.items.push(action.payload);
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchList.pending, state => {
			state.items = [];
			state.status = Status.LOADING;
		});
		builder.addCase(fetchList.fulfilled, (state, action) => {
			state.items = action.payload.data;
			state.status = Status.SUCCESS;
		});
		builder.addCase(fetchList.rejected, state => {
			state.items = [];
			state.status = Status.ERROR;
			console.error('Ошибка загрузки данных');
		});
	},
});

export const { getItems, addItem } = getItemsSlice.actions;
export default getItemsSlice.reducer;
