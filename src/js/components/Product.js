import {
  select,
  classNames,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    // console.log('new Product:', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;
    /*Wygenerowanie kodu html pojedynczego produktu*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /*stworzenie element DOM na podstawie kodu produktu */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /*znalezienie na stronie kontener menu*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*wstawić stworzony element DOM do znalezionego kontenera menu*/
    menuContainer.appendChild(thisProduct.element);
  }
  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion() {
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    const trigger = thisProduct.accordionTrigger;
    // console.log(trigger);
    // /* START: click event listener to trigger */
    trigger.addEventListener('click', function () {
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      /* find all active products */
      const activeProducts = document.querySelectorAll('.product.active');
      // console.log(activeProducts);
      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct !== thisProduct.element) {
          /* remove class active for the active product */
          activeProduct.classList.toggle('active');
          /* END: if the active product isn't the element of thisProduct */
        }
        /* END LOOP: for each active product */
      }
      /* END: click event listener to trigger */
    });
  }
  initOrderForm() {
    const thisProduct = this;
    // console.log(thisProduct);
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;
    // console.log(thisProduct);

    const form = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    let basePrice = thisProduct.data.price;
    const choices = thisProduct.data.params;

    /* przechodzimy po wyborach */
    for (let choice in choices) {
      const options = choices[choice].options;
      // console.log('Jestem aktualnie w ', choice);
      // console.log('options: ', options);

      thisProduct.params[choice] = {
        label: choices[choice].label,
        options: {},
      };

      // console.log('Przed przejsciem przez opcje', thisProduct.params[choice]);

      /* pechodzimy po opcjach */
      for (let option in options) {
        // console.log('option: ',option);
        const optionVal = options[option];
        // console.log('optionVal: ',optionVal);
        const optionSelected = form[choice].includes(option);
        // console.log('optionSelected: ',optionSelected);
        // console.log('imageForChoiceAndOption choice: ',choice);
        // console.log('imageForChoiceAndOption option: ',option);
        const imageForChoiceAndOption = thisProduct.imageWrapper.querySelectorAll(`.${choice}-${option}`);
        // console.log('imageForChoiceAndOption: ',imageForChoiceAndOption);
        if (optionSelected && !optionVal.default) {
          basePrice += optionVal.price;
        } else if (!optionSelected && optionVal.default) {
          basePrice -= optionVal.price;
        }

        if (optionSelected) {

          // console.log(thisProduct.params[choice]);

          thisProduct.params[choice].options[option] = optionVal.label;

          for (let image of imageForChoiceAndOption) {
            image.classList.add('active');
          }
        } else {
          for (let image of imageForChoiceAndOption) {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    // console.log(thisProduct.params);
    /* pomnożyć cenę przez kwotę */

    thisProduct.priceSingle = basePrice;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;


    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log('paramy:', thisProduct.params);

  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('custom', function () { // za product
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    console.log(thisProduct.name);
    thisProduct.amount = thisProduct.amountWidget.value;

    const productSummary = { //???????????
      id: thisProduct.id,
      priceSingle: thisProduct.priceSingle,
      name: thisProduct.data.name,
      price: thisProduct.price,
      amount: thisProduct.amount,
      params: thisProduct.params
    };

    // app.cart.add(productSummary);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispachEvent(event);
  }
}

export default Product;
