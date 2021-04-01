import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from './MapContainer.js';
import ReviewFormContainer from './ReviewFormContainer.js';
import './Main.css';

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
  * Construct this component
  */
  constructor(props) {
    super(props);

    this.state = {
      showForm: false
    };
  }

  /**
   * Render the main layout of the site
   * @returns {HTML}
   */
  render() {
    const { restaurants } = this.props;
    const { showForm } = this.state;
    return(
      <div>
        <div className="header">
          <h1 id="title"> Restaurant Reviews </h1>
          {!showForm && (
            <div>
              <button
                className="rm-gradient-button large-margin"
                onClick={() => { this.setState({ showForm: true }); }}
              >
                Review a New Restaurant
            </button>
            </div>
          )}
          {showForm && (
            <ReviewFormContainer
              addRestaurantCallback={() => { this.setState({ showForm: false }); }}
            />
          )}
          </div>
        <MapContainer
          restaurants={restaurants}
        />
      </div>
    );
  }
}

export default MainLayout;
