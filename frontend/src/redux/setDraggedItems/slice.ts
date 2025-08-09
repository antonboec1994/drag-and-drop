import { createSlice } from '@reduxjs/toolkit';
import { setDraggedItemsStateType } from './types';
import {
	getBoxesUuidsFromLS,
	getDraggedBoxesFromLS,
} from '../../utils/LocalStorage/getLocalStorage';

const lsData = getDraggedBoxesFromLS();
const lsDataUuid = getBoxesUuidsFromLS();
const initialDraggedBoxes =
	lsData.length > 0
		? lsData
		: lsDataUuid.map((item: any) => ({
				id: item.uuId,
				items: [],
				flag: item.draggedBoxFlag,
				boxesInside: [],
		  }));

const initialState: setDraggedItemsStateType = {
	currentDraggedItem: null,
	posReadyToDrop: false,
	draggedBoxes: initialDraggedBoxes,
	endDragBoxesUuids: lsDataUuid,
	draggedBoxId: '',
	draggedBoxFlag: true,
	findIndex: 0,
	currentDraggedBoxIndex: 0,
	endDragAnimationClass: '',
	countDragAndDropBoxes: 4,
	isAlreadyCleared: false,
	isAnimated: false,
	endDragBoxesInside: [],
};

export const setDraggedItemsSlice = createSlice({
	name: 'dragged',
	initialState,
	reducers: {
		addDraggedItem(state, action) {
			const id = action.payload.draggedBoxId;
			const item = action.payload.item;
			const existingIndex = state.draggedBoxes.findIndex(
				(item: any) => item.id === id
			);
			if (existingIndex !== -1) {
				state.draggedBoxes[existingIndex].items.push(item);
			} else {
				state.draggedBoxes.push({
					id,
					items: [item],
					flag: true,
					boxesInside: [],
				});
			}
		},
		addEndDragBoxesUuids(state, action) {
			const { uuId, draggedBoxFlag } = action.payload;
			if (!state.endDragBoxesUuids.includes(uuId)) {
				state.endDragBoxesUuids.push({ uuId, draggedBoxFlag });
			}
		},
		addDraggedItemsRandom(state, action) {
			const newArray = action.payload;
			if (!state.isAlreadyCleared) {
				state.draggedBoxes = [];
				state.isAlreadyCleared = true;
				if (state.isAlreadyCleared) {
					for (let i = 0; i < state.countDragAndDropBoxes; i++) {
						const cur = state.endDragBoxesUuids[i];
						if (cur) {
							state.draggedBoxes.push({
								id: cur.uuId,
								items: [],
								flag: cur.draggedBoxFlag,
								boxesInside: [],
							});
						}
					}
					for (let j = 0; j < newArray.length; j++) {
						const currentItem = newArray[j];
						const randomIndex = Math.floor(
							Math.random() * state.countDragAndDropBoxes
						);
						if (state.draggedBoxes[randomIndex].flag === true) {
							state.draggedBoxes[randomIndex].items.push(currentItem);
						}
					}
				}
			}
		},
		deleteDraggedItem(state, action) {
			const id = action.payload.id;
			const item = action.payload.item;
			const targetBox = state.draggedBoxes.find((el: any) => el.id === id);
			if (targetBox) {
				targetBox.items = targetBox.items.filter(
					(el: any) => el.id !== item.id
				);
			}
		},
		resetDraggedItems(state) {
			state.draggedBoxes = state.endDragBoxesUuids.map((item: any) => ({
				id: item.uuId,
				items: [],
				flag: true,
				boxesInside: [],
			}));
			state.endDragBoxesUuids.forEach((uuidItem: any) => {
				uuidItem.draggedBoxFlag = true;
			});
		},
		setCurrDraggedItem(state, action) {
			state.currentDraggedItem = action.payload;
		},
		setPosReadyToDrop(state, action) {
			state.posReadyToDrop = action.payload;
		},
		addDraggedBox(state, action) {
			state.draggedBoxId = action.payload;
		},
		deleteDraggedBox(state, action) {
			console.log('action.payload	', action.payload);
			const cur = state.endDragBoxesUuids.find(
				(item: any) => item.uuId === action.payload
			);
			cur.draggedBoxFlag = false;
			state.draggedBoxes = state.draggedBoxes.filter(
				(box: any) => box.id !== action.payload
			);
		},
		setEndDragAnimationClass(state, action) {
			state.endDragAnimationClass = action.payload.class;
			state.currentDraggedBoxIndex = action.payload.index;
		},
		setIsAnimated(state, action) {
			state.isAnimated = action.payload;
		},
		setCountDragAndDropBoxes(state) {
			state.countDragAndDropBoxes = 10;
		},
		addEndDragBoxInside(state, action) {
			const selectedBoxId = action.payload.selectedBoxId;
			const destinationBoxId = action.payload.destinationBoxId;
			const selectedBox = state.draggedBoxes.find(
				(item: any) => item.id === selectedBoxId
			);
			const destinationBox = state.draggedBoxes.find(
				(item: any) => item.id === destinationBoxId
			);
			if (selectedBox && destinationBox) {
				// Проверяем, не находится ли уже selectedBox в boxesInside destinationBox
				const isBoxAlreadyInside = destinationBox.boxesInside.some(
					(box: any) => box.id === selectedBoxId
				);
				if (!isBoxAlreadyInside) {
					// Собираем все items из selectedBox и его boxesInside
					const allItemsFromSelectedBox = [
						...selectedBox.items,
						...selectedBox.boxesInside.flatMap(
							(boxInside: any) => boxInside.items
						),
					];
					destinationBox.boxesInside.push({
						id: selectedBoxId,
						items: allItemsFromSelectedBox, // Включаем все items из selectedBox и его boxesInside
					});
				}
				// Если нужно, сбрасываем flag у selectedBox
				const cur = state.endDragBoxesUuids.find(
					(item: any) => item.uuId === selectedBoxId
				);
				if (cur) {
					cur.draggedBoxFlag = false;
				}
			}
		},
		deleteEndDragBoxInside(state, action) {
			const parent = action.payload.parentBox;
			const child = action.payload.box;
			// Находим индекс родительского элемента
			const parentIndex = state.draggedBoxes.findIndex(
				(box: any) => box.id === parent.id
			);
			if (parentIndex !== -1) {
				// Находим родительский элемент
				const parentNode = state.draggedBoxes[parentIndex];
				// Удаляем дочерний элемент из boxesInside
				parentNode.boxesInside = parentNode.boxesInside.filter(
					(box: any) => box.id !== child.id
				);
				// Если у родителя нет items и boxesInside, сбрасываем draggedBoxFlag
				if (
					parentNode.boxesInside.length === 0 &&
					parentNode.items.length === 0
				) {
					const uuidItem = state.endDragBoxesUuids.find(
						(item: any) => item.uuId === parentNode.id
					);
					if (uuidItem) {
						uuidItem.draggedBoxFlag = false;
					}
				}
			}
		},
	},
});

export const {
	addDraggedItem,
	deleteDraggedItem,
	setCurrDraggedItem,
	setPosReadyToDrop,
	addDraggedBox,
	deleteDraggedBox,
	setEndDragAnimationClass,
	addDraggedItemsRandom,
	addEndDragBoxesUuids,
	resetDraggedItems,
	setIsAnimated,
	setCountDragAndDropBoxes,
	addEndDragBoxInside,
	deleteEndDragBoxInside,
} = setDraggedItemsSlice.actions;
export default setDraggedItemsSlice.reducer;
