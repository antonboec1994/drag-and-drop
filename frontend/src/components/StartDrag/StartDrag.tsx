import { useSelector } from 'react-redux';
import styles from '../DragAndDrop/DragAndDrop.module.scss';
import { SelectGetItems } from '../../redux/getItems/selectors';
import Smile from '../Smile/Smile';
import Dots from '../Dots/Dots';
import { useAppDispatch } from '../../redux/store';
import {
	addDraggedItemsRandom,
	resetDraggedItems,
	setCountDragAndDropBoxes,
	setIsAnimated,
} from '../../redux/setDraggedItems/slice';
import { useState } from 'react';
import {
	changeProportion,
	resetProportion,
	setCountToShow,
	setResetRef,
	setWrapperAnimation,
	setWrapperClass,
} from '../../redux/setUtils/slice';
import { SelectSetUtils } from '../../redux/setUtils/selectors';
import { getItems } from '../../redux/getItems/slice';

const StartDrag = () => {
	const dispatch = useAppDispatch();
	const { items } = useSelector(SelectGetItems);

	const { proportion, proportionSplit, countToShow } =
		useSelector(SelectSetUtils);
	const [buttonStatus, setButtonStatus] = useState(false);

	const animationStart = () => {
		dispatch(setCountToShow(items.length));
		dispatch(setIsAnimated(true));
		setTimeout(() => {
			dispatch(getItems(items));
			dispatch(addDraggedItemsRandom(items));
			dispatch(getItems([]));
		}, 5000);
		setButtonStatus(true);
	};

	const resetItems = () => {
		dispatch(setWrapperAnimation(true));
		setTimeout(() => {
			dispatch(getItems(items));
			dispatch(resetDraggedItems());
			setButtonStatus(false);
			dispatch(setResetRef(true));
			dispatch(resetProportion());
			localStorage.removeItem('uuids');
			localStorage.removeItem('items');
			localStorage.removeItem('draggedBoxes');
			localStorage.removeItem('proportion');
		}, 1000);
		setTimeout(() => {
			window.location.reload();
		}, 1001);
	};

	const onResize = () => {
		dispatch(changeProportion(0.6));
		dispatch(setCountDragAndDropBoxes());
		dispatch(setWrapperClass(`wrapperProportion-${proportionSplit}`));
	};

	return (
		<div className={styles.inner}>
			<div className={styles.buttons}>
				{proportion === 1 && (
					<button className={styles.button} onClick={onResize}>
						Расширить
					</button>
				)}
				<button className={styles.button} onClick={resetItems}>
					Сбросить
				</button>
				{!buttonStatus && items.length > 0 ? (
					<button className={styles.button} onClick={animationStart}>
						Распределить случайно
					</button>
				) : (
					''
				)}
			</div>
			<div className={styles.startDrag}>
				{items.map((item, index) => {
					if (index < countToShow) {
						return <Smile key={index} item={item} dragStatus={false} />;
					}
				})}
				{items.length > countToShow ? <Dots /> : ''}
			</div>
		</div>
	);
};

export default StartDrag;
