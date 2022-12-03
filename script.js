const taxRate = 0.07;
const shippingRate = 10.0;
const fadeTime = 300;

const basketProduct = document.querySelector('.basket-product');
const productList = [];

const products = [
  {
    image:
      'https://images.pexels.com/photos/8101510/pexels-photo-8101510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Product A Super face serum',
    price: 60,
    quantity: 1,
    discount: 'Buy 2 for 100',
  },
  {
    image:
      'https://images.pexels.com/photos/7796376/pexels-photo-7796376.jpeg?auto=compress&cs=tinysrgb&w=1600',
    name: 'Product B Super face serum',
    price: 70,
    quantity: 1,
    discount: 'Buy 2 get 1 free',
  },
  {
    image:
      'https://images.pexels.com/photos/6690879/pexels-photo-6690879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Product C Super moisturizer',
    price: 10,
    quantity: 1,
    discount: undefined,
  },
  {
    image:
      'https://images.pexels.com/photos/12035711/pexels-photo-12035711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Product D Super moisturizer',
    price: 20,
    quantity: 1,
    discount: undefined,
  },
];

window.addEventListener('DOMContentLoaded', function () {
  autohide_nav = document.querySelector('.autohide');
  sticky_nav = document.querySelector('.secondary-nav');

  if (autohide_nav) {
    var last_scroll_top = 0;
    window.addEventListener('scroll', function () {
      let scroll_top = window.scrollY;
      if (scroll_top < last_scroll_top) {
        autohide_nav.classList.remove('scrolled-down');
        autohide_nav.classList.add('scrolled-up');

        sticky_nav.classList.remove('scrolled-up-second-nav');
      } else {
        autohide_nav.classList.remove('scrolled-up');
        autohide_nav.classList.add('scrolled-down');
        sticky_nav.classList.add('scrolled-up-second-nav');
      }
      last_scroll_top = scroll_top;
    });
  }
});

/* actions */
$('button.btn').click(function () {
  removeItem(this);
});

$('.quantity input').change(function () {
  updateQuantity(this);
});

$(document).ready(function () {
  updateSumItems();
});

/* Recalculate cart */
function recalculateCart() {
  var subtotal = 0;

  $('.item').each(function () {
    subtotal += parseFloat(
      $(this)
        .children('div.subtotal-detail')
        .children('.subtotal')
        .text()
        .replace('$', '')
    );
  });

  /* Calculate totals */
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? shippingRate : 0;
  const total = subtotal + tax + shipping;

  /* Update total */
  $('.total-value').fadeOut(fadeTime, function () {
    $('#basket-total').html(`$ ${total.toFixed(2)}`);
    $('.total-value').fadeIn(fadeTime);
  });

  $('.final-value').fadeOut(fadeTime, function () {
    $('#basket-subtotal').html(`$ ${subtotal.toFixed(2)}`);
    $('#basket-total').html(`$ ${total.toFixed(2)}`);
    $('#basket-tax').html(`$ ${tax.toFixed(2)}`);
    $('#basket-shipping').html(`$ ${shipping.toFixed(2)}`);
    if (total == 0) {
      $('.checkout-cta').fadeOut(fadeTime);
    } else {
      $('.checkout-cta').fadeIn(fadeTime);
    }
    $('.final-value').fadeIn(fadeTime);
  });
}

function updateQuantity(quantityInput) {
  /* Calculate line price */
  const productItemRow = $(quantityInput).parent().parent().parent();
  const productDetailRow = $(quantityInput).parent().parent();
  const price = parseFloat(
    productDetailRow
      .children('div.mg-10')
      .children('.price')
      .text()
      .replace('$', '')
  );
  const quantity = parseFloat($(quantityInput).val());
  var linePrice = price * quantity;

  const promoPrice = productDetailRow
    .children('div.mg-10')
    .children('.discount')
    .text();

  if (promoPrice === '(Buy 2 for 100)') {
    const buyCount = 2;
    const checkQuantity = quantity / buyCount;
    const checkIsInteger = Number.isInteger(checkQuantity);
    if (checkIsInteger === true) {
      linePrice = checkQuantity * 100;
    } else {
      linePrice = Math.floor(checkQuantity) * 100 + price;
    }
  } else if (promoPrice === '(Buy 2 get 1 free)') {
    const buyCount = 3;
    const freeCount = 1;
    const rate = Math.floor((quantity / buyCount) * freeCount);

    const dicountPrice = price * rate;

    linePrice = price * quantity - dicountPrice;
  }

  /* Update price  and recalc cart totals */
  productItemRow
    .children('div.subtotal-detail')
    .children('.subtotal')
    .each(function () {
      $(this).fadeOut(fadeTime, function () {
        $(this).text(`$ ${linePrice.toFixed(2)}`);
        recalculateCart();
        $(this).fadeIn(fadeTime);
      });
    });

  productItemRow
    .children('div.product-details')
    .children('div.product-name')
    .find('.item-quantity')
    .text(quantity);
  updateSumItems();
}

/* Remove item from summary */
function removeItem(removeButton) {
  var productRow = $(removeButton).parent().parent().parent();
  console.log(productRow);

  productRow.slideUp(fadeTime, function () {
    productRow.remove();
    recalculateCart();
    updateSumItems();
  });
}

function updateSumItems() {
  var sumItems = 0;
  $('.quantity input').each(function () {
    sumItems += parseInt($(this).val());
  });
  $('.total-items').text(sumItems);
}
