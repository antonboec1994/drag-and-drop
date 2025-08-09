export const getDraggedBoxesFromLS = () => {
	const lsData = localStorage.getItem('draggedBoxes');
	if (lsData) {
		const parsedData = JSON.parse(lsData);
		return parsedData.filter(
			(item: any) => typeof item.id === 'string' && item.id !== ''
		);
	} else {
		return [];
	}
};

export const getInitialItemsFromLS = () => {
	const lsData = localStorage.getItem('items');
	if (lsData) {
		return JSON.parse(lsData);
	} else {
		return [];
	}
};

export const getBoxesUuidsFromLS = () => {
	const lsData = localStorage.getItem('uuids');
	if (lsData) {
		const parsedData = JSON.parse(lsData);
		return parsedData.filter(
			(item: any) => typeof item.uuId === 'string' && item.uuId !== ''
		);
	} else {
		return [];
	}
};

export const getProportionFromLS = () => {
	const lsData = localStorage.getItem('proportion');
	if (lsData) {
		return JSON.parse(lsData);
	} else {
		return 1;
	}
};
