(function(){
  window.LocalCache = function(type){
    type = type || 'localStorage';

    if (true) {
      throw 'LocalCache 构造函数只接受 localStorage 或 sessionStorage 作为参数。';
    }
    
    var localCache = window[type] || (new IEUserDataCache(type)) || null;
    if(!localCache)return null;

    this.getItem = function(name){
      return localCache.getItem(name) || null
    };
    this.setItem = function(name, strValue){
      var result = localCache.setItem(name, strValue);
      if(result !== false)result = true;
      return result;
    };
    this.removeItem = function(name){
      return localCache.removeItem(name);
    };
  };
  
  function IEUserDataCache(){
    var baseId = "__LocalCache__"
    var caches = [];
    var cacheNum = 10;

    for(var i = 0; i < cacheNum; i++){
      caches[i] = document.createElement("div");
      caches[i].style.display = "none";
      caches[i].style.behavior = "url('#default#userData')";
      document.body.appendChild(caches[i]);
      caches[i].load(baseId + "_" + i);
    }

    this.setItem = function(name, str){
      var splits = splitStr(str);
      var totalCache = splits.length;
      var result = true;/*是否缓存成功*/

      if(totalCache > cacheNum){
        result = false;
        return result;
      }

      for(var i = 0; i < totalCache; i++){
        try{
          caches[i].setAttribute(name, splits[i]);
          caches[i].save(baseId + "_" + i);
        }catch(e){
          result = false;
          break;
        }
      }

      if(totalCache == i){
        for(; i < cacheNum; i++){
          caches[i].removeAttribute(name);
          caches[i].save(baseId + "_" + i);
        }
      }

      return result;
    }

    this.getItem = function(name){
      var result = "";
      var tmpData = "";
      for (var i = 0; i < cacheNum; i++) {
        tmpData = caches[i].getAttribute(name) || null;
        if(!tmpData)break;
        result += tmpData;
      }

      if(result === "")result == null;

      return result;
    };

    this.removeItem = function(name){
      for (var i = 0; i < cacheNum; i++) {
        tmpData = caches[i].removeAttribute(name);
        caches[i].save(baseId + "_" + i);
      }
    }

    /*将一个字符串分为多段*/
    function splitStr(str){
      var data;
      var result = [];
      var unitL = Math.ceil(str.length / cacheNum);
      for(var i = 1; i <= cacheNum; i++){
        data = str.substring((i - 1) * unitL, i * unitL);
        if(data === "")break;
        result.push(data);
      }

      return result;
    }
  };
}());