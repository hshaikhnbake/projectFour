const restaurantApp = {};
restaurantApp.apiKey = 'c3b9d269d039833393ec71329f6b366b';

// scrollTop function
const target = $(this).attr('button');
const smoothScroll = function (target) {
  $('html, body').animate({
    scrollTop: ($(target).offset().top)
  }, 2000);
}

function getCityInfo(city) {
  return $.ajax({
    url: `https://developers.zomato.com/api/v2.1/locations?query=${city}&count=1`,
    dataType: 'JSON',
    method: 'GET',
    headers: {
      'user-key': restaurantApp.apiKey
    }
  }).then((res) => {
    const cityId = res['location_suggestions'][0].entity_id
    getCityRestaurants(cityId, city);
  })
}

function getCityRestaurants(cityId, city) {
  return $.ajax({
    url: `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${city}&count=10&sort=rating&order=desc`,
    dataType: 'JSON',
    method: 'GET',
    headers: {
      'user-key': restaurantApp.apiKey
    }
  }).then((res) => {
    const restaurantList = res['restaurants'];
    restaurantList.forEach((restaurant) => {

      $.each(restaurant, function (key, value) {
        const restaurantDetails = value;
        const resId = restaurantDetails.id

        const restoListToAppend = `
          <button class="restaurantButton" value="${resId}">
            <li>
              <h3>${restaurantDetails.name}</h3>
              <p>${restaurantDetails.cuisines}</p>
            </li>
          </button>
        `;

        $('.cityTitle').text(city)
        $('.restaurantList').append(restoListToAppend);


        $(".restaurantButton").click(function () {
          const val = $(this).attr("value");
          $('.restaurant').fadeIn();
          smoothScroll($('.restaurantDetails'));
          $('#anotherResto').fadeIn();
          $('footer').fadeIn();

          if (val === resId) {
            const thisRestaurant = restaurant.restaurant;
            const restoToAppend = ` 
              <h3>${thisRestaurant.name}</h3>
              <p><span class="underline">Specialty</span>: ${thisRestaurant.cuisines}</p>
              <p><span class="underline">Neighborhood</span>: ${thisRestaurant.location.locality}</p>
              <p><span class="underline">Offerings</span>: <a href='${thisRestaurant.menu_url}' target='_blank'>Menu</a></p>
              <p><span class="underline">Worldwide Rating</span>: ${thisRestaurant.user_rating.aggregate_rating}/5⭐</p>
            `;

            $('.restaurantDetails').html(restoToAppend);
          }
        })
      })
    })
  })
}
restaurantApp.init = (function () {
  $('#showGallery').click(function () {
    $('header').fadeOut(600, 'linear', function () {
      $('.cityGallery').fadeIn();
    })
  })

  $('.cityButton').click(function () {
    const value = $(this).attr("value");
    getCityInfo(value);
    $('.cityGallery').fadeOut();
    $('.cityRestaurants').fadeIn();
    smoothScroll($('.cityRestaurants'));
    setTimeout(function() {
      $('#anotherCity').fadeIn(600);
    }, 5000);
  })
  

  $('#anotherCity').click(function () {
    $('.cityGallery').show();
    $('.restaurantList').empty();
    $('.cityRestaurants').hide();
    smoothScroll($('.cityGallery'));
  })

  $('#anotherResto').click(function () {
    $('.restaurant').fadeOut();
    $('#anotherResto').fadeOut();
    $('footer').hide();
    $('.cityRestaurants').fadeIn();
  })
})
$(function () {
  restaurantApp.init();
  $('.cityGallery').hide();
  $('footer').hide();
  $('.restaurant').hide();
});