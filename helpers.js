const getRandomArrayElement = array => array[ Math.floor(Math.random() * (array.length)) ];

const dictionary = {
	'б': 'бекон',
	'бут': 'бутерброд',
	'бцп': 'блинчики царское подворье',
	'г': 'греча',
	'йог': 'йогурт',
	'к': 'кура',
	'карт': 'картофель',
	'колб': 'колбаса',
	'м': 'макароны',
	'н': 'наггетсы',
	'огур': 'огурцы',
	'пом': 'ПОМ',
	'с': 'с',
	'серв': 'сервелат',
	'сос': 'сосиски',
	'ссп': 'столбы + солянка + пицца',
	'твор': 'творог',
	'фас': 'фасоль',
	'чм': 'чачжан мён',
	'х': 'хлеб',
	'я': 'яйца'
};

const listOfAbbreviations = Object.keys(dictionary);

const phrasePrefixes = ['', 'у меня', 'сёдня', 'я ел', 'добавилось', 'ел', 'поел'];

const respectMessages = ['уважаю', 'норм ел', 'респект', 'хорошо едите, друзья! всем большое спасибо!', 'норм', 'неплохо ел, дружище', 'одобряю съеденное', 'понял', 'принято'];

const disrespectMessages = ['за болон неуважение', 'Мде.', 'дизреспект'];

const getPhrasePrefix = () => getRandomArrayElement(phrasePrefixes);

const generateRespectMessage = () => getRandomArrayElement(respectMessages);

const generateDisrespectMessage = () => getRandomArrayElement(disrespectMessages);

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
	return [ingredientOne, ingredientTwo, ingredientThree];
}

const cheEllable = (message) => ['че ел', 'что ел', 'чо ел', 'чё ел'].some(cheEl => message.toLowerCase().includes(cheEl));

const isReport = (message) => ['ела', 'поела', 'были', 'сегодня']
	.concat(phrasePrefixes)
	.concat(listOfAbbreviations.filter(abbreviation => abbreviation.length > 1))
	.filter(prefix => prefix !== '')
	.some(prefix => message.toLowerCase().includes(prefix));

const poyasniable = (message) => message.toLowerCase().includes('поясни');

const bolognezeSynonyms = ['болоньезе', 'болон', 'балон', 'балоньезе', 'баланьезе', 'боланьезе'];

const containsBologneze = message => bolognezeSynonyms.some(synonym => message.text.toLowerCase().includes(synonym));

const getExplanation = (phrase) => phrase.map(word => dictionary[word]).join(' + ');

module.exports = {
	getRandomArrayElement,
	getRandomDishAbbreviation,
	getRandomInt,
	isReport,
	cheEllable,
	getPhrasePrefix,
	generateRespectMessage,
	generateDisrespectMessage,
	poyasniable,
	getExplanation,
	containsBologneze
};
