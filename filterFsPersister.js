const FSPersister  = require( "@pollyjs/persister-fs" )

const { parse } = JSON;

module.exports =  class FilteringFSPersister extends FSPersister {
  
  filterRecording(data) {
    if(this.options && this.options.filter){
      let encounters = new Map()
      let path = this.options.path
      data.log.entries.forEach((entry)=>{
        let text = JSON.parse(entry.response.content.text);
        let toModify = text
        if(path!=null){
          toModify = toModify[path]
        }
        let filtered = this.options.filter.reduce((acc, value)=>{
          if(encounters[value] === undefined){
            encounters[value] =  Array()
          }
          return toModify.map((item) => {
            const word =  item[value]
            let index = encounters[value].indexOf(word);
            if(index === -1){
              encounters[value].push(word)
              index = encounters[value].indexOf(word)
            }
            item[value] = `${value} ${index+1}`
            return item;
          })
        }, toModify)
        if(path){
          text[path] = filtered
          entry.response.content.text = JSON.stringify(text)
        }else {
          entry.response.content.text = JSON.stringify(filtered);
        }
      })
    }
    return data;
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

