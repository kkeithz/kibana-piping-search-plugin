# Piping Search Plugin for kibana
> Provide another searching method with piping and post processing of data

## Screenshot
![Screenshot1](https://github.com/kkeithz/kibana-piping-search-plugin/blob/master/screenshot/screenshot1.png?raw=true)
![Screenshot2](https://github.com/kkeithz/kibana-piping-search-plugin/blob/master/screenshot/screenshot2.png?raw=true)

## Usage
Install [piping-search-elasticsearch](https://github.com/kkeithz/elasticsearch-piping-search-plugin) plugin in Elasticsearch 6.3.1
Install plugin in kibana 6.3.1
  - `bin/kibana-plugin install [url]`

## Searching Pattern
Refer to Elasticsearch plugin [piping-search-elasticsearch](https://github.com/kkeithz/elasticsearch-piping-search-plugin)

## Development
See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following yarn scripts.

  - `yarn kbn bootstrap`

    Install dependencies and crosslink Kibana and all projects/plugins.

    > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

  - `yarn start`

    Start kibana and have it include this plugin. You can pass any arguments that you would normally send to `bin/kibana`

      ```
      yarn start --elasticsearch.url http://localhost:9220
      ```

  - `yarn build`

    Build a distributable archive of your plugin.

  - `yarn test:browser`

    Run the browser tests in a real web browser.

  - `yarn test:server`

    Run the server tests using mocha.

For more information about any of these commands run `yarn ${task} --help`. For a full list of tasks checkout the `package.json` file, or run `yarn run`.
