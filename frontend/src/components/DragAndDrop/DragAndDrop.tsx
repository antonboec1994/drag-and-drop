import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import styles from './DragAndDrop.module.scss';
import EndDrag from '../EndDrag/EndDrag';
import StartDrag from '../StartDrag/StartDrag';
import StateProvider from '../StateProvider';
import { useSelector } from 'react-redux';
import { SelectSetDraggedItems } from '../../redux/setDraggedItems/selectors';
import { setCountDragAndDropBoxes } from '../../redux/setDraggedItems/slice';
import { SelectSetUtils } from '../../redux/setUtils/selectors';
import {
	getWrapperSize,
	setProportion,
	setWrapperClass,
} from '../../redux/setUtils/slice';

const DragAndDrop = () => {
	const dispatch = useAppDispatch();
	const { countDragAndDropBoxes } = useSelector(SelectSetDraggedItems);
	const { proportion, proportionSplit, wrapperClass } =
		useSelector(SelectSetUtils);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const [wrpStyles, setWrpStyles] = useState({});

	useEffect(() => {
		if (wrapperRef.current) {
			const width = wrapperRef.current.offsetWidth;
			const height = wrapperRef.current.offsetHeight;
			dispatch(getWrapperSize({ width: width, height: height }));
			const wrapperStyle = {
				'--proportion': proportion,
				'--wrapperClass': wrapperClass,
			};
			dispatch(setProportion());
			setWrpStyles(wrapperStyle);
			dispatch(setWrapperClass(`wrapperProportion-${proportionSplit}`));
		}
		if (proportion !== 1) {
			dispatch(setCountDragAndDropBoxes());
		}
	}, [dispatch, proportion, proportionSplit]);

	return (
		<StateProvider>
			<div
				className={`${styles.wrapper} ${wrapperClass && wrapperClass}`}
				ref={wrapperRef}
				style={wrpStyles}
				draggable={false}
			>
				<StartDrag />
				{Array.from({ length: countDragAndDropBoxes }).map((_, index) => (
					<EndDrag key={index} id={index.toString()} />
				))}
			</div>
		</StateProvider>
	);
};

export default DragAndDrop;
