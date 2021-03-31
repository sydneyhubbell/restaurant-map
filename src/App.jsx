import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import MainLayoutContainer from 'src/MainLayoutContainer';


const App = () => {
  return (
    <Provider store={store}>
      <MainLayoutContainer />
    </Provider>
  );
}

export default App;
