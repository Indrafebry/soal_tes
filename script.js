const upperCaseAbjad = [
  ['A'],
  ['B', 'C', 'D'],
  ['E'],
  ['F', 'G', 'H'],
  ['I'],
  ['J', 'K', 'L', 'M', 'N'],
  ['O'],
  ['P', 'Q', 'R', 'S', 'T'],
  ['U'],
  ['V', 'W', 'X', 'Y', 'Z'],
]

const loweCaseAbjad = [
  ['v', 'w', 'x', 'y', 'z', ' '],
  ['u'],
  ['p', 'q', 'r', 's', 't'],
  ['o'],
  ['j', 'k', 'l', 'm', 'n'],
  ['i'],
  ['f', 'g', 'h'],
  ['e'],
  ['b', 'c', 'd'],
  ['a'],
]

const inputValue = document.getElementById('inputValue');
const submitButton = document.getElementById('submitButton');

function convertToNumber(input) {
  return input.split('').map(char => {
    if (char === ' ') {
      return { char, value: 0 }; // Spasi selalu bernilai 0
    }
    if (char >= 'A' && char <= 'Z') {
      for (let i = 0; i < upperCaseAbjad.length; i++) {
        if (upperCaseAbjad[i].includes(char)) {
          return { char, value: i};
        }
      }
    } else if (char >= 'a' && char <= 'z') {
      for (let i = 0; i < loweCaseAbjad.length; i++) {
        if (loweCaseAbjad[i].includes(char)) {
          return { char, value: i }
        }
      }
    }
    return {char, value: char.charCodeAt(0)}
  })
}

function sumAndSubtract(numbers) {
  let explanation = `${numbers[0]}`; // Mulai dengan angka pertama
  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (i % 2 !== 0) {
      result += numbers[i];
      explanation += ` + ${numbers[i]}`;
    } else {
      result -= numbers[i];
      explanation += ` - ${numbers[i]}`;
    }
  }

  return { result, explanation };
}

function decomposeResult(target) {
  // Jika target negatif, ubah menjadi positif
  target = Math.abs(target);

  let decompotion = [];
  let currentSum = 0;
  let currentNumber = 0;

  while (currentSum < target) {
    if (currentSum + currentNumber > target) {
      currentNumber = 0;
    }
    decompotion.push(currentNumber);
    currentSum += currentNumber;
    currentNumber++;
  }

  const abjadResult = decompotion.map(num => {
    return upperCaseAbjad[num]?.[0] || '-';
  });

  return { decompotion, abjadResult };
}

function abjadToNumberAndModify(abjadExplanation) {
  let explanation = []; // Array untuk menyimpan penjelasan
  // Konversi abjad ke angka menggunakan kamus upperCaseAbjad
  const numbers = abjadExplanation.map(char => {
    for (let i = 0; i < upperCaseAbjad.length; i++) {
      if (upperCaseAbjad[i].includes(char)) {
        explanation.push(`${char} -> ${i}`); // Tambahkan ke penjelasan
        return i; // Kembalikan indeks grup dari abjad
      }
    }
    explanation.push(`${char} -> -`); // Jika karakter tidak ditemukan
    return null;
  });

  if (numbers.length >= 2) {
    const lastIndex = numbers.length - 1;
    explanation.push(`${numbers[lastIndex]} -> ${numbers[lastIndex] + 1} (last element +1)`);
    explanation.push(`${numbers[lastIndex - 1]} -> ${numbers[lastIndex - 1] + 1} (second last element +1)`);
    numbers[lastIndex] += 1;
    numbers[lastIndex - 1] += 1;
  }

  const modifiedAbjad = numbers.map(num => {
    return upperCaseAbjad[num]?.[0] || '-'
  });

  explanation.push(`Modified Abjad: ${modifiedAbjad.join(', ')}`);

  return { numbers, modifiedAbjad, explanation };
}

function modifyAbjadToOddNumbers(modifiedAbjad) {
  let explanation = [];
  const oddNumbers = modifiedAbjad.map(char => {
    let number;
    for (let i = 0; i < upperCaseAbjad.length; i++) {
      if (upperCaseAbjad[i].includes(char)) {
        number = i;
        break;
      }
    }

    if (number === undefined) {
      explanation.push(`${char} -> Invalid`);
      return null; // Jika tidak valid, abaikan
    }

    if (number % 2 === 0 || number === 0) {
      explanation.push(`${char} -> ${number} (even) -> ${number + 1}`);
      return number + 1;
    } else {
      explanation.push(`${char} -> ${number} (odd) -> ${number}`);
      return number; // Jika ganjil, tetap
    }
  });

  return { oddNumbers, explanation }
}

submitButton.addEventListener('click', () => {
  const input = inputValue.value.trim();
  if (!input) {
    alert('Please enter a value');
    return;
  }

  const result = convertToNumber(input);
  const values = result.map(item => item.value)
  const explanation = result.map(item => `${item.char} => ${item.value}`).join(', ')
  const output = values.join('');

  const { explanation: calculateExplanation, result: calculateResult} = sumAndSubtract(values)

  const { decompotion, abjadResult } = decomposeResult(calculateResult);
  const decompotionExplanation = decompotion.join(' + ')
  const abjadExplanation = abjadResult
  const abjadExplan = abjadResult.join('')

  const {numbers, modifiedAbjad, explanation: modifyExplanation} = abjadToNumberAndModify(abjadExplanation)
  const modifyAbjad = modifiedAbjad.join('')

  const {oddNumbers, explanation: oddNumberExplanation} = modifyAbjadToOddNumbers(modifiedAbjad)
  const oddNumber = oddNumbers.join('')

  const resultTable = document.getElementById('resultTable');
  const row = `<tr>
    <td>1.</td>
    <td>${input}</td>
    <td>${explanation}</td>
    <td>${output}</td>
  </tr>
  <tr>
    <td>2.</td>
    <td>${output}</td>
    <td>${calculateExplanation}</td>
    <td>${calculateResult}</td>
  </tr>
  <tr>
    <td>3.</td>
    <td>${calculateResult}</td>
    <td>${decompotionExplanation}</td>
    <td>${abjadExplan}</td>
  </tr>
  <tr>
    <td>4.</td>
    <td>${abjadExplan}</td>
    <td>${modifyExplanation}</td>
    <td>${modifyAbjad}</td>
  </tr>
  <tr>
    <td>5.</td>
    <td>${modifyAbjad}</td>
    <td>${oddNumberExplanation}</td>
    <td>${oddNumber}</td>
  </tr>`;
  resultTable.innerHTML += row;

  inputValue.value = '';
})