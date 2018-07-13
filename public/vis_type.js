import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { Visualization } from './components/vis/visualization'
import { VisEditor } from './components/vis/viseditor'
import datemath from '@kbn/datemath'

const pipingSearchRequestHandler = async (vis, { appState, uiState, timeRange }) => {
  return $.ajax({
    url: "../api/piping-search-plugin/search",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
      query: vis.params.query,
      date_range: {
        field: "@timestamp",
        from: datemath.parse(timeRange.from).toJSON(),
        to: datemath.parse(timeRange.to).toJSON(),
      }
    }),
    contentType: "application/json"
  });
};

const pipingSearchResponseHandler = (vis, response) => {
  return response;
};

const PipingSearchVisType = (Private) => {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createReactVisualization({
    name: 'Piping Search',
    title: 'Piping Search',
    image: '../plugins/piping-search-plugin/icon_b.svg',
    description: 'Piping search visualization',
    category: CATEGORY.OTHER,
    requestHandler: pipingSearchRequestHandler,
    responseHandler: pipingSearchResponseHandler,
    visConfig: {
      component: Visualization,
      defaults: {
        query: "",
        chartType: "Table",
      }
    },
    editorConfig: {
      optionsTemplate: VisEditor,
    },
    options: {
      showQueryBar: false,
      showFilterBar: false,
      showIndexSelection: false,
    }
  });
}

VisTypesRegistryProvider.register(PipingSearchVisType);