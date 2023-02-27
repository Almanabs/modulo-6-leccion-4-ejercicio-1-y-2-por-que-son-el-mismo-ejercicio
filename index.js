const express = require('express');
const app = express();
const router = express.Router();
const { create } = require('express-handlebars'); 
const fs = require('fs');



router.get("/", (req, res) =>{
    res.render("home");
})

router.get("/peliculas", (req, res) =>{
    fs.readFile("peliculas.json", "utf8", (error, data) => {
        if(error) return res.status(500).send({code: 500, message:"Algo salió al leer la BD."})
        let objetoPeliculas = JSON.parse(data);
        res.render("peliculas", {
            peliculas: objetoPeliculas,
            titulo: "Sección películas de NETFLIX."
        });
    })
})

router.get("/series", (req, res) =>{
    fs.readFile("series.json", "utf8", (error, data) => {
        if(error) return res.status(500).send({code: 500, message:"Algo salió al leer la BD."})
        let objetoSeries = JSON.parse(data);
        res.render("series", {
            series: objetoSeries,
            titulo: "Sección series de NETFLIX.",
            layout: false
        });
    })
})


router.get("/netflix/:opcion", (req, res) =>{
    let opcion = req.params.opcion;
    opcion = opcion.toLowerCase();
    if(opcion == "peliculas" || opcion == "series"){
        fs.readFile(opcion+".json", "utf8", (error, data) => {
            if(error) return res.status(500).send({code: 500, message:"Algo salió al leer la BD."})
            let datos = JSON.parse(data);
            res.json(datos);
        })
    }else{
        res.status(400).send({code: 400, message:"Ha elegido una opción no considerada, opciones disponibles: [peliculas - series]"})
    }
})




//CONNFIGURACIONES Y MIDDLEWARES
const hbs = create({
    partialsDir: ["views/partials"]
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", router)

//publicar una carpeta o archivo
app.use("/public", express.static(__dirname+"/public"));


app.listen(3000, () => console.log("http://localhost:3000"))

