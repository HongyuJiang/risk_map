import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { parseRiskData } from './util'

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [113.74249, 34.75956],
    zoom: 11
  })
});

const addHome2Map = (scene) => {

  const homeData = [
    {lon: 113.72821, lat: 34.74451, name: '橘子水晶'}, {lon: 113.74249, lat: 34.75956, name: '苹果水晶'}
  ]

  const pointLayer = new PointLayer({})
        .source(homeData, {
          parser: {
            type: 'json',
            x: 'lon',
            y: 'lat'
          }
        })
        .shape('name', 'text')
        .color('blue')
        .size(14)

  scene.addLayer(pointLayer);
}

const addPoints2Map = (data, scene) => {
  
  const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'lon',
        y: 'lat'
      }
    })
    .shape('circle')
    .size(8)
    .active(true)
    .color('name', [ '#F6BD16', '#E86452' ])
    .style({
      opacity: 0.3,
      strokeWidth: 2
    });

  scene.addLayer(pointLayer);
}

scene.on('loaded', () => {

  addHome2Map(scene)

  fetch(
    'https://a68962b2-18d0-4812-854e-b4179d81a71f.bspapp.com/http/fengxian'
  )
    .then(res => res.json())
    .then(data => {
      parseRiskData('郑州市', data).then((data) => {
        addPoints2Map(data, scene)
      })
    });
});
