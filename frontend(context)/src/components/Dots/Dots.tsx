import { ListType } from '../DragAndDrop/DragAndDrop'
import styles from './Dots.module.scss'

type DotsPropsType = {
	setCountToShow: any
	elements: ListType[]
}

const Dots: React.FC<DotsPropsType> = ({ setCountToShow, elements }) => {
	const dotsOnClick = () => {
		setCountToShow(elements.length)
	}

	return (
		<div className={styles.dots} onClick={() => dotsOnClick()}>
			...
		</div>
	)
}

export default Dots
