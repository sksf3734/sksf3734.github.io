class linkedNumAndRange {
  /**
   * 
   * @param {HTMLElement} parent
   * @param {string} idPrefix 
   * @param {number} min
   * @param {number} max
   * @param {number} step
   */
  constructor(parent, idPrefix, min = 0, max = 1, step = 0.01) {
    var numElement = document.createElement("input");
    var rangeElement = document.createElement("input");
    numElement.type = "number";
    numElement.id = idPrefix + "_number";
    rangeElement.type = "range";
    rangeElement.id = idPrefix + "_range";
    numElement.value = rangeElement.value = min;
    numElement.min = rangeElement.min = min;
    numElement.max = rangeElement.max = max;
    numElement.step = rangeElement.step = step;
    this.inputRange = parent.appendChild(rangeElement);
    this.inputNum = parent.appendChild(numElement);
    this.inputNum.addEventListener("input", (e) =>
      (this.inputRange.value = this.inputNum.value))

    this.inputRange.addEventListener("input", (e) =>
      (this.inputNum.value = this.inputRange.value))

  }
  /**
   * @param {string} className
   */
  set class(className) {
    this.inputNum.className = className;
    this.inputRange.className = className;
  }
}