import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import { RecentSearch } from './features/recentSearch/RecentSearch';
import './App.css';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { AutoComplete } from 'antd';
import { pushLocation } from './features/recentSearch/recentSearchSlice';
import { useDispatch } from 'react-redux';

// function renderBoilerplate() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <Counter />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <span>
//           <span>Learn </span>
//           <a
//             className="App-link"
//             href="https://reactjs.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux-toolkit.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux Toolkit
//           </a>
//           ,<span> and </span>
//           <a
//             className="App-link"
//             href="https://react-redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React Redux
//           </a>
//         </span>
//       </header>
//     </div>
//   );
// }

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });


  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 3.140853, lng: 101.693207 }), []);
  const [selected, setSelected] = useState(null);
  return <div>
    <h1>Welcome to Map Search!</h1>
    <div className='places-container'>
      <PlaceAutocomplete setSelected={setSelected} />
    </div>
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="map-container">
      {selected && <Marker position={selected} />}
    </GoogleMap>
  </div>
}

const PlaceAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const [suggestList, setSuggestList] = useState([]);
  const dispatch = useDispatch();

  const handleSelect = async (address) => {
    setValue(address, false);
    dispatch(pushLocation(address));
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  const getSuggestionValue = () => {
    if (status === "OK") {
      setSuggestList(data.map(({ description }) => (
        { label: description, value: description }
      )));
    }
  }

  useEffect(() => {
    getSuggestionValue()
  }, [value]);


  return (
    <>
      <AutoComplete
        value={value}
        options={suggestList}
        style={{ width: 200 }}
        onSelect={(payload) => handleSelect(payload)}
        onChange={(e) => setValue(e)}
      />
      <p>Recent Searches:</p>
      <RecentSearch />
    </>
  )
};

export default App;
