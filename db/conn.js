const mongoose = require('mongoose');
DB=process.env.DB;
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch(()=>{
    console.log('connection failled');
})

