export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        'https://webapi.amap.com/maps?v=2.0&ak=70c70a799443491af71e0574b3fac02b&plugin=AMap.AMapUI,AMap.Autocomplete,AMap.MouseTool,AMap.PlaceSearch,AMap.Geocoder&callback=initAMap'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
        resolve(window.AMap)
      }
  
    
  })
}




