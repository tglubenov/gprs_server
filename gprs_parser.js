


const message = '::ffff:149.62.200.109:62418>wLGSN 42 39 13 33 E 23 20 38 43 R1 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ M1 0 M2 0 SL 0 MR 0 SR 0 TS 10 PD 1430198';


const msg = message.toString();
console.log(msg);
console.log(msg.length, typeof (msg));

ttt = msg.replace(/LGSN /g, '\nLGS;lat:');
ttt = ttt.replace(/ E /g, ',lon:');

ttt = ttt.replace(/ M1 /g, ',M1:');
ttt = ttt.replace(/ M2 /g, ',M2:');
ttt = ttt.replace(/ MR /g, ',MR:');
ttt = ttt.replace(/ SR /g, ',SR:');
ttt = ttt.replace(/ SL /g, ',SL:');
ttt = ttt.replace(/ TS /g, ',TS:');
ttt = ttt.replace(/ PD /g, ',PD:');
ttt = ttt.replace(/ R1 /g, ',R1:');
ttt = ttt.replace(/ S /g, ',S:');

// remove all null characters
ttt = ttt.replace(/\0/g, '');
ttt = ttt.replace(/ \r/, '');

ttt = ttt.split(';')[1];

var properties = ttt.split(',');
var gprs_obj = {};
properties.forEach(function(property) {
    var tup = property.split(':');
    gprs_obj[tup[0]] = tup[1];
});

gprs_obj['receive_timestamp'] = new Date;
gprs_obj['version'] = '1.0';

if (gprs_obj['lat']) {
    lister = gprs_obj['lat'].split(' ');
    if (lister.length == 4) {
        sec = lister[2] + '.' +lister[3];
        dec = Number(lister[0])+Number(lister[1]/60)+Number(sec/3600);
        gprs_obj['lat'] = dec;
    } else {
        console.log('Err', lister);
    }
}

if (gprs_obj['lon']) {
    lister = gprs_obj['lon'].split(' ');
    if (lister.length == 4) {
        sec = lister[2] + '.' +lister[3];
        dec = Number(lister[0])+Number(lister[1]/60)+Number(sec/3600);

        gprs_obj['lon'] = dec;
    } else {
        console.log('Err', lister);
    }
}

geojson_object = {}
geojson_object['type'] = 'Feature';
geojson_object['properties'] = gprs_obj;

if (gprs_obj.lat && gprs_obj.lon) {
    geojson_object['geometry'] = {
        type: "Point",
        coordinates: [gprs_obj.lat, gprs_obj.lon]
    }
}




console.log(geojson_object, typeof geojson_object);


