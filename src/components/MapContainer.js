import { connect } from 'react-redux';
import { updateRestaurant, deleteRestaurant } from '../store/actions/index';
import Map from './Map.jsx';

export const mapStateToProps = (state, ownProps) => {
  return {
    restaurants: ownProps.restaurants
  };
};
export const mapDispatchToProps = dispatch => ({
  updateRestaurant: (restaurant) => {
    dispatch(updateRestaurant(restaurant));
  },
  deleteRestaurant: (id) => {
    dispatch(deleteRestaurant(id));
  }
});

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
