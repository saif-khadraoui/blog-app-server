const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const { createToken, validateToken } = require("./JWT")
const multer = require("multer")
const path = require("path")
require("dotenv").config();


const UsersModel = require("./models/Users");
const PostModel = require("./models/Posts")

const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser())

mongoose.connect("mongodb+srv://saifkhadraoui656:hHQfdglHi6zEMpFA@cluster0.nx7qlpi.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((response) => {
    if(response){
        console.log("db connected")
    }
})

app.post("/register", async(req,res) => {
    const { firstName, lastName, email, username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        const user = new UsersModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: hash
        })

        user.save();

    })

    res.send("user registered")
})

app.post("/login", async(req, res) => {
    const username = req.body.username
    const password = req.body.password


    const user = await UsersModel.findOne({username: username})

    const dbPassword = user.password;
    console.log(password)
    console.log(user.password)


    bcrypt.compare(password, dbPassword).then(function(match){
        if(!match){
            res.json("wrong combination")
        } else{
            const accessToken = createToken(user)
            // localStorage.setItem("access-token", accessToken)

            res.cookie("access-token", accessToken, {
                maxAge: 60*60*24*30*1000
            })


            res.json(user)
        }
    })

})

app.post("/logout", (req,res) => {
    res.cookie("access-token", "").json("user logged out, details cleared")
})

app.get("/profile", validateToken, (req,res) => {
    res.json("profile")
})

const storage = multer.diskStorage({
    destination: (req,file, db) => {
        // db(null, '../src/components/Post/uploads')
        db(null, "../client/public/images")
    },
    filename: (req, file, db) => {
        db(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.post("/addPost", upload.single('file'), async(req,res) => {
    const username = req.body.username;
    const userId = req.body.userId
    const time = req.body.time;
    const title = req.body.title;
    const summary = req.body.summary;
    const image = req.file ? req.file.filename: null;
    const content = req.body.content

    const post = new PostModel({
        username: username,
        userId: userId,
        time: time,
        title: title,
        summary: summary,
        image: image,
        content: content
    })

    await post.save().then(function(response){
        res.send(response)
    })
})

app.get("/getPosts", async(req,res) => {
    const filter = {}

    await PostModel.find(filter).then((err, result) => {
        if(err){
            res.send(err)
        }
        if(result){
            res.send(result)
        }
    })
})

app.get("/getPost", async(req,res) => {
    const id = req.query.id;

    await PostModel.find({ _id: id }).then((err,result) => {
        if(err){
            res.send(err)
        }
        if(result){
            res.send(result)
        }
    })
})

app.get("/getUsersPosts", async(req,res) => {
    const userId = req.query.userId;

    await PostModel.find({ userId: userId }).then((err,result) => {
        if(err){
            res.send(err)
        }
        if(result){
            res.send(result)
        }
    })
})


app.listen(process.env.PORT || 3001, () => {
    console.log("server connected")
})