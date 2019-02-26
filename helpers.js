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

const phrasePrefixes = ['', 'у меня', 'сёдня', 'я ел', 'добавилось', 'ел', 'поел'];

const respectMessages = ['уважаю', 'норм ел', 'респект', 'хорошо едите, друзья! всем большое спасибо!', 'ноооорм', 'неплохо ел, дружище', 'одобряю съеденное'];

const getPhrasePrefix = () => phrasePrefixes[getRandomInt(0, phrasePrefixes.length - 1)];

const generateRespectMessage = () => respectMessages[getRandomInt(0, respectMessages.length - 1)];

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
	return `${ingredientOne}${ingredientTwo}${ingredientThree}`;
}

const cheEllable = (message) => ['че ел', 'что ел', 'чо ел'].some(cheEl => message.toLowerCase().includes(cheEl));

const isReport = (message) => ['ела', 'поела', 'были', 'сегодня']
	.concat(phrasePrefixes)
	.concat(listOfAbbreviations.filter(abbreviation => abbreviation.length > 1))
	.filter(prefix => prefix !== '')
	.some(prefix => message.toLowerCase().includes(prefix));

const poyasniable = (message) => message.toLowerCase().includes('поясни');

module.exports = { getRandomArrayElement, getRandomDishAbbreviation, getRandomInt, isReport, cheEllable, getPhrasePrefix, generateRespectMessage, poyasniable };