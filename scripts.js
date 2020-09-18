    const cities = ['Beirut', 'New Orleans', 'Florence', 'Rome', 'Charleston', 'Singapore', 'Paris', 'New York City', 'Bologna', 'Chicago']

    $(function () {

      const restaurantApp = {};

      restaurantApp.apiKey = 'f2af26c3d6f76bd1f3cc5cba0be539fa';

      function getCityDetails(city) {
        return $.ajax({
          url: `https://developers.zomato.com/api/v2.1/locations?query=${city}`,
          dataType: 'JSON',
          method: 'GET',
          headers: {
          'user-key': restaurantApp.apiKey
          }
          
        }).then((res) => {
          const cityId = res['location_suggestions'][0].entity_id;
          const cityTitle = res['location_suggestions'][0].title;
          function getCityRestaurants(cityId, city) {
            return $.ajax({
          url: `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${city}&count=10&sort=rating&order=desc`,
              dataType: 'JSON',
              method: 'GET',
              headers: {
          'user-key': restaurantApp.apiKey
              }
            }).then((res) => {
              const cityRestaurants = res;
              console.log(res);
              const restaurantList = cityRestaurants['restaurants'];
              restaurantList.forEach((restaurant) => {

          $.each(restaurant, function (key, value) {
            const restaurantDetails = value;
            // console.log(restaurantDetails);
            console.log(restaurantDetails.name);

            $('.cityTitle').text(cityTitle)
            
            $('.restuarantList').append(`
                    <button>
                      <li>
                        <h3>${restaurantDetails.name}</h3>
                        <p>${restaurantDetails.cuisines}</p>
                      </li>
                    </button>
                  `);
          })
        })
            })
          }
          getCityRestaurants(cityId, cities[0]);
        })
      }
      getCityDetails(cities[0]);
    });