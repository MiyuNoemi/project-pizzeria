import {
  select,
  templates
} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(bookElem) {
    const thisBooking = this;
    thisBooking.render(bookElem);
    thisBooking.initWidgets();
  }
  render(element) { //argument, który otrzymuje z app.initBooking
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget(); //generować kod HTML
    thisBooking.dom = {}; //pusty obiekt
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}



export default Booking;
