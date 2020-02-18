/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      // thisProduct.processOrder();
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
    }
    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      // console.log(trigger);
      // /* START: click event listener to trigger */
      trigger.addEventListener('click', function () {
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.add('active');
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
      console.log(thisProduct);
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
      });
    }

    processOrder() {
      const thisProduct = this;
      console.log(thisProduct);

      const form = utils.serializeFormToObject(thisProduct.form);
      let basePrice = thisProduct.data.price;
      const choices = thisProduct.data.params;

      /* przechodzimy po wyborach */
      for (let choice in choices) {
        const options = choices[choice].options;
        // console.log('Jestem aktalnie w ', choice);

        /* pechodzimy po opcjach */
        for (let option in options) {

          console.log(choice, form[choice]);
          const optionVal = options[option];
          const optionSelected = form[choice].includes(option);

          if (optionSelected && !optionVal.default) {
            basePrice += optionVal.price;
          }

          if (!optionSelected && optionVal.default) {
            basePrice -= optionVal.price;
          }
          const imageForChoiceAndOption = thisProduct.element.querySelector(`.${choice}-${option}`);
          if (imageForChoiceAndOption) {
            if (optionSelected) imageForChoiceAndOption.classList.add('active');
            else imageForChoiceAndOption.classList.remove('active');
          }
        }
      }

      thisProduct.priceElem.innerHTML = basePrice;
    }
  }

  const app = {
    initMenu: function () {
      const thisApp = this;
      // console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
