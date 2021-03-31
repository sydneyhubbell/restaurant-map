import { connect } from 'react-redux';
import Map from './Map.jsx';

export const mapStateToProps = (state, ownProps) => {
  return {
    restaurants: ownProps.restaurants
  };
};
export const mapDispatchToProps = null;

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
