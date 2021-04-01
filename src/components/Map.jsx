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
      webMercatorUtils: null,
      FeatureLayer: null,
      AttachmentsContent: null,
      CustomContent: null
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
    // Load the Esri Modules once, and store them in the state for future use
    loadModules(['esri/widgets/Editor', 'esri/geometry/support/webMercatorUtils',
    'esri/layers/FeatureLayer', 'esri/popup/content/AttachmentsContent',
    'esri/popup/content/CustomContent'], {})
      .then(([Editor, webMercatorUtils, FeatureLayer, AttachmentsContent, CustomContent]) => {
        this.setState({
          map,
          view,
          webMercatorUtils,
          FeatureLayer,
          AttachmentsContent,
          CustomContent
        }, () => {
          // create the Graphics
          const restaurantGraphics = this.createGraphics();
          // Add those graphics to a new Feature layer
          this._restaurantLayer = this.createLayer(restaurantGraphics);
          // add the layer to the map
          this.state.map.add(this._restaurantLayer);
          // configure the editor
          this._editor = new Editor({
            view,
            container: document.createElement("div"),
            layerInfos: [{
              layer: this._restaurantLayer,
              fieldConfig: [{
                name: "name",
                label: "Name",
                editable: true
              }, {
                name: "category",
                label: "Category",
                editable: true
              }, {
                name: "rating",
                label: "Rating",
                editable: true
              }, {
                name: "review",
                label: "Review",
                editable: true
              }]
            }]
          });
          this.configureEditor();
      });
    });
  }

  /**
  * Create a list of Esri Graphics, one per restaurant
  * @returns {array} the list of restaurant Graphics
  */
  createGraphics = () => {
    const { restaurants } = this.props;
    const { webMercatorUtils } = this.state;

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
          category: restaurant.category,
          review: restaurant.review,
        }
      };
    });
  }

  /**
  * Create a Feature Layer containing the restaurant Graphics
  * @param {array} restaurantGraphics the list of restaurant Graphics
  * @returns {any} the feature layer
  */
  createLayer = (restaurantGraphics) => {
    const { FeatureLayer } = this.state;
    // specify the fields that each graphic will contain
    const fields = [
      { name: "ObjectID", alias: "ObjectID", type: "oid"},
      { name: "name", alias: "Name", type: "string" },
      { name: "rating", alias: "Rating",type: "double" },
      { name: "category", alias: "Category", type: "string" },
      { name: "review", alias: "Review", type: "string"}
    ];

    const editThisAction = {
      title: "Edit",
      id: "edit-this",
      className: "esri-icon-edit"
    };

    /* Create a popupTemplate for the featurelayer and pass in a function to
    set its content and specify an action to handle editing the selected feature */
    this._template = {
      title: "{name}",
      outFields: ["*"],
      content: this.generateTemplateContent,
      fieldInfos: [
        { fieldName: "name" },
        { fieldName: "rating" },
        { fieldName: "category" },
        { fieldName: "review" }
      ],
      actions: [editThisAction]
    };

    return new FeatureLayer({
      source: restaurantGraphics,
      fields,
      popupTemplate: this._template,
      outFields: ["*"],
      objectIdField: "ObjectID",
      geometryType: "point",
      editingEnabled: true,
      renderer: {
        type: "simple",
        symbol: {
          type: 'picture-marker',
          url: `${process.env.PUBLIC_URL}/assets/restaurant-icon.svg`,
          width: '25px',
          height:'25px'
        }
      }
    });
  };

  /** Creates two popup elements for the template: attachments and custom text
   * @param {any} feature the feature to create a popup for
   * @returns {array} the popup elements
   */
  generateTemplateContent = (feature) => {
    const { AttachmentsContent, CustomContent } = this.state;
    // 1. Set how the attachments should display within the popup
    const attachmentsElement = new AttachmentsContent({
      displayType: "list"
    });

    // This custom content element contains formatted popup content
    const customElement = new CustomContent({
      outFields: ["*"],
      creator: function (event) {
        return (
          `${event.graphic.attributes.rating}/5 stars
          <ul>
              <li>${event.graphic.attributes.category}</li>
              <li>${event.graphic.attributes.review}</li>
            </ul>
        `);
      }
    });

    return [customElement, attachmentsElement];
  };

  /**
   * Setup listeners and action handling for the Editor widget
   * @returns {void}
   */
  configureEditor = () => {
    const { view } = this.state;
    const _this = this;

    // Event handler that fires each time an action is clicked
    view.popup.on("trigger-action", function (event) {
      if (event.action.id === "edit-this") {
        _this.editThis();
      }
    });

    // Watch when the popup is visible
    view.popup.watch("visible", (event) => {
      // Check the Editor's viewModel state, if it is currently open and editing existing features, disable popups
      if (_this._editor.viewModel.state === "editing-existing-feature") {
        view.popup.close();
      } else {
        // Grab the features of the popup
        _this._features = view.popup.features;
      }
    });

    // Apply edits to the restaurant layer
    _this._restaurantLayer.on("apply-edits", () => {
      // Once edits are applied to the layer, remove the Editor from the UI
      view.ui.remove(_this._editor);

      // Iterate through the features
      _this._features.forEach((feature) => {
        // Reset the template for the feature if it was edited
        feature.popupTemplate = _this._template;
      });
      // Cancel the workflow so that once edits are applied, a new popup can be displayed
      _this._editor.viewModel.cancelWorkflow();
    });
  }

  /** Execute each time the "Edit feature" action is clicked
   * @returns {void}
   */
  editThis = () => {
    const { view } = this.state;
    const _this = this;
    // If the EditorViewModel's activeWorkflow is null, make the popup not visible
    if (!_this._editor.viewModel.activeWorkFlow) {
      view.popup.visible = false;
      // Call the Editor update feature edit workflow
      _this._editor.startUpdateWorkflowAtFeatureEdit(view.popup.selectedFeature);
      view.ui.add(_this._editor, "top-right");
      view.popup.spinnerEnabled = false;
    }

    // We need to set a timeout to ensure the editor widget is fully rendered. We
    // then grab it from the DOM stack
    setTimeout(function () {
      // Use the editor's back button as a way to cancel out of editing
      let arrComp = _this._editor.domNode.getElementsByClassName(
        "esri-editor__back-button esri-interactive");
      if (arrComp.length === 1) {
        // Add a tooltip for the back button
        arrComp[0].setAttribute("title", "Cancel edits, return to popup");
        // Add a listerner to listen for when the editor's back button is clicked
        arrComp[0].addEventListener('click', function (evt) {
          // Prevent the default behavior for the back button and instead remove the editor and reopen the popup
          evt.preventDefault();
          _this._editor.viewModel.cancelWorkflow();
          view.ui.remove(_this._editor);
          view.popup.open({
            features: _this._features
          });
        });
      }
    }, 150);
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
