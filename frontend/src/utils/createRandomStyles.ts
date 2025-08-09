import { keyframes } from '@emotion/react';

interface getEndPositionType {
	top: number;
	left: number;
	wrapWidth: number;
	wrapHeight: number;
	refWidth?: number; // Необязательное поле
	refHeight?: number; // Необязательное поле
}

export const getRandomNumber = (min: number, max: number) => {
	return min + Math.random() * (max - min);
};

export const createBorderRadius = () => {
	const a = Math.floor(Math.random() * (80 - 30)) + 30;
	const b = Math.floor(Math.random() * (80 - 30)) + 30;
	const c = Math.floor(Math.random() * (80 - 30)) + 30;
	const d = Math.floor(Math.random() * (80 - 30)) + 30;
	const a1 = Math.floor(Math.random() * (80 - 30)) + 30;
	const b1 = Math.floor(Math.random() * (80 - 30)) + 30;
	const c1 = Math.floor(Math.random() * (80 - 30)) + 30;
	const d1 = Math.floor(Math.random() * (80 - 30)) + 30;
	return `${a}% ${b}% ${c}% ${d}% / ${a1}% ${b1}% ${c1}% ${d1}%`;
};

export const createBubblesPosition = () => {
	const top = Math.floor(Math.random() * (70 - 50)) + 30;
	const left = Math.floor(Math.random() * (90 - 70)) + 70;
	return {
		top: `${top}%`,
		left: `${left}%`,
		top1: `${top + 30}%`,
		left1: `${left + 20}%`,
	};
};

export const createAnimationTime = () => {
	const time = Math.floor(Math.random() * (10 - 5)) + 5;
	return `${time}s`;
};

export const createAnimationDurationTime = () => {
	const time = Math.floor(Math.random() * (4 - 1)) + 1;
	return `${time}s`;
};

export const createAnimationDelayTime = () => {
	const time = Math.floor(Math.random() * (3 - 1)) + 1;
	return `${time}s`;
};

export const createAnimation = (endPositionY: any) =>
	keyframes`from {
		transform: translateX(0);
		transform: translateY(0);
	}
	to {
		transform: translateY(${endPositionY}px);
	}`;

export const getEndPosition = ({
	top,
	left,
	wrapWidth,
	wrapHeight,
	refWidth,
	refHeight,
}: getEndPositionType) => {
	// Базовые координаты
	const desiredTop = top;
	const desiredLeft = left;
	// Случайное смещение ±50px
	const randomOffsetX = getRandomNumber(-100, 100); // Случайное число от -50 до 50 по X
	const randomOffsetY = getRandomNumber(-100, 100); // Случайное число от -50 до 50 по Y
	const parentWidth = wrapWidth;
	const parentHeight = wrapHeight;
	const elementWidth = refWidth ? refWidth : 0;
	const elementHeight = refHeight ? refHeight : 0;
	// Начальная позиция
	const initialTop = parentHeight * 0.5;
	const initialLeft = parentWidth * 0.5;
	// Рассчитываем смещение для translate с учетом случайного смещения
	const endPositionX =
		desiredLeft + randomOffsetX - (initialLeft - elementWidth / 2);
	const endPositionY =
		desiredTop + randomOffsetY - (initialTop - elementHeight / 2);
	return { endPositionX, endPositionY };
};
