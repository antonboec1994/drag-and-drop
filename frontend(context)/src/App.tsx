import { useState } from 'react'
import './App.css'
import DragAndDrop, { ListType } from './components/DragAndDrop/DragAndDrop'
import DragAndDropContext from './context'

function App() {
	const [countToShow, setCountToShow] = useState<number>(4)
	const [elements, setElements] = useState<ListType[]>([])
	const [draggedEls, setDraggedEls] = useState<ListType[]>([])
	const [currDraggedEl, setCurrDraggedEl] = useState<any>({})

	return (
		<>
			<DragAndDropContext.Provider
				value={{
					countToShow,
					setCountToShow,
					elements,
					setElements,
					draggedEls,
					setDraggedEls,
					currDraggedEl,
					setCurrDraggedEl,
					data,
				}}
			>
				<DragAndDrop />
			</DragAndDropContext.Provider>
		</>
	)
}

export default App
