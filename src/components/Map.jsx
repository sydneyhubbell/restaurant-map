import React from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-loader';
import { arcgisApiKey } from '../data/apiKeys.js';
import './Map.css';

/**
 * Map Component that displays restaurants geographically
 */
export default class Map extends React.Component {
  static propTypes = {
    zoom: PropTypes.number,
    center: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    restaurants: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      stars: PropTypes.number,
      review: PropTypes.string
    }))
  };
  static defaultProps = {
    zoom: 12,
    center: { latitude: 42.35879, longitude: -71.05610 }, // Boston
    restaurantList: []
  };

  /**
   * Construct this Map component
   * @param {any} props the Component's props
   */
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      view: null,
      restaurantLayer: null,
      zoom: props.zoom
    }
  }

  /**
   * Upon mounting, instantiate the Esri Arcgis Map
   * For more documentation: https://developers.arcgis.com/javascript/latest/api-reference/
   * @returns {void}
   */
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

  /**
   * Once the Basemap has been created, finish setting up the map by
   * loading features and adding widgets
   * @returns {void}
   */
  setupMap = (map, view) => {
    this.setState({ map, view });
    loadModules(['esri/widgets/Editor', 'esri/geometry/support/webMercatorUtils', 'esri/layers/FeatureLayer'], {})
      .then(([Editor, webMercatorUtils, FeatureLayer]) => {

        const restaurantGraphics = this.createGraphics(webMercatorUtils);

        const restaurantLayer = this.createLayer(restaurantGraphics, FeatureLayer);

        this.state.map.add(restaurantLayer);

        // Create the Editor
        const editor = new Editor({ view });
        // Add widget to top-right of the view
        this.state.view.ui.add(editor, "top-right");
      });
  }

  /**
  * Create a list of Esri Graphics, one per restaurant
  * @param {any} webMercatorUtils an ESRI object for formatting geometries
  * @returns {array} the list of restaurant Graphics
  */
  createGraphics = (webMercatorUtils) => {
    const { restaurants } = this.props;

    return restaurants.map((restaurant) => {
      const point = {
        type: 'point',
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
      };
      const geometry = webMercatorUtils.geographicToWebMercator(point);
      return {
        geometry,
        attributes: {
          name: restaurant.name,
          rating: restaurant.stars,
          review: restaurant.review
        }
      };
    });
  }

  /**
  * Create a Feature Layer containing the restaurant Graphics
  * @param {array} restaurantGraphics the list of restaurant Graphics
  * @param {any} FeatureLayer the Feature Layer Esri object
  * @returns {any} the feature layer
  */
  createLayer = (restaurantGraphics, FeatureLayer) => {
    return new FeatureLayer({
      source: restaurantGraphics,
      fields: [{
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "name",
        alias: "Name",
        type: "string"
      },
      {
        name: "rating",
        alias: "Rating",
        type: "double"
      },
      {
        name: "review",
        alias: "Review",
        type: "string"
      }],
      objectIdField: "ObjectID",
      geometryType: "point",
      renderer: {
        type: "simple",
        symbol: {
          type: 'picture-marker',
          url: `${process.env.PUBLIC_URL}/assets/restaurant-icon.svg`,
          width: '15px',
          height:'15px'
        }
      },
      popupTemplate: {
        title: 'Restaurant',
        content: [{
          type: 'fields',
          fieldInfos: [{
            fieldName: 'name',
            label: 'Name',
            visible: true
          }, {
            fieldName: 'rating',
            label: 'Rating',
            visible: true
          }, {
            fieldName: 'review',
            label: 'Review',
            visible: true
          }]
        }]
      }
    });
  }


  /**
   * Render the Map Component
   * @returns {HTML}
   */
  render() {
    return(
      <div className='restaurant-map-div' id='restaurantMap' />
    );
  }
}
