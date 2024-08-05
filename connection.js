const mysql=require('mysql');




const db=mysql.createConnection({

host:'localhost',
user:'root',
password:'',
database:'sport_node',


});



db.connect((err)=>{




    if(err){
        console.log('error ocurred',err.message);
        return;
    }
    console.log('connection created successfully');
});



module.exports=db;
