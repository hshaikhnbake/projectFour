
    const cities = ['Beirut', 'Charleston, South Carolina', 'Chicago', 'Florence', 'New Orleans', 'New York City', 'Milan', 'Rome', 'Paris', 'Singapore']

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
        function getCityRestaurants(cityId, city) {
        return $.ajax({
    url: `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${city}&count=10&sort=rating&order=desc`,
            dataType: 'JSON',
            method: 'GET',
            headers: {
    'user-key': restaurantApp.apiKey
            }
        }).then((res) => {
    console.log(res);
        })

        }
        getCityRestaurants(cityId, cities[0]);
    })
    }
    getCityDetails(cities[0]);

});