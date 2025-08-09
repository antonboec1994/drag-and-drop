import { useSelector } from 'react-redux';
import styles from './Dots.module.scss';
import { SelectGetItems } from '../../redux/getItems/selectors';
import { useAppDispatch } from '../../redux/store';
import { SelectSetUtils } from '../../redux/setUtils/selectors';
import { useEffect, useState } from 'react';
import { setCountToShow } from '../../redux/setUtils/slice';

const Dots: React.FC = () => {
	const dispatch = useAppDispatch();
	const { items } = useSelector(SelectGetItems);
	const { proportion } = useSelector(SelectSetUtils);
	const [dotsStyles, setDotsStyles] = useState<any>(null);

	const dotsOnClick = () => {
		dispatch(setCountToShow(items.length));
	};

	useEffect(() => {
		const dotsStyle = {
			'--proportion': proportion,
		};
		setDotsStyles(dotsStyle);
	}, [proportion]);

	return (
		<div
			className={styles.dots}
			onClick={() => dotsOnClick()}
			style={dotsStyles}
		>
			. . .
		</div>
	);
};

export default Dots;
