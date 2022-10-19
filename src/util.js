import _ from 'lodash'


const addressTransUrl= "https://restapi.amap.com/v3/geocode/geo?key=33194d043eab5520a4077d8e3804277a&city=郑州市&address="

const generatePoints = async (riskRegions) => {

    const events = riskRegions.map((d) => {
        return fetch(addressTransUrl + d['name'])
    })

    const skyline = _.findIndex(riskRegions, {'level': 'medium'})

    return await Promise.all(events)
    .then((responses) => {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    })
    .then((data) => {
        const points = data.filter((d) => d['geocodes'] !== undefined)
                   .map((d, i) => {
                    const location = d['geocodes'][0]['location'].split(',')
                    const name = d['geocodes'][0]['formatted_address']
                    return {
                        'name': name,
                        'lat': location[1],
                        'lon': location[0],
                        'level': i > skyline ? 'medium' : 'high'
                    }
                   })
        return points  
    })
    .catch(function (error) {
        console.log(error);
    });
}

export const parseRiskData = (areaName, lqData, level) => {
    
    let counter = 0
    const riskRegions = []

    lqData.forEach((region) => {
        if (region['name'].indexOf(areaName) > -1 && region['name'].indexOf('风险区以外') < 0){
            if(region['name'] == areaName)
                counter += 1
            else {
                const regionName = region['name'].split(' -')[0]
                if(counter == 1)
                    riskRegions.push({'name': regionName, 'level': 'high'})
                else if (counter == 2)
                    riskRegions.push({'name': regionName, 'level': 'medium'})
            }
        }
    })

    return generatePoints(riskRegions)
}


