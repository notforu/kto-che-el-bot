const getRandomArrayElement = array => array[ Math.floor(Math.random() * (array.length)) ];

const listOfAbbreviations = [
	'б',
	'бут',
	'бцп',
	'г',
	'йог',
	'к',
	'карт',
	'колб',
	'м',
	'н',
	'огур',
	'пом',
	'с',
	'серв',
	'сос',
	'ссп',
	'твор',
	'фас',
	'чм',
	'х',
	'я'
];

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomDishAbbreviation = () => {
	const max = listOfAbbreviations.length - 1;
	const ingredientOne = listOfAbbreviations[getRandomInt(0, max)];
	const ingredientTwo = listOfAbbreviations[getRandomInt(0, max)];
	const ingredientThree = listOfAbbreviations[getRandomInt(0, max)];
	return `${ingredientOne}c${ingredientTwo}и${ingredientThree}`;
}

module.exports = { getRandomArrayElement, getRandomDishAbbreviation };