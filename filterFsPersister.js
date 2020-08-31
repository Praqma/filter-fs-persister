const FSPersister  = require( "@pollyjs/persister-fs" )

const { parse } = JSON;

module.exports =  class FilteringFSPersister extends FSPersister {

  encounters;

  filterRecording(data) {
    if(!this.options){
      return data;
    }
    if(this.options.substitute){
      data.log.entries.forEach((entry)=>{
        this.substitute(this.options.substitute, entry);
      })
    }

    if(this.options.filter){
      this.setupReplacementDictionary();
      data.log.entries.forEach((entry)=>{
        if(entry.response.content.mimeType.indexOf("application/json")>=0) {
          let text;
          try {
            text = JSON.parse(entry.response.content.text);
          } catch (e) {
            throw new Error(`${entry.response.content.text.substring(0, 20)}... can not be parsed as JSON!`)
          }
          let filtered = this.options.filter.reduce((acc, value) => {
            return this.replaceWord(acc, value);
          }, text)
          entry.response.content.text = JSON.stringify(filtered)
        }
      })
    }
    return data;
  }

  substitute(options,entry) {
    if(entry instanceof Array){
      entry.forEach((parameter) => {
        if (options[parameter.name]) {
          parameter['value'] = options[parameter.name]
        }
      })
    }else if (entry instanceof Object){
      for( const [key, value ] of Object.entries(options)){
        entry[key] = this.substitute(value, entry[key])
      }
    }else{
      return options
    }
    return entry
  }


  setupReplacementDictionary() {
    this.encounters = new Map()
    this.options.filter.forEach(item => {
      this.encounters[item] = Array()
    })
  }

  replaceWord(acc, toReplace, encounters) {
    if(Array.isArray(acc)) {
      return acc.map((item) => {
        return this.replaceWord(item, toReplace)
      })
    }
    if(acc instanceof Object){
      for( const [key, value ] of Object.entries(acc)){
        if(value instanceof Object){
          acc[key] = this.replaceWord(value, toReplace)
        }else{
          if(key === toReplace){
            acc[key] = this.findReplacement(toReplace, value)
          }
        }
      }
      return acc
    }
    return acc
  }

  findReplacement(toReplace, sensitiveWord) {
    let index = this.encounters[toReplace].indexOf(sensitiveWord);
    if (index === -1) {
      this.encounters[toReplace].push(sensitiveWord)
      index = this.encounters[toReplace].indexOf(sensitiveWord)
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

