import { useSelector } from 'react-redux';
import {
	addDraggedBox,
	addEndDragBoxesUuids,
	addEndDragBoxInside,
	deleteDraggedBox,
	deleteDraggedItem,
	setEndDragAnimationClass,
	setIsAnimated,
	setPosReadyToDrop,
} from '../../redux/setDraggedItems/slice';
import { useAppDispatch } from '../../redux/store';
import styles from '../DragAndDrop/DragAndDrop.module.scss';
import { SelectSetDraggedItems } from '../../redux/setDraggedItems/selectors';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { ListType } from '../../redux/getItems/types';
import Smile from '../Smile/Smile';
import { getBoxesUuidsFromLS } from '../../utils/LocalStorage/getLocalStorage';
import { setCoordinates } from '../../redux/setUtils/slice';
import { SelectSetUtils } from '../../redux/setUtils/selectors';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { addItem } from '../../redux/getItems/slice';
import BoxInside from '../BoxInside/BoxInside';

type EndDragPropsType = {
	id: string;
};

const EndDrag: React.FC<EndDragPropsType> = ({ id }) => {
	const dispatch = useAppDispatch();
	const { draggedBoxes, draggedBoxFlag, draggedBoxId } = useSelector(
		SelectSetDraggedItems
	);
	const { wrapperAnimation } = useSelector(SelectSetUtils);
	const endDragRef = useRef<HTMLDivElement | null>(null);
	const uuId = useRef(uuidv4()).current;
	const [finalId, setFinalId] = useState('');
	const uuidFromLSData = getBoxesUuidsFromLS();

	useEffect(() => {
		if (!uuidFromLSData || !uuidFromLSData[id]) {
			setFinalId(uuId);
			dispatch(addEndDragBoxesUuids({ uuId, draggedBoxFlag }));
		} else {
			setFinalId(uuidFromLSData[id].uuId);
		}
	}, [dispatch, id, uuId, draggedBoxFlag]);

	useEffect(() => {
		const coordinates = getCoordinates();
		if (coordinates !== null) {
			dispatch(setCoordinates({ coordinates, finalId }));
		}
	}, [finalId, dispatch]);

	const currentBox = useMemo(
		() => draggedBoxes.find((item: any) => item.id === finalId),
		[draggedBoxes, finalId]
	);
	const currentBoxFlag = useMemo(
		() => uuidFromLSData.find((item: any) => item.uuId === finalId),
		[uuidFromLSData, finalId]
	);

	const dragOverDebounced = useCallback(
		debounce((e: any) => {
			e.preventDefault();
			dispatch(addDraggedBox(finalId));
		}, 200),
		[dispatch, id]
	);
	const dragOver = (e: any) => {
		e.preventDefault();
		dispatch(setPosReadyToDrop(true));
		dispatch(addDraggedBox(finalId));
		dragOverDebounced(e);
	};
	const dragLeave = () => {
		dispatch(setPosReadyToDrop(false));
		dispatch(setEndDragAnimationClass(''));
		if (endDragRef.current) {
			endDragRef.current.classList.remove(styles.activeEndDrag);
		}
	};
	const dragEnter = () => {
		dispatch(setEndDragAnimationClass({ class: 'activeEndDrag', index: id }));
		if (endDragRef.current) {
			endDragRef.current.classList.add(styles.activeEndDrag);
		}
	};
	const mouseLeave = () => {
		if (endDragRef.current) {
			endDragRef.current.classList.remove(styles.activeEndDrag);
		}
	};

	const getCoordinates = () => {
		if (endDragRef.current) {
			const startDragRect = endDragRef.current.getBoundingClientRect();
			const left = startDragRect.left + startDragRect.width / 2;
			const top = startDragRect.top + startDragRect.height / 2;
			return { left, top };
		}
		return null;
	};

	const deleteBox = () => {
		currentBox?.items.map((item: any) => dispatch(addItem(item)));
		endDragRef?.current?.classList.add(styles.closed);
		dispatch(deleteDraggedBox(finalId));
		dispatch(setIsAnimated(false));
		currentBox?.items.map((item: any) => dispatch(deleteDraggedItem(item)));
	};

	const dragStart = (e: any) => {
		if (!endDragRef.current) return;
		e.dataTransfer.setData('text/plain', finalId); // Устанавливаем ID перетаскиваемого элемента
	};

	const dragEnd = (e: any) => {
		e.preventDefault();
		if (!endDragRef.current) return;
		const rect = endDragRef.current.getBoundingClientRect();
		const isCursorInside =
			e.clientX >= rect.left &&
			e.clientX <= rect.right &&
			e.clientY >= rect.top &&
			e.clientY <= rect.bottom;
		if (isCursorInside) {
			const selectedBoxId = e.dataTransfer.getData('text/plain'); // Получаем ID перетаскиваемого элемента
			if (selectedBoxId !== draggedBoxId) {
				dispatch(
					addEndDragBoxInside({ selectedBoxId, destinationBoxId: draggedBoxId })
				);
				const selectedBox = draggedBoxes.find(
					(box: any) => box.id === selectedBoxId
				);
				selectedBox.items.map((item: any) =>
					dispatch(deleteDraggedItem({ item, id: selectedBoxId }))
				);
			}
		}
	};

	return (
		<>
			{currentBoxFlag?.draggedBoxFlag && (
				<div
					className={`${styles.endDrag} ${
						wrapperAnimation ? styles.animateOpacity : ''
					}`}
					onDragStart={dragStart}
					onDrop={dragEnd}
					onDragOver={e => dragOver(e)}
					onDragLeave={dragLeave}
					onDragEnter={dragEnter}
					onMouseLeave={mouseLeave}
					style={{
						backgroundColor: 'rgba(31, 81, 83, 0.3)',
					}}
					ref={endDragRef}
					id={id}
					data-index={id}
					draggable={true}
				>
					<DisabledByDefaultIcon
						className={styles.delete}
						onClick={deleteBox}
					/>
					{currentBox?.boxesInside.map((box: any, index: number) => (
						<BoxInside key={index} box={box} parentBox={currentBox} />
					))}
					{currentBox?.items.map((item: ListType, index: number) => (
						<Smile key={index} item={item} uuId={finalId} dragStatus={true} />
					))}
				</div>
			)}
		</>
	);
};

export default EndDrag;
