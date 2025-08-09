import { useCallback, useState } from 'react';
import { useSharedState } from '../components/StateProvider';

export const useSharedStateUpdate = (id: string) => {
	const { updateContextState } = useSharedState();
	const [localValue, setLocalValue] = useState('');

	const handleUpdate = useCallback(
		(newValue: string) => {
			setLocalValue(newValue);
			updateContextState?.(id, newValue);
		},
		[id, updateContextState]
	);

	return { localValue, handleUpdate };
};
