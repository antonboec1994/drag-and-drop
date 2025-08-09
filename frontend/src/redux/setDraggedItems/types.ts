import { ListType } from '../getItems/types';

export interface setDraggedItemsStateType {
	currentDraggedItem: ListType | null;
	posReadyToDrop: boolean;
	draggedBoxes: any;
	draggedBoxId: string;
	findIndex: any;
	currentDraggedBoxIndex: number;
	endDragAnimationClass: string;
	endDragBoxesUuids: any;
	isAlreadyCleared: boolean;
	isAnimated: boolean;
	countDragAndDropBoxes: number;
	draggedBoxFlag: any;
	endDragBoxesInside: any;
}
