const express = require("express");
require('dotenv').config();
const hbs = require('hbs');
const async = require("hbs/lib/async");
const path = require('path');
const { cursorTo } = require("readline");
const app = express();
const PORT = 3000 || process.env.PORT;
require('../db/conn')
const customer = require('../db/schema')

app.use(express.json())

const view_path = path.join(__dirname,'../components/views')
const partials_path = path.join(__dirname,'../components/partials')
static_path = path.join(__dirname,'../public')

app.use(express.static(static_path))

app.set("view engine","hbs");
app.set("views",view_path)
hbs.registerPartials(partials_path)
hbs.registerPartials(view_path)

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/add',async(req,res)=>{
    
    try {
        const user = req.body;
        const result_set = new customer(user);
        const  result = await result_set.save();
        res.send(result)
    } catch (error) {
        console.log(error);
    }
   

})

app.get('/tf/:as',async(req,res)=>{
    const accountNumber  = req.params.as ;
    
    const result_set = await customer.find({accountNumber:accountNumber}).select({_id:0}) ;
    res.render("tf",{result:result_set})
    
})

app.get('/view',async(req,res)=>{
    try {
        const resut_set = await customer.find().select({_id:0}) 
        res.render('home',{name:resut_set})
    } catch (error) {
        console.log(error)
    }
})
    
app.get('/onecustomer/:as',async(req,res)=>{   
  try {
       
    const accountNumber  = req.params.as ;
    
    const result_set = await customer.find({accountNumber:accountNumber}).select({_id:0}) ;
    res.render("customer",{result:result_set})
  } catch (error) {
      console.log(error)
  }
   
    // res.send(result_set)
   
})

app.get('/visit',async(req,res)=>{
    try {
        res.send("hello this is visite")
    } catch (error) {
        console.log(error)
    }
})

app.post('/transfer',async(req,res)=>{
    try {
    const transfer_money =  parseInt(req.body.money);
    const to_accountNumber = parseInt(req.body.toac);
    const accountNumber = parseInt(req.body.fromac);

    
   
    
    const result_set = await customer.findOne({accountNumber}).select({balance:1,_id:0});
    const balance = result_set["balance"];

    if(balance>0 && balance>=transfer_money){


        const find_user = await customer.findOne({accountNumber:to_accountNumber}).select({balance:1,name:1,_id:0});
        const to_balance = find_user["balance"];
        const name = find_user["name"]
        const to_new_balance=to_balance + parseInt(transfer_money);
        const update_user = await customer.findOneAndUpdate({accountNumber:to_accountNumber},{
            $set:{
                balance:to_new_balance
            },$push:{
                history:{name:name,send:0,receive:to_new_balance}
            }})
        const from_new_balance = balance - transfer_money;
        const update_from_user = await customer.findOneAndUpdate({accountNumber:accountNumber},{
            $set:{
                balance:from_new_balance
            },
            $push:{
                history:{name:name,send:transfer_money,receive:0}
            }
        },{new:true})
       
        const result_set1 = await customer.find();
        
        res.render('home',{name:result_set1})
       
        
    }
    else{
       
        const result_set = await customer.find({accountNumber:accountNumber}).select({_id:0}) ;
        res.render("tf",{result:result_set})
    }
    
    } catch (error) {
        console.log(error)
    }
    
       
})

app.get('/history/:ac',async(req,res)=>{
    const accountNumber = req.params.ac
    const result_set = await customer.find({accountNumber}).select({history:1,_id:0})
    res.render('transation',{result:result_set})
})

app.listen(PORT,()=>{
    console.log(`server listen at ${PORT}`);
})