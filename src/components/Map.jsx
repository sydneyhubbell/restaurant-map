import React from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-loader';
import { arcgisApiKey } from '../apiKeys.js';
import './Map.css';


export default class Map extends React.Component {
  static propTypes = {
    zoom: PropTypes.number,
    center: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })
  };
  static defaultProps = {
    zoom: 12,
    center: { latitude: 42.35879, longitude: -71.05610 } // Boston
  };

  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      zoom: props.zoom
    }
  }

  componentDidMount() {
    const { zoom, center } = this.props;
    loadModules(['esri/config', 'esri/Map', 'esri/views/MapView'], {})
      .then(([esriConfig, Map, MapView]) => {
        esriConfig.apiKey = arcgisApiKey;
        const map = new Map({
          basemap: 'arcgis-light-gray'
        });
        const view = new MapView({
          container: 'restaurantMap',
          map,
          zoom,
          center: [center.longitude, center.latitude]
        });
        view.when(() => {
          this.setupMap(map, view);
        });
      });
  }

  setupMap = (map, view) => {
    this.setState({ map, view });

    loadModules(['esri/widgets/Editor'], {})
      .then(([Editor]) => {
        // Create the Editor
        const editor = new Editor({ view });
        // Add widget to top-right of the view
        view.ui.add(editor, "top-right");
      });
  }

  render() {
    return(
      <div className='restaurant-map-div' id='restaurantMap' />
    );
  }
}
