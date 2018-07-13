import searchRoute from './server/routes/search';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'piping-search-plugin',
    uiExports: {
      
      app: {
        title: 'Piping Search',
        description: 'Provide another searching method with piping and post processing of data',
        main: 'plugins/piping-search-plugin/app',
        icon: 'plugins/piping-search-plugin/icon.svg',
      },
      
      visTypes: [
        'plugins/piping-search-plugin/vis_type'
      ],
      
      hacks: [
        'plugins/piping-search-plugin/hack'
      ]
      
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    
    init(server, options) {
      // Add server routes and initialize the plugin here
      searchRoute(server);
    }
    

  });
};
