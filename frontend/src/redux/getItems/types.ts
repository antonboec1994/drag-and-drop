export type ListType = {
	id: number;
	content: string;
};

export interface getItemsStateType {
	items: ListType[];
	status: Status;
}

export const Status = {
	LOADING: 'loading',
	SUCCESS: 'success',
	ERROR: 'error',
} as const;

export type Status = (typeof Status)[keyof typeof Status];
