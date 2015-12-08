# Collection Validations

Validation rules for fields can be set when defining the schema:

### Single rule

```js
db.createCollection({
  schema: {
    email: {
      type: 'string',
      validate: {
        rule: 'isEmail',
        message: 'Please enter a valid email address'
      }
    }
  }
});
```

### Multiple rules

```js
{
  email: {
    type: 'string',
    validate: [
      {
        rule: 'isLowercase',
        message: 'Please enter email address in lowercase',
      },
      {
        rule: 'isEmail',
        message: 'Please enter a valid email address'
      }
    ]
  }
}
```

### Rule with options

```js
{
  fruit: {
    type: 'string',
    validate: {
      rule: [
       'isIn', // `isIn` is the rule name
       [
         'apple',
         'banana'
       ] // this array is passed as an argument to rule function
      ],
      message: 'Must be either apple or banana'
    }
  }
}
```

### Rule as a function

```js
{
  mood: {
    type: 'string',
    validate: {
      rule: function (field, value) {
        return true;
      }
    }
  }
}
```

### Asynchronous rule

```js
{
  food: {
    type: 'string',
    validate: {
      rule: function (field, value, done) {
        checkIfFoodIsHealthy(value, function (healthy) {
          var isHealthy = healthy === true;
          done(isHealthy);
        });
      }
    }
  }
}
```

### Available rules

By default, all the validation rules from [Validator.js](https://github.com/chriso/validator.js#validators) are available:

- **equals(str, comparison)** - check if the string matches the comparison.
- **contains(str, seed)** - check if the string contains the seed.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail(str [, options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isNumeric(str)** - check if the string contains only numbers.
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isBase64(str)** - check if a string is base64 encoded.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isLowercase(str)** - check if the string is lowercase.
- **isUppercase(str)** - check if the string is uppercase.
- **isInt(str [, options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`).
- **isFloat(str [, options])** - check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`).
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isNull(str)** - check if the string is null.
- **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate(str)** - check if the string is a date.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isCreditCard(str)** - check if the string is a credit card.
- **isISIN(str)** - check if the string is an [ISIN][ISIN] (stock/security identifier).
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isMobilePhone(str, locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM']`).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
- **isMongoId(str)** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
- **isCurrency(str, options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.

Example usage of the above mentioned rules:

```js
db.createCollection({
  schema: {
    title: {
      // direct rule
      validate: {
        rule: 'isAlphanumeric'
      }
    },
    body: {
      // rule with options
      validate: {
        rule: ['isLength', min, max]
      }
    }
  }
});
```

But of course, you can always override them or add new custom rules.

### Custom rules

Validation rules can be defined when creating a Collection class:

```js
var Posts = db.createCollection({
  schema: {
    name: {
      type: 'string',
      validate: {
        rule: 'myFirstRule'
      }
    },
    title: {
      type: 'string',
      validate: {
        rule: [
          'myRuleWithOptions',
          'arg1 value',
          'arg2 value'
        ]
      }
    }
  },

  validationRules: {
    myFirstRule: function (field, value) {
      return true; // validated successfully
    },
    myRuleWithOptions: function (field, value, arg1, arg2) {
      return true;
    },
    myAsyncRule: function (field, value, done) {
      doSomething(value, function (result) {
        var validated = result === true;
        done(validated);
      });
    }
  }
});
```

### Required fields

By default, validation rules are only checked against fields that are set.

But if you wish to make sure that certain fields are required, meaning they should always be present, you can mark them as required in your schema:

```js
var Posts = db.createCollectionClass({
  schema: {
    name: {
      type: 'string',
      validate: {
        rule: 'isAlpha',
        required: true, // here
        message: 'Must be alphabets only'
      }
    }
  }
});
```
