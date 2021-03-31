import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from './MapContainer.js';

/**
 * Main Layout Component that holds the contents of the site
 */
class MainLayout extends React.Component {
  static propTypes = {
    restaurants: PropTypes.arrayOf(PropTypes.object),
    fetchRestaurants: PropTypes.func.isRequired
  };

  static defaultProps = {
    restaurants: []
  };

  /**
   * Upon mounting, if there are no restaurants loaded, fetch them
   * @returns {void}
   */
  componentDidMount() {
    const { fetchRestaurants, restaurants} = this.props;
    if (restaurants.length === 0) {
      fetchRestaurants();
    }
  }

  /**
   * Render the main layout of the site
   * @returns {HTML}
   */
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
