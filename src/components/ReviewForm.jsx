import React from 'react';
import PropTypes from 'prop-types';
import './Main.css';

/**
 * Review Form Component that allows user to add a restaurant review
 */
class ReviewForm extends React.Component {
  static propTypes = {
    addRestaurantCallback: PropTypes.func.isRequired,
    addRestaurant: PropTypes.func.isRequired
  };

  static defaultProps = {
  };

  /**
   * Render the main layout of the site
   * @returns {HTML}
   */
  render() {
    const { addRestaurantCallback } = this.props;
    return(
      <div>
        <p> Coming Soon </p>
        <button
          className="rm-solid-button large-margin"
          onClick={addRestaurantCallback}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default ReviewForm;
