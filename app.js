function Calculator() {
  this.dom = new DOM();

  var billValue = this.dom.selectSingleElement("#bill"),
    qualityValue = this.dom.selectSingleElement("#quality"),
    peopleNumber = this.dom.selectSingleElement("#people");

  // The tip initialized here because it depends on DOM
  // which is available only in the root
  this.tip = new Tip();
  this.validator = new Validator();
  this.run = function (event) {
    event.preventDefault();
    this.tipValues = {
      bill: billValue.value,
      quality: qualityValue.value,
      people: peopleNumber.value,
    };

    let error = this.validator.validateObject(this.tipValues);
    if (error) {
      return this.dom.showError(error);
    }
    var result = this.tip.calculate(this.tipValues);
    this.dom.showResult(result.toFixed(3));
  };
}

function DOM() {}
/**
 * Parameter object structure: { tagName: string, className: string, content: string }
 *
 * @param {object} item
 */
DOM.prototype.createElement = function (item) {
  var $element = document.createElement(item.tagName);

  if (item.className) {
    $element.className = item.className;
  }
  if (item.content) {
    $element.innerHTML = item.content;
  }
  return $element;
};
DOM.prototype.selectSingleElement = function (query) {
  return document.querySelector(query);
};
/**
 * @param {number} result
 */
DOM.prototype.showResult = function (result) {
  var $resultCard = this.selectSingleElement(".card__result"),
    $resultContent = this.selectSingleElement(".card__result__content");

  $resultContent.textContent = result;
  $resultCard.style.display = "block";
};
DOM.prototype.showError = function (errorMessage) {
  var $resultCard = this.selectSingleElement(".card__result"),
    errorParagraph = {
      tagName: "p",
      className: "error-message",
      content: errorMessage,
    };
  $errorParagraph = this.createElement(errorParagraph);

  form.insertAdjacentElement("afterend", $errorParagraph);
  setTimeout(function () {
    $errorParagraph.remove();
  }, 2000);
  $resultCard.style.display = "none";
};

function Tip() {}
/**
 * Parameter object structure: { bill: string, quality: string, people: string }
 */
Tip.prototype.calculate = function (tipObject) {
  var bill = Number(tipObject.bill),
    peopleNumber = Number(tipObject.people),
    quality = Number(tipObject.quality),
    result = (bill / peopleNumber) * quality;

  return result;
};

function Validator() {
  var emptyErrorCheck = function (value) {
    if (value.length === 0) {
      return { status: false, message: "Values can not be empty !" };
    } else {
      return true;
    }
  };
  var negativeErrorCheck = function (value) {
    if (value < 0) {
      return { status: false, message: "Values can not be negative !" };
    } else {
      return true;
    }
  };
  var zeroErrorCheck = function (value) {
    // Here the loose equality is to permit coercion
    // If coercion is not permitted, the value should be converted into number first
    // that's because the type of input values are always string
    if (value == 0 && value.length !== 0) {
      return { status: false, message: "Values can not be zero !" };
    } else {
      return true;
    }
  };

  var valueErrorCheck = function (value) {
    var rules = [zeroErrorCheck, emptyErrorCheck, negativeErrorCheck],
      message;

    for (
      var ruleIndex = 0, rulesLength = rules.length;
      ruleIndex < rulesLength;
      ruleIndex++
    ) {
      console.log(rules[ruleIndex].name, rules[ruleIndex](value));
      if (
        typeof rules[ruleIndex](value) === "object" &&
        !rules[ruleIndex](value).status
      ) {
        message = rules[ruleIndex](value).message;
      }
    }

    return message;
  };

  this.validateObject = function (tipObject) {
    var errorMessage,
      // Needs polyfill
      tipValues = Object.values(tipObject);

    for (
      var valueIndex = 0, length = tipValues.length;
      valueIndex < length;
      valueIndex++
    ) {
      errorMessage = valueErrorCheck(tipValues[valueIndex]);
      if (errorMessage) break;
    }
    return errorMessage;
  };
}

var calculator = new Calculator(),
  form = document.querySelector(".tip-form");
form.addEventListener("submit", function (e) {
  return calculator.run(e);
});
