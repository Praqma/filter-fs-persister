const FSPersister  = require( "@pollyjs/persister-fs" )
const { parse } = JSON;
const DataFilter = require('./dataFilter')
const replaceData = require('./replaceData')

module.exports =  class FilteringFSPersister extends FSPersister {

  dataFilter;
  constructor() {
    super(...arguments);
    this.dataFilter = new DataFilter(this.options)
    const {server} = this.polly
    if(this.options.replace){
      server.any().on('beforePersist', (req, recording) => {
        // drops `auth-token` from recording
        replaceData(recording, this.options.replace)
      });
    }
  }

  static get id() {
    return 'filter-fs';
  }

  saveRecording(recordingId, data) {
    /*
      Pass the data through the base persister's stringify method so
      the output will be consistent with the rest of the persisters.
    */
    this.api.saveRecording(recordingId, parse(this.stringify(this.dataFilter.filterData(data))));
  }

}

