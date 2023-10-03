window.addEventListener('DOMContentLoaded', function () {

  const {template} = document.querySelector('body').dataset;
  console.log(template)
  
  // button to clear all items in cart  
  const currentURL = (window.location.href).split('/');
  console.log(currentURL);
  
  if ( currentURL.includes('cart') ) {
    const $button = document.querySelector('#clear-cart-items');
    $button.addEventListener('click', async function (e) {
      let response = await fetch('/cart/clear.js');
      if (response.ok) window.location.reload();
    });
  }


  
  // home page sections using tabs 
  if (template == "index") {
    const tabButtons = [...document.querySelectorAll('.jm-3-collections-with-tabs .tab-buttons > li')];
    const tabContents = [...document.querySelectorAll('.jm-3-collections-with-tabs .tab-content > .tab')];
  
    tabButtons.forEach(button => {
      button.addEventListener('click', e => {
        tabButtons.map(but => but.classList.remove('active'));
        button.classList.add('active');
  
        let {collection:id} = button.dataset;
        tabContents.map(but => but.classList.remove('active'));
        tabContents.find(tab => tab.dataset.collection === id).classList.add('active');
      });
    });
  }

  // free shipping progress bar 
  let freeShippingContainer = document.querySelector('#jm-free-shipping-bar');
  if ( template == "cart" && freeShippingContainer ) {
    Shopify.freeShipping = (function () {
     let { fsMessage, fsUnlock, fsPromote, max} = freeShippingContainer.dataset;

      function update () {
        fetch('/cart/update.js')
          .then(response => response.json())
          .then(res => {
            let {item_count, total_price} = res;
            if (!item_count) {
              document.querySelector('.jm-free-shipping-bar__message').innerText = fsUnlock;
              document.querySelector('#jm-free-shipping-bar .progress-bar progress').setAttribute('value', 0);
            } else {
              if ( total_price >= max) {
                document.querySelector('.jm-free-shipping-bar__message').innerText = fsMessage;
                document.querySelector('#jm-free-shipping-bar .progress-bar progress').setAttribute('value', max);
              } else {
                let left = '$'+(max - total_price) / 100; 
                document.querySelector('.jm-free-shipping-bar__message').innerText = fsPromote.replace('[value]', left)
                document.querySelector('#jm-free-shipping-bar .progress-bar progress').setAttribute('value', total_price);
              }
            }               
          });
      }
      return {
        update: update
      }
    })(); 
  }
  
}); //DOMContentLoaded event
