import { createContext, useContext, useState } from 'react';

type ComponentStateType = {
	[key: string]: any;
};

const DndContext = createContext<any>(null);

const StateProvider = ({ children }: any) => {
	const [contextState, setContextState] = useState<ComponentStateType>({});

	const updateContextState = (id: string, value: any) => {
		console.log(`Updating contextState[${id}] =`, value);
		setContextState(prev => ({
			...prev,
			[id]: value,
		}));
	};

	return (
		<DndContext.Provider value={{ contextState, updateContextState }}>
			{children}
		</DndContext.Provider>
	);
};

export const useSharedState = () => useContext(DndContext);
export default StateProvider;
