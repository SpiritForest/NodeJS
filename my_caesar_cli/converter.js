const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];

function getShiftedChar(sChar, iShift) {
    let iShiftAbs = Math.abs(iShift);
    let iNewCharIndex;
    let aAlphabetReversed;
    let bUpperCase;
    let iCharIndex;
    let aArray;

    if (/[^a-zA-Z]/.test(sChar) || iCharIndex === -1) {
        return sChar;
    }

    bUpperCase = /[A-Z]/.test(sChar) ? true : false;

    if (iShift < 0) {
        aAlphabetReversed = alphabet.slice().reverse();
    }

    aArray = Array.isArray(aAlphabetReversed) ? aAlphabetReversed : alphabet;
    iCharIndex = aArray.indexOf(sChar.toLowerCase());
    iNewCharIndex = (iCharIndex + iShiftAbs) % aArray.length;

    return bUpperCase ? aArray[iNewCharIndex].toUpperCase() : aArray[iNewCharIndex];
};

module.exports = function convertString(sString, bEncrypt, iShift) {
    const aResult = [];
    let iResultShifting = bEncrypt ? iShift : -iShift;

    for (let key of sString) {
        aResult.push(getShiftedChar(key, iResultShifting))
    }

    return aResult.join("");
};