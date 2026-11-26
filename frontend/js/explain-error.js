// Пояснення помилок Python простою мовою.
// Гравець бачить і пояснення, і справжній текст помилки, щоб поступово
// вчитися читати повідомлення Python самостійно.

export function explainError({ errorType, errorText }) {
  switch (errorType) {
    case "Timeout":
      return "Код виконується занадто довго. Схоже на нескінченний цикл — перевір умову циклу.";

    case "SyntaxError":
      if (/unterminated string|EOL while scanning/.test(errorText)) {
        return "Лапка відкрилась, але не закрилась. Текст має бути з лапками з обох боків.";
      }
      if (/was never closed|unmatched/.test(errorText)) {
        return "Дужки не збігаються: десь відкрита дужка без пари, або навпаки.";
      }
      return "Python не зміг прочитати код. Перевір лапки, дужки, двокрапки та знаки.";

    case "IndentationError":
      return "Проблема з відступами. У Python відступи на початку рядка мають значення.";

    case "NameError": {
      const name = errorText.match(/name '(.+?)' is not defined/)?.[1];
      if (name) {
        return (
          `Python не знає, що таке ${name}. Якщо це текст — візьми його в лапки: "${name}". ` +
          "Якщо це змінна — перевір, чи правильно написана назва."
        );
      }
      return "Python не знає якогось імені. Можливо, текст без лапок або назва з помилкою.";
    }

    case "TypeError":
      if (/can only concatenate str|unsupported operand/.test(errorText)) {
        return "Не можна просто так поєднати значення різних типів — наприклад, текст і число.";
      }
      if (/cannot be interpreted as an integer/.test(errorText)) {
        return "Тут потрібне ціле число, а отримано щось інше (можливо, текст у лапках).";
      }
      return "Значення не того типу: наприклад, текст там, де потрібне число.";

    case "ZeroDivisionError":
      return "Ділити на нуль не можна — навіть у саду.";

    case "ValueError":
      return "Тип значення правильний, але саме значення не підходить.";

    default:
      return "Python повідомив про помилку. Прочитай її текст нижче — там є підказка.";
  }
}
