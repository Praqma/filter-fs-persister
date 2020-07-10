const FSPersister  = require( "@pollyjs/persister-fs" )

const { parse } = JSON;

module.exports =  class FilteringFSPersister extends FSPersister {
  
  filterRecording(data) {
    if(this.options && this.options.filter){
      let encounters = new Map()
      data.log.entries.forEach((entry)=>{
        let text = JSON.parse(entry.response.content.text);
        let filtered = this.options.filter.reduce((acc, value)=>{
          if(encounters[value] === undefined){
            encounters[value] =  Array()
          }
          return this.replaceWord(acc, value, encounters);
        }, text)
        entry.response.content.text = JSON.stringify(filtered)
      })
    }
    return data;
  }

  replaceWord(acc, toReplace, encounters) {
    if(Array.isArray(acc)) {
      return acc.map((item) => {
        return this.replaceWord(item, toReplace, encounters)
      })
    }
    if(acc instanceof Object){
      for( const [key, value ] of Object.entries(acc)){
        if(key === toReplace){
            acc[key] = this.findReplacement(encounters, key, value)
          }else{
          acc[key] = this.replaceWord(value, toReplace, encounters)
          }
      }
      return acc;
    }
    return acc;
  }

  findReplacement(encounters, toReplace, sensitiveWord) {
    let index = encounters[toReplace].indexOf(sensitiveWord);
    if (index === -1) {
      encounters[toReplace].push(sensitiveWord)
      index = encounters[toReplace].indexOf(sensitiveWord)
    }
     return `${toReplace} ${index + 1}`
  }

  static get id() {
    return 'filter-fs';
  }

  saveRecording(recordingId, data) {
    /*
      Pass the data through the base persister's stringify method so
      the output will be consistent with the rest of the persisters.
    */

    this.api.saveRecording(recordingId, parse(this.stringify(this.filterRecording(data))));
  }

}

