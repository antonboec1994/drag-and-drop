import React, { useEffect, useRef, useState } from 'react';
import { ListType } from '../../redux/getItems/types';
import styles from './Smile.module.scss';
import { useAppDispatch } from '../../redux/store';
import {
	addDraggedItem,
	deleteDraggedItem,
	setCurrDraggedItem,
	setIsAnimated,
	setPosReadyToDrop,
} from '../../redux/setDraggedItems/slice';
import { useSelector } from 'react-redux';
import { SelectSetDraggedItems } from '../../redux/setDraggedItems/selectors';
import { addItem, getItems } from '../../redux/getItems/slice';
import { SelectGetItems } from '../../redux/getItems/selectors';
import {
	createAnimationDelayTime,
	createAnimationDurationTime,
	createAnimationTime,
	createBorderRadius,
	createBubblesPosition,
	getEndPosition,
} from '../../utils/createRandomStyles';
import CSS from 'csstype';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectSetUtils } from '../../redux/setUtils/selectors';

type SmilePropsType = {
	item: ListType;
	uuId?: string;
	dragStatus: boolean;
	animation?: boolean;
};

const Smile: React.FC<SmilePropsType> = ({ item, uuId, dragStatus }) => {
	const dispatch = useAppDispatch();
	const { items } = useSelector(SelectGetItems);
	const smileBoxRef = useRef<HTMLDivElement | null>(null);
	const { posReadyToDrop, draggedBoxId, isAnimated } = useSelector(
		SelectSetDraggedItems
	);
	const { proportion, endDragCoordinates, wrapperSize } =
		useSelector(SelectSetUtils);
	const [customStyles, setCustomStyles] = useState({});
	const [draggableSmileClass, setDraggableSmileClass] = useState('');
	const [animationReady, setAnimationReady] = useState(false);

	useEffect(() => {
		if (endDragCoordinates.length === 0 || !wrapperSize) return;
		const coordinates = sendCoordinatesForSmile();
		if (!coordinates) return;
		const params = {
			top: coordinates.top,
			left: coordinates.left,
			wrapWidth: wrapperSize.width,
			wrapHeight: wrapperSize.height,
			refWidth: smileBoxRef?.current?.offsetWidth,
			refHeight: smileBoxRef?.current?.offsetHeight,
		};
		const endPositionX = getEndPosition(params).endPositionX;
		const endPositionY = getEndPosition(params).endPositionY;
		const smileBoxStyles = {
			'--proportion': proportion,
			'--borderRadius': createBorderRadius(),
			'--beforeTop': createBubblesPosition().top,
			'--beforeLeft': createBubblesPosition().left,
			'--afterTop': createBubblesPosition().top1,
			'--afterLeft': createBubblesPosition().left1,
			'--animationTime': createAnimationTime(),
			'--endPositionX': `${endPositionX}px`,
			'--endPositionY': `${endPositionY}px`,
			'--animationDelay': createAnimationDelayTime(),
			'--animationDuration': createAnimationDurationTime(),
		} as CSS.Properties;
		setCustomStyles(smileBoxStyles);
		setTimeout(() => {
			setAnimationReady(true);
		}, 50);
	}, [endDragCoordinates, wrapperSize, proportion]);

	const sendCoordinatesForSmile = () => {
		if (endDragCoordinates.length === 0) return;
		const randomIndex = Math.floor(Math.random() * endDragCoordinates.length);
		const { left, top } = endDragCoordinates[randomIndex];
		return { left, top };
	};
	const onDragStart = () => {
		setDraggableSmileClass('onDragStart');
		setTimeout(() => {
			setDraggableSmileClass('');
		}, 500);
	};
	const onDragEnd = () => {
		if (posReadyToDrop) {
			dispatch(setCurrDraggedItem(item));
			dispatch(addDraggedItem({ item, draggedBoxId }));
			dispatch(getItems(items.filter(el => el.id !== item.id)));
			dispatch(setCurrDraggedItem(null));
		}
		dispatch(setPosReadyToDrop(false));
	};
	const deleteEl = () => {
		if (uuId) {
			dispatch(deleteDraggedItem({ item, id: uuId }));
			dispatch(setIsAnimated(false));
		}
		dispatch(addItem(item));
	};

	return (
		<>
			{dragStatus ? (
				<div
					className={`${styles.smileBox} ${styles.dragged}`}
					draggable={false}
					style={customStyles}
				>
					{item?.content}
					<span>{item?.id}</span>
					<DeleteIcon
						className={styles.delete}
						fontSize='small'
						onClick={deleteEl}
					/>
				</div>
			) : (
				<div
					className={`${styles.smileBox} ${draggableSmileClass} ${
						isAnimated && animationReady ? styles.animationOn : ''
					}`}
					draggable
					onDragEnd={onDragEnd}
					onDragStart={onDragStart}
					style={customStyles}
					ref={smileBoxRef}
				>
					{item?.content}
					<span>{item?.id}</span>
				</div>
			)}
		</>
	);
};

export default Smile;
