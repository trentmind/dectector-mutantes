var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Conexion a Mongo
MongoClient.connect(url, function (error, client) {
    if (error) throw error;

    // Seleccionar base de datos
    var dbo = client.db("magnetomutants");
    console.log(dbo.collection("stats"));

    // Eliminar las colecciones para ambiente de desarrollo
    dbo.collection("stats").drop(function (err, result) {
        if (result) console.log("Coleccion de estadisticas borrada.");
    });

    dbo.collection("mutants").drop(function (err, result) {
        if (result) console.log("Coleccion de mutantes borrada.");
    });

    process.exit();
});