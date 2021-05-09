const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

function getShiftedChar(sChar, iShift) {
  const iShiftAbs = Math.abs(iShift);
  const bUpperCase = !!/[A-Z]/.test(sChar);
  let aAlphabetReversed;
  let iCharIndex;

  if (/[^a-zA-Z]/.test(sChar) || iCharIndex === -1) {
    return sChar;
  }

  if (iShift < 0) {
    aAlphabetReversed = alphabet.slice().reverse();
  }

  const aArray = Array.isArray(aAlphabetReversed) ? aAlphabetReversed : alphabet;
  iCharIndex = aArray.indexOf(sChar.toLowerCase());
  const iNewCharIndex = (iCharIndex + iShiftAbs) % aArray.length;

  return bUpperCase ? aArray[iNewCharIndex].toUpperCase() : aArray[iNewCharIndex];
}

module.exports = function convertString(sString, bEncrypt, iShift) {
  const aResult = [];
  const iResultShifting = bEncrypt ? iShift : -iShift;

  [].forEach.call(sString, (sChar) => {
    aResult.push(getShiftedChar(sChar, iResultShifting));
  });

  return aResult.join('');
};
