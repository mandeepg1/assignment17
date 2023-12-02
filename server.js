const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose.connect("mongodb+srv://mandeep-gujral:mandeep02@mandeep.2m0yy2o.mongodb.net/")
.then(() => console.log("Connected to mongodb..."))
.catch((err) => console.error("could not connect ot mongodb...", err));

const gameSchema = new mongoose.Schema({
  name: String,
  platform: [String],
  publisher: String,
  description: String,
  img: String,
  add_info: [String],
});


const Game = mongoose.model("Game", gameSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/games", (req, res) => {
  getGames(res);
});

const getGames = async (res) => {
  const games = await Game.find();
  res.send(games);
}

app.get("/api/games/:id", (req, res) => {
  getGame(res, req.params.id);
});

const getGame = async (res, id) => {
  const game = await Game.findOne({_id:id});
  res.send(game);
}

app.listen(3000, () => {
  console.log("listening");
});

const validateThings = (game) => {
  const schema = Joi.object({
    _id: Joi.allow(''),
    platform: Joi.allow(''),
    publisher: Joi.allow(''),
    name: Joi.string().min(1).required(),
    description: Joi.string().min(3).required(),
    add_info: Joi.allow('')
  });
  return schema.validate(game);
};

app.delete("/api/games/:id", (req, res) => {
    deleteGames(res, req.params.id);
  });

const deleteGames = async(res, id) => {
  const game = await Game.findByIdAndDelete(id);
  res.send(game);
}

  app.post("/api/games", upload.single("img"), (req, res) => {
    console.log("in post");
    const result = validateThings(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    const game = new Game({
        name: req.body.name,
        description: req.body.description,
        platform: req.body.platform,
        publisher: req.body.publisher,
        img: req.body.img,
        add_info: req.body.add_info
    })
  
    if (req.file) {
      game.img = "images/" + req.file.filename;
    }

    createGame(res, game);
  });

  const createGame = async (res, game) => {
    const result = await game.save();
    res.send(game);
  }
  

app.put("/api/games/:id", upload.single("img"), (req, res) => {
    //const id = parseInt(req.params.id);
    const result = validateThings(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateGame(req, res);
});

const updateGame = async (req, res) => {
  let updatingFields = {
    name: req.body.name,
    description: req.body.description,
    platform: req.body.platform,
    publisher: req.body.publisher,
    add_info: req.body.add_info
  }

  if(req.file){
   updatingFields.img = "images/" + req.file.filename;
  }

  const result = await Game.updateOne({_id:req.params.id},  updatingFields);
  res.send(result);
}