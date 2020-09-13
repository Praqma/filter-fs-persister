module.exports = function replaceData(entry, options) {
        if(entry instanceof Array){
            entry.forEach((parameter) => {
                if (options[parameter.name]) {
                    parameter['value'] = options[parameter.name]
                }
            })
        }else if (entry instanceof Object){
            for( const [key, option ] of Object.entries(options)){
                entry[key] = replaceData(entry[key], option)
            }
        }else{
            return options
        }
        return entry
}