# credit-card-validator

You can use this package if you want to check the validity of a credit card number. It will return the credit card's type. This package supports :
  - Visa
  - MasterCard
  - Maestro
  - Amex
  - Diners club carte blanche
  - Diners club international
  - Jcb
  - Laser
  - Visa Electron
  - Discover
  - Dankort
  - Uatp

### Use

To check if a card number is valid, you have to call validateCard function.
You can call this function every time the user enter a letter in an input.
Here an example :
```sh
    <label>CC number <input id="cardInput"></label>
    <p class="log"></p>
```
```sh
    $("input").keyup(function() {
        var cardValue = $(this).val();
        var result = validateCard(cardValue);
        $('.log').html('Card type: ' + (result.cardType == null ? '-' : result.cardType.name)
            + '<br>Valid: ' + result.valid
            + '<br>Length valid: ' + result.lengthValid
            + '<br>Luhn valid: ' + result.luhnValid);
    });
```

