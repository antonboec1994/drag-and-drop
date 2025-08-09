import DeleteIcon from '@mui/icons-material/Delete'
import { ListType } from '../DragAndDrop/DragAndDrop'
import styles from './Smile.module.scss'
import { useContext, useEffect } from 'react'
import DragAndDropContext from '../../context'

type SmileDraggedPropsType = {
	data: ListType
	onDrag: any
}

const SmileDragged: React.FC<SmileDraggedPropsType> = ({ onDrag }) => {
	const { draggedEls, setDraggedEls, setElements, elements, data } =
		useContext(DragAndDropContext)
	useEffect(() => {}, [draggedEls])

	const onDragStart = () => {
		onDrag(data)
	}

	const deleteEl = (data: ListType) => {
		setDraggedEls(draggedEls.filter((item: ListType) => item.id !== data.id))
		setElements([...elements, data])
	}

	return (
		<div className={styles.smileBox} draggable onDragStart={onDragStart}>
			{data.content}
			<DeleteIcon
				className={styles.delete}
				fontSize='small'
				onClick={() => deleteEl(data)}
			/>
		</div>
	)
}

export default SmileDragged
