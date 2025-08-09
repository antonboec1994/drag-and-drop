import { createContext } from 'react'

interface DragAndDropContextType {
	countToShow: any
	setCountToShow: any
	elements: any
	setElements: any
	draggedEls: any
	setDraggedEls: any
	currDraggedEl: any
	setCurrDraggedEl: any
	data: any
}

const DragAndDropContext = createContext<DragAndDropContextType>()

export default DragAndDropContext
