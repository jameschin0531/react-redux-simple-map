import React, { useEffect, useMemo, useState } from 'react';
import { RecentSearch } from './features/recentSearch/RecentSearch';
import './App.css';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { AutoComplete } from 'antd';
import { pushLocation } from './features/recentSearch/recentSearchSlice';
import { useDispatch } from 'react-redux';

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });


  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return <div className="App">
    <h1>Welcome to Map Search!</h1>
    <Map />
  </div>;
}

function Map() {
  const center = useMemo(() => ({ lat: 3.140853, lng: 101.693207 }), []);
  // console.log();
  const [selected, setSelected] = useState();
  return <div>
    <div className='places-container'>
      <PlaceAutocomplete setSelected={setSelected} />
    </div>
    <GoogleMap
      zoom={10}
      center={selected || center}
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
