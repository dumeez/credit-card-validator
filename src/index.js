/*
  This code is based on jQuery Credit Card Validator 1.1 from https://github.com/PawelDecowski/jquery-creditcardvalidator
*/

var options;

/**
 * The different types of cards supported
 */
const cardTypes = [
  {
    name: 'amex',
    range: '34,37',
    valid_length: [15]
  }, {
    name: 'diners_club_carte_blanche',
    range: '300-305',
    valid_length: [14]
  }, {
    name: 'diners_club_international',
    range: '36',
    valid_length: [14]
  }, {
    name: 'jcb',
    range: '3528-3589',
    valid_length: [16]
  }, {
    name: 'laser',
    range: '6304, 6706, 6709, 6771',
    valid_length: [16, 17, 18, 19]
  }, {
    name: 'visa_electron',
    range: '4026, 417500, 4508, 4844, 4913, 4917',
    valid_length: [16]
  }, {
    name: 'visa',
    range: '4',
    valid_length: [13, 14, 15, 16, 17, 18, 19]
  }, {
    name: 'mastercard',
    range: '51-55,2221-2720',
    valid_length: [16]
  }, {
    name: 'discover',
    range: '6011, 622126-622925, 644-649, 65',
    valid_length: [16]
  }, {
    name: 'dankort',
    range: '5019',
    valid_length: [16]
  }, {
    name: 'maestro',
    range: '50, 56-69',
    valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
  }, {
    name: 'uatp',
    range: '1',
    valid_length: [15]
  }
];

/**
 * indexOfFunction 
 */

function indexOfFunc(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }
  return -1;
};

const indexOf = [].indexOf || indexOfFunc;

/**
 * Trie 
 */

function Trie() {
  this.trie = {};
}

Trie.prototype.push = function (value) {
  var char, i, j, len, obj, ref, results;
  value = value.toString();
  obj = this.trie;
  ref = value.split('');
  results = [];
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    char = ref[i];
    if (obj[char] == null) {
      if (i === (value.length - 1)) {
        obj[char] = null;
      } else {
        obj[char] = {};
      }
    }
    results.push(obj = obj[char]);
  }
  return results;
};

Trie.prototype.find = function (value) {
  var char, i, j, len, obj, ref;
  value = value.toString();
  obj = this.trie;
  ref = value.split('');
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    char = ref[i];
    if (obj.hasOwnProperty(char)) {
      if (obj[char] === null) {
        return true;
      }
    } else {
      return false;
    }
    obj = obj[char];
  }
};

/**
 * Range function
 * @param {Trie} trie
 */

function Range(trie) {
  this.trie = trie;
  if (this.trie.constructor !== Trie) {
    throw Error('Range constructor requires a Trie parameter');
  }
};

Range.prototype.match = function (number) {
  return this.trie.find(number);
};

Range.prototype.rangeWithString = function (ranges) {
  var j, k, len, n, r, range, ref, ref1, trie;
  if (typeof ranges !== 'string') {
    throw Error('rangeWithString requires a string parameter');
  }
  ranges = ranges.replace(/ /g, '');
  ranges = ranges.split(',');
  trie = new Trie;
  for (j = 0, len = ranges.length; j < len; j++) {
    range = ranges[j];
    if (r = range.match(/^(\d+)-(\d+)$/)) {
      for (n = k = ref = r[1], ref1 = r[2]; ref <= ref1 ? k <= ref1 : k >= ref1; n = ref <= ref1 ? ++k : --k) {
        trie.push(n);
      }
    } else if (range.match(/^\d+$/)) {
      trie.push(range);
    } else {
      throw Error("Invalid range '" + r + "'");
    }
  }
  return new Range(trie);
};

/**
 * initVerification initialize the cards from cardTypes array
 */

function initVerification() {
  var bind, card, cardType, j, len, normalize, ref, validate;

  if (options == null) {
    options = {};
  }
  if (options.accept == null) {
    options.accept = (function () {
      var j, len, results;
      results = [];
      for (j = 0, len = cardTypes.length; j < len; j++) {
        card = cardTypes[j];
        results.push(card.name);
      }
      return results;
    })();
  }
  ref = options.accept;
  for (j = 0, len = ref.length; j < len; j++) {
    cardType = ref[j];
    if (indexOf.call((function () {
      var k, len1, results;
      results = [];
      for (k = 0, len1 = cardTypes.length; k < len1; k++) {
        card = cardTypes[k];
        results.push(card.name);
      }
      return results;
    })(), cardType) < 0) {
      throw Error("Credit card type '" + cardType + "' is not supported");
    }
  }

  return null;
};

/**
 * Get the type of card entered by user
 */

function getCardType(number) {
  var k, len1, r, ref1;
  ref1 = (function () {
    var l, len1, ref1, results;
    results = [];
    for (l = 0, len1 = cardTypes.length; l < len1; l++) {
      card = cardTypes[l];
      if (ref1 = card.name, indexOf.call(options.accept, ref1) >= 0) {
        results.push(card);
      }
    }
    return results;
  })();
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    cardType = ref1[k];
    const trie = new Trie();
    const range = new Range(trie);
    r = range.rangeWithString(cardType.range);
    if (r.match(number)) {
      return cardType;
    }
  }
  return null;
};

/**
 * The function to call to validate a card number
 */

function validateCard(number) {
  initVerification();
  var lengthValid, luhnValid;
  cardType = getCardType(number, options);
  luhnValid = false;
  lengthValid = false;
  if (cardType != null) {
    luhnValid = isValidLuhn(number);
    lengthValid = isValidLength(number, cardType);
  }
  return {
    cardType: cardType,
    valid: luhnValid && lengthValid,
    luhnValid: luhnValid,
    lengthValid: lengthValid
  };
};

/**
 * Validate the length of card number
 */

function isValidLength(number, cardType) {
  var ref1;
  return ref1 = number.length, indexOf.call(cardType.valid_length, ref1) >= 0;
};

/**
 * Validate the luhn algo of card number
 */

function isValidLuhn(number) {
  var digit, k, len1, n, ref1, sum;
  sum = 0;
  ref1 = number.split('').reverse();
  for (n = k = 0, len1 = ref1.length; k < len1; n = ++k) {
    digit = ref1[n];
    digit = +digit;
    if (n % 2) {
      digit *= 2;
      if (digit < 10) {
        sum += digit;
      } else {
        sum += digit - 9;
      }
    } else {
      sum += digit;
    }
  }
  return sum % 10 === 0;
};


module.exports = {
    validateCard: validateCard,
    getCardType: getCardType,
    isValidLuhn: isValidLuhn,
    isValidLength: isValidLength
};