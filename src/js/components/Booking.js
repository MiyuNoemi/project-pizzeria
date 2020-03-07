import {
  select,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';
import AmountWidget from './amountWidget.js';

class Booking {
  constructor(bookElem) {
    const thisBooking = this;
    thisBooking.render(bookElem);
    thisBooking.initWidgets();
  }
  render(bookElem) { //argument, który otrzymuje z app.initBooking
    const thisBooking = this;
    console.log('book elem:', bookElem);
    const generatedHTML = templates.bookingWidget(); //generować kod HTML
    thisBooking.dom = {}; //pusty obiekt
    thisBooking.dom.wrapper = bookElem; //zapisywać do tego obiektu właściwość wrapper z argu.
    const generatedDOM = utils.createDOMFromHTML(generatedHTML); //zawartość wrappera zamieniać na kod HTML
    thisBooking.dom.wrapper.appendChild(generatedDOM);
    thisBooking.dom.peopleAmount = select.booking.peopleAmount;
    thisBooking.dom.hoursAmount = select.booking.hoursAmount;

  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}



export default Booking;
