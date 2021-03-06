var express = require('express')
const async = require('hbs/lib/async')
var app = express()
var mongodb = require('mongodb');

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://thuannguyen24:Thuannguyen24@cluster0.5n9c0.mongodb.net/test'

app.post('/search', async (req,res)=>{
    let name = req.body.txtName
    //ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //truy cap database ATn
    let dbo = server.db("Assignment2")
    //get data
    let products = await dbo.collection("product").find({'name':new RegExp(name, 'i')}).toArray()
    res.render('allProduct',{'products':products})
})

app.get('/', async (req,res)=>{
    //ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //truy cap database ATn
    let dbo = server.db("Assignment2")
    //get data
    let products = await dbo.collection("product").find().toArray()
    let firstProduct = await dbo.collection("product").find().limit(1).toArray()
    let secondHalf = await dbo.collection("product").find().skip(1).toArray()
    res.render('home',{'products':products,'first':firstProduct, 'secondHalf': secondHalf})
})

app.get('/delete/:id', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("Assignment2")
    await dbo.collection('product').deleteOne({_id: mongodb.ObjectId(req.params.id)})
    res.redirect('/')
})

app.post('/newProduct', async (req, res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let descrip = req.body.txtDes
    if(name.length <= 5){
        res.render('newProduct',{'nameError':'ten phai hon 5 ki tu'})
        return
    }
    let product = {
        'name':name,
        'price':price,
        'picture':picture,
        'descrip': descrip
    }
    //1. kết nối đến server có địa chỉ trong url
    let server = await MongoClient.connect(url)
    //truy cập Database ATN
    let dbo = server.db("Assignment2")
    //insert product vào database
    await dbo.collection("product").insertOne(product)
    //quay lại trang home
    res.redirect('/')
})

app.get('/insert', (req, res)=>{
    res.render("newProduct")
})

// app.get('/', (req, res)=>{
//     res.render('allProduct')
// })

const PORT = process.env.PORT || 6000
app.listen(PORT)
console.log('Runing....')