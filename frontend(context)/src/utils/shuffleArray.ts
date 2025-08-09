export const shuffleArray = (array: any) => {
	let i = array.length - 1
	for (; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const current = array[i]
		array[i] = array[j]
		array[j] = current
	}
	return array
}
