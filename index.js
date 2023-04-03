//Usando Express
var express = require("express"); //requiriendo express
var app = express(); //creando la variable tipo express que a ser mi principal para mi aplicacion

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

//Declarando donde estaran los archivos estaticos, dentro esta el styles.ccs
app.use(express.static("public"));

// Ruta basica que renderiza index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// ENDPOINTS***************

//devuelve objeto {greeting: 'hello API'}
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//2-**An empty date parameter should return the current time in a JSON object with a utc key**
//retorna en /api la fecha actual obtenida con el metodo Date()
app.get("/api", function (req, res) {
  const fechaActual = new Date().toUTCString(); //obtengo la fecha actual
  const actualUnix = Date.parse(fechaActual); //la convierto la fecha a formato Unix
  res.json({ unix: actualUnix, utc: fechaActual }); //envio el json la fecha tanto en unix como en formato GMT
});

//1-************
//:<variable>? captura todo lo contenido en la url y lo almacena en la variable
app.get("/api/:fecha?", function (req, res) {
  let fecha = req.params.fecha; //guardo en fecha lo obtenido de la url
  let formatoFechaRegex = /^[0-9]+$/; //definicion de formato unix de fechas
  let fechaConFormato = formatoFechaRegex.test(fecha); //validando como esta escrita la fecha capturada en unix o normal ejemplo:(asi:1451001600000 or asi:2015-12-25)

  //si es asi: 2015-12-25 NOrmal
  if (!fechaConFormato) {
    let fechaUnixTimestamp = Date.parse(fecha); //convierto a Unix
    const utcFecha = new Date(fechaUnixTimestamp).toUTCString(); //la fecha en Unix es llevada a GMT o utc con el metodo Date()
    //envio el Json con la informacion
    fechaUnixTimestamp
      ? res.json({ unix: fechaUnixTimestamp, utc: utcFecha })
      : res.json({ error: "Invalid Date" });
  }
  //si es asi: 1451001600000
  else {
    let fechaUnixTimestamp = parseInt(fecha); //cambiado formato de normal a unix
    let actualDate = new Date(fechaUnixTimestamp); //obteniendo de unix a la fecha normal GTM o utc con el metodo Date()
    let utcFecha = actualDate.toUTCString(); //conviertiendolo a string para enviarlo e el json

    //enviando el json con la informacion de la fecha tanto en unix como en utc
    res.json({ unix: fechaUnixTimestamp, utc: utcFecha });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
