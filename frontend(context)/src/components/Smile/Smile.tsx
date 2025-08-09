import React from 'react'
import styles from './Smile.module.scss'
import { ListType } from '../DragAndDrop/DragAndDrop'

type SmilePropsType = {
	data: ListType
	onDrag: any
}

const Smile: React.FC<SmilePropsType> = ({ data, onDrag }) => {
	const onDragStart = () => {
		onDrag(data)
	}

	return (
		<div className={styles.smileBox} draggable onDragStart={onDragStart}>
			{data.content}
		</div>
	)
}

export default Smile
