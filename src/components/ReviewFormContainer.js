import { connect } from 'react-redux';
import ReviewForm from './ReviewForm.jsx';
import { addRestaurant } from '../store/actions/index';
import './Main.css';

export const mapStateToProps = (state, ownProps) => {
  return {
    addRestaurantCallback: ownProps.addRestaurantCallback
  };
};
export const mapDispatchToProps = dispatch => ({
  addRestaurant: (restaurant) => {
    dispatch(addRestaurant(restaurant));
  }
});

const ReviewFormContainer = connect(mapStateToProps, mapDispatchToProps)(ReviewForm);

export default ReviewFormContainer;
