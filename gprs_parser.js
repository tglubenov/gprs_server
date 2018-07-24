

const msg = '::ffff:149.62.200.15:27964>�LGSN 42 39 13 33 E 23 20 38 43 R1 _ O _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ M1 0 M2 0 SL 0 MR 0 SR 0 TS 0 PD 1430198 S 0 PD 1430198 ';

key_letters = ['LGSN', ' N', ' E', ' R', ' M', ' S', ' T', ' P']

ttt = msg.replace(/LGSN /g, '\n;LGS:123,lat:"');
ttt = ttt.replace(/ E /g, '",lon:"');

ttt = ttt.replace(/ M1 /g, '",M1:"');
ttt = ttt.replace(/ M2 /g, '",M2:"');
ttt = ttt.replace(/ MR /g, '",MR:"');
ttt = ttt.replace(/ SR /g, '",SR:"');
ttt = ttt.replace(/ SL /g, '",SL:"');
ttt = ttt.replace(/ TS /g, '",TS:"');
ttt = ttt.replace(/ PD /g, '",PD:"');
ttt = ttt.replace(/ R1 /g, '",R1:"');
ttt = ttt.replace(/ S /g, '",S:"');

ttt = ttt.split(';')[1]+'"';

var properties = ttt.split(',');
var gprs_obj = {};
properties.forEach(function(property) {
    var tup = property.split(':');
    gprs_obj[tup[0]] = tup[1];
});


console.log(gprs_obj, typeof gprs_obj);

console.log(gprs_obj.lon, gprs_obj.lat);