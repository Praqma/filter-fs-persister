module.exports = class DataFilter{

    encounters
    options
    constructor(options){
        this.options = options
        this.encounters = new Map()
        if(this.options.filter){
            this.options.filter.forEach(item => {
                this.encounters[item] = Array()
            })

        }
    }

    filterData(data) {
        if(!this.options){
            return data;
        }
        data.log.entries.forEach((entry)=>{

            this.filterEntry(entry);
        })
        return data;
    }

     filterEntry(entry) {
        if (this.options.filter) {
            if (entry.response.content.mimeType.indexOf("application/json") >= 0) {
                let text;
                try {
                    text = JSON.parse(entry.response.content.text);
                } catch (e) {
                    throw new Error(`${entry.response.content.text.substring(0, 20)}... can not be parsed as JSON!`)
                }
                let filtered = this.options.filter.reduce((acc, value) => {
                    return this.replaceWord(acc, value, this.encounters);
                }, text)
                entry.response.content.text = JSON.stringify(filtered)
            }
        }
    }

     replaceWord(acc, toReplace) {
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

}