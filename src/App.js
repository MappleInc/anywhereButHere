import './App.css';
// import Directions from './components/Directions';
import Input from './components/Input';
import Header from './Header';
import ListOfPlaces from './components/ListOfPlaces'
import { useEffect, useState } from 'react' 
import Map from './components/Map';

function App() {

  const [userCoords, setUserCoords] = useState([])
  const [userCoordsRadius, setUserCoordsRadius] = useState([])
  const [searchParam, setSearchParam] = useState('')
  const [userInput, setUserInput] = useState('')
  // const [myJourney, setMyJourney] = useState('')
  const [destination, setDestination] = useState([]);
    
  const handleQChange = (event) => {
    setSearchParam(event.target.value);
  }

  const handleFrom = (event) => {
    setUserInput(event.target.value);
  }

  const takeMeThere = (event) => {
    event.preventDefault();
    getDestination();
  }

    function getLocation(event) {
      event.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        // getStreetAddress()
      } else { 
        console.log('no location')
      }
      // console.log(showPosition)
      }
  
      // THE USER COORDS ARE REVERSED! NEED TO FIX IT!
      function showPosition(position) {
        setUserCoords([position.coords.latitude, position.coords.longitude]);
        setUserCoordsRadius([position.coords.longitude, position.coords.latitude, 5000]);
      }
      // console.log(userCoords)
      // console.log(userCoordsRadius)

  //API CALL FOR Q IN USER RADIUS
  const proxiedUrl = 'https://www.mapquestapi.com/search/v4/place';
  const url = new URL('https://proxy.hackeryou.com');
  url.search = new URLSearchParams({
    reqUrl: proxiedUrl,
    'params[location]': userCoords,
    'params[sort]': 'distance',
    'params[key]': 'AhbgCPRoF1OzG1YBICuTKhcx25nl5X5M',
    'params[circle]': userCoordsRadius,
    'params[q]': searchParam,
    'proxyHeaders[Accept]': 'application/json',
  });

  const getDestination = () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data.results[0].displayString);
        setDestination(data.results)
        // console.log(data.results[0].place.geometry.coordinates)
        })
  }

  // API CALL FOR GEOCODING THE USER'S ADDRESS
  // useEffect( () => {
  // const proxiedUrl4 = 'https://www.mapquestapi.com/geocoding/v1/address';
  // const url4 = new URL('https://proxy.hackeryou.com');
  // url4.search = new URLSearchParams({
  //   reqUrl: proxiedUrl4,
  //   'params[key]': 'AhbgCPRoF1OzG1YBICuTKhcx25nl5X5M',
  //   'proxyHeaders[Accept]': 'application/json',
  //   'params[location]': {userInput}
  // });

  // fetch(url4)
  //   .then(response => response.json())
  //   .then(data => {
  //     // console.log(data.results[0].locations[0].latLng);
  //     setUserCoords([data.results[0].locations[0].latLng.lng, data.results[0].locations[0].latLng.lat]);
  //   });
  // }, [])


  // REVERSE GEOLOCATION TO RETURN STREET ADDRESS
  useEffect( () => {
    if (userCoords.length>0) {
      const proxiedGeoUrl = 'http://www.mapquestapi.com/geocoding/v1/reverse';
      const geoUrl = new URL('https://proxy.hackeryou.com');
      geoUrl.search = new URLSearchParams({
        reqUrl: proxiedGeoUrl,
        'params[location]': userCoords,
        'params[key]': 'AhbgCPRoF1OzG1YBICuTKhcx25nl5X5M',
        'proxyHeaders[Accept]': 'application/json',
      });


        fetch(geoUrl)
          .then(response => response.json())
          .then(geodata => {
            // console.log(geodata)
            setUserInput((geodata.results[0].locations[0].street) + ` ` + (geodata.results[0].locations[0].adminArea4) + ` ` + (geodata.results[0].locations[0].adminArea3))
          });
    }
}, [userCoords])

  return (

    <div className="wrapper">
      <Header />
      <Input 
        getLocation={getLocation}
        handleQChange={handleQChange}
        handleFrom={handleFrom}
        userInput={userInput}
        takeMeThere={takeMeThere}
      />
      <ListOfPlaces destination={destination}/>
      {/* <Directions from={userCoords}/> */}
      <Map destination={destination}/>
    </div>
  );
}

export default App;
