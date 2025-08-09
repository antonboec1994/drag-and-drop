import { useContext, useEffect } from 'react'
import Smile from '../Smile/Smile'
import styles from './DragAndDrop.module.scss'
import SmileDragged from '../Smile/SmileDragged'
import { shuffleArray } from '../../utils/shuffleArray'
import Dots from '../Dots/Dots'
import DragAndDropContext from '../../context'

export type ListType = {
	id: number
	content: string
}

const list: ListType[] = [
	{ id: 1, content: '😀' },
	{ id: 2, content: '😃' },
	{ id: 3, content: '😄' },
	{ id: 4, content: '😁' },
	{ id: 5, content: '😆' },
	{ id: 6, content: '😅' },
	{ id: 7, content: '🤣' },
	{ id: 8, content: '😂' },
	{ id: 9, content: '🙂' },
	{ id: 10, content: '🙃' },
	{ id: 11, content: '😉' },
	{ id: 12, content: '😊' },
	{ id: 13, content: '😇' },
	{ id: 14, content: '🥰' },
	{ id: 15, content: '😍' },
]

const DragAndDrop = () => {
	const {
		countToShow,
		setCountToShow,
		elements,
		setElements,
		draggedEls,
		setDraggedEls,
		currDraggedEl,
		setCurrDraggedEl,
	} = useContext(DragAndDropContext)

	useEffect(() => {
		setElements(shuffleArray(list))
	}, [setElements])

	const onDrag = (data: ListType) => {
		setCurrDraggedEl(data)
	}

	const onDrop = () => {
		setDraggedEls([...draggedEls, currDraggedEl])
		setElements(
			elements.filter((item: ListType) => item.id !== currDraggedEl.id)
		)
		setCurrDraggedEl({})
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.startDrag}>
				{elements.map((smile: ListType, index: number) => {
					if (index < countToShow) {
						return <Smile key={smile.id} data={smile} onDrag={onDrag} />
					}
				})}
				{elements.length > countToShow ? (
					<Dots setCountToShow={setCountToShow} elements={elements} />
				) : (
					''
				)}
			</div>
			<div
				className={styles.endDrag}
				onDrop={onDrop}
				onDragOver={evt => evt.preventDefault()}
				style={{ backgroundColor: '#1f5153' }}
			>
				{draggedEls.map((smile: ListType) => (
					<SmileDragged key={smile.id} onDrag={onDrag} />
				))}
			</div>
			<div
				className={styles.endDrag}
				onDrop={onDrop}
				onDragOver={evt => evt.preventDefault()}
			>
				{draggedEls.map((smile: ListType) => (
					<SmileDragged key={smile.id} onDrag={onDrag} />
				))}
			</div>
		</div>
	)
}

export default DragAndDrop
