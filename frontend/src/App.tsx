import { useEffect, useRef } from 'react';
import './App.css';
import DragAndDrop from './components/DragAndDrop/DragAndDrop';
import { useSelector } from 'react-redux';
import { SelectSetDraggedItems } from './redux/setDraggedItems/selectors';
import { SelectGetItems } from './redux/getItems/selectors';
import { fetchList, getItems } from './redux/getItems/slice';
import { shuffleArray } from './utils/shuffleArray';
import { useAppDispatch } from './redux/store';
import { getInitialItemsFromLS } from './utils/LocalStorage/getLocalStorage';
import { SelectSetUtils } from './redux/setUtils/selectors';

function App() {
	const dispatch = useAppDispatch();
	const { items } = useSelector(SelectGetItems);

	const { draggedBoxes, endDragBoxesUuids, draggedBoxFlag } = useSelector(
		SelectSetDraggedItems
	);
	const { proportion, resetRef } = useSelector(SelectSetUtils);
	const isMounted = useRef(false);

	useEffect(() => {
		dispatch(fetchList());
		const lsItems = getInitialItemsFromLS();
		if (lsItems.length > 0 || draggedBoxes) {
			dispatch(getItems(lsItems));
		} else {
			dispatch(getItems(shuffleArray([...items])));
		}
	}, [dispatch]);

	useEffect(() => {
		if (isMounted.current && !resetRef.current) {
			const lsBoxesUuidsString = JSON.stringify(endDragBoxesUuids);
			localStorage.setItem('uuids', lsBoxesUuidsString);
			const lsDraggedBoxesString = JSON.stringify(draggedBoxes);
			localStorage.setItem('draggedBoxes', lsDraggedBoxesString);
			const lsItemsString = JSON.stringify(items);
			localStorage.setItem('items', lsItemsString);
			const lsProportion = JSON.stringify(proportion);
			localStorage.setItem('proportion', lsProportion);
		}
		isMounted.current = true;
	}, [
		draggedBoxes,
		items,
		endDragBoxesUuids,
		resetRef,
		proportion,
		draggedBoxFlag,
	]);

	return (
		<>
			<DragAndDrop />
		</>
	);
}

export default App;
