import { addItem } from '../../redux/getItems/slice';
import {
	deleteEndDragBoxInside,
	setIsAnimated,
} from '../../redux/setDraggedItems/slice';
import { useAppDispatch } from '../../redux/store';
import styles from './BoxInside.module.scss';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useRef } from 'react';

type BoxInsideType = {
	box: any;
	parentBox: any;
};

const BoxInside: React.FC<BoxInsideType> = ({ box, parentBox }) => {
	const dispatch = useAppDispatch();
	const array = box.items;
	const boxInsideRef = useRef<HTMLDivElement | null>(null);

	const deleteBoxInside = () => {
		box?.items.map((item: any) => dispatch(addItem(item)));
		dispatch(deleteEndDragBoxInside({ parentBox, box }));
		dispatch(setIsAnimated(false));
		// boxInsideRef?.current?.classList.add(styles.closed);
	};

	return (
		<div className={styles.boxInside} draggable={false} ref={boxInsideRef}>
			<DisabledByDefaultIcon
				className={styles.delete}
				onClick={deleteBoxInside}
			/>
			{array.map((el: any, index: number) => (
				<div className={styles.element} key={index}>
					{el.content}
					<span>{el.id}</span>
				</div>
			))}
		</div>
	);
};

export default BoxInside;
