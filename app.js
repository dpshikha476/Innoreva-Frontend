var express = require('express');
var bodyParser = require('body-parser')
const mysql = require('mysql');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))

const PORT = process.env.PORT || 4000

const db = mysql.createConnection({
    host : 'b65k2v5eq5hpygsbmyhm-mysql.services.clever-cloud.com',
    user : 'u1hql9occut1cyai',
    password : 'kqeSj0Rc7xBCDdo7L5FL',
    database: 'b65k2v5eq5hpygsbmyhm'
})

//connect
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Mysql connected');
})

app.get('/',function(req,res){
    res.render('index',{text_new:[]})
})

app.post('/convert', function(req,res) {
    
    var text;
    var text_split;
    text = req.body.word;
    // text = "अफसर अफसरों दर्पण"
    text_split = text.split(" "); //splits the text into array
    var text_length  
    text_length = Object.keys(text_split).length; // length of array

    db.query("SELECT * FROM urdutohindi", function (err,result)
    {
        if(err)
        throw err
        var length_table = Object.keys(result).length
        var newstr = []; 
          //to store new string
        for(var j=0; j < text_length; j++)
        {
            datas = text_split[j]
            var check = 0
            for(var i=0 ; i < length_table; i++)
            {
                if(result[i].Urdu === datas)   //if found in databse add translated word to newstr
                {
                    var newarr = result[i].Hindi.split('/')
                    newstr.push({
                        hindi : newarr,
                        urdu : result[i].Urdu,
                        status : 1
                    })
                   
                    check = 1
                    break
                }
            }
            if(check == 0)  //if not found add the old word to newstr
            {
               var newdata = []
               newdata.push(datas)
               newstr.push({
                   hindi : newdata,
                   urdu : " ",
                   status: 0
               })
            }       
        }
        console.log(newstr)
         res.render('index',{text_new:newstr})
    })
 
})

app.get('/user_controller',(req,res)=>{
    res.render('user_controller')
})

app.post('/add',function(req,res){
    let addUrdu = req.body.addUrdu
    let addHindi = req.body.addHindi
    db.query('INSERT INTO urdutohindi (Urdu,Hindi) VALUES (?,?)',[addUrdu,addHindi],(err,result)=>{
        if(err)
        console.log(err)
        else
        res.render('user_controller')
    })
})

app.post('/updateUrdu',function(req,res){
    let updateUrdu = req.body.updateUrdu
    let Hindi = req.body.Hindi
    db.query('UPDATE urdutohindi SET Urdu = ? WHERE Hindi = ?',[updateUrdu,Hindi],(err,result)=>{
        if(err)
        console.log(err)
        else
        res.render('user_controller')
    })
})

app.post('/updateHindi',function(req,res){
    let Urdu = req.body.Urdu
    let updateHindi = req.body.updateHindi
    db.query('UPDATE urdutohindi SET Urdu = ? WHERE Hindi = ?',[Urdu,updateHindi],(err,result)=>{
        if(err)
        console.log(err)
        else
        res.render('user_controller')
    })
})
 
// setting server
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})
