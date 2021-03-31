import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from './MapContainer.js';


class MainLayout extends React.Component {
  static propTypes = {

  };

  static defaultProps = {

  };


  render() {
    return(
      <div>
        <h1> Restaurants </h1>
        <MapContainer />
      </div>
    );
  }
}

export default MainLayout;
