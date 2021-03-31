import { connect } from 'react-redux';
import MainLayout from './MainLayout.jsx';
import { selectRestaurants } from '../store/selectors/index';
import { fetchRestaurants } from '../store/actions/index';

export const mapStateToProps = (state) => {
  return {
    restaurants: selectRestaurants(state)
  }
};
export const mapDispatchToProps = dispatch => ({
  fetchRestaurants: () => {
    dispatch(fetchRestaurants());
  }
});

const MainLayoutContainer = connect(mapStateToProps, mapDispatchToProps)(MainLayout);

export default MainLayoutContainer;
