import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from './MapContainer.js';


class MainLayout extends React.Component {
  static propTypes = {
    restaurants: PropTypes.arrayOf(PropTypes.object),
    fetchRestaurants: PropTypes.func.isRequired
  };

  static defaultProps = {
    restaurants: []
  };

  componentDidMount() {
    const { fetchRestaurants, restaurants} = this.props;
    if (restaurants.length === 0) {
      fetchRestaurants();
    }
  }


  render() {
    const { restaurants } = this.props;
    return(
      <div>
        <h1> Restaurants </h1>
        <MapContainer
          restaurants={restaurants}
        />
      </div>
    );
  }
}

export default MainLayout;
