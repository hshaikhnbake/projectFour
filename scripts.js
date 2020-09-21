const restaurantApp = {};
restaurantApp.apiKey = 'c3b9d269d039833393ec71329f6b366b';
// scrollTop function
const target = $(this).attr('button');
const smoothScroll = function (target) {
  $('html, body').animate({
    scrollTop: ($(target).offset().top)
  }, 2000);
}
$('#showGallery').click(function () {
  $('header').fadeOut(600, 'linear', function () {
    $('.cityGallery').show(800, 'linear');
  })
})
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
            $('.cityTitle').text(city)
            $('.restaurantList').append(`
              <button class="restaurantButton" value="${resId}">
                <li>
                  <h3>${restaurantDetails.name}</h3>
                  <p>${restaurantDetails.cuisines}</p>
                </li>
              </button>
            `);
            $(".restaurantButton").click(function () {
              const val = $(this).attr("value");
              if (val === resId) {
                const thisRestaurant = restaurant.restaurant;
                $('.restaurantDetails').html(` 
                  <h3>${thisRestaurant.name}</h3>
                  <p>Specialty: ${thisRestaurant.cuisines}</p>
                  <p>Neighborhood: ${restaurantDetails.location.locality}</p>
                  <p>Offerings: <a href='${restaurantDetails.menu_url}' target='_blank'>Menu</a></p>
                `)
                smoothScroll($('.restaurant').show())
              }
            })
          })
        })
      })
    }
    getCityRestaurants(cityId, city);
  })
}
restaurantApp.init = (function () {
  $(".cityButton").click(function () {
    const value = $(this).attr("value");
    getCityInfo(value);
    smoothScroll($('.cityRestaurants').show())
    $('.restaurantList').empty()
  })
})
$(function () {
  restaurantApp.init();
  $('.cityGallery').hide();
});