const express = require('express'); // Import Express.js
const db = require('./connection'); // Import database connection module
const cors = require('cors'); // Import CORS for handling cross-origin requests
const path = require('path'); // Import path module for handling file paths
const bodyparser = require('body-parser'); // Import body-parser for parsing request bodies
const multer = require('multer'); // Import Multer for handling file uploads
const { error } = require('console');

const port = 5000; // Define the port number
const app = express(); // Create an Express application

// Middleware setup
app.use(cors()); // Enable CORS
app.use(bodyparser.json()); // Parse JSON request bodies
app.use(bodyparser.urlencoded({ extended: true })); // Parse URL-encoded request bodies



app.use('/upload', express.static(path.join(__dirname, 'upload')));
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'upload')); // Set the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage }); // Initialize Multer with the storage configuration

// Define a POST route for file upload
app.post('/app/upload', upload.single('image'), (req, res) => {
    const { fullname, team, award, comment } = req.body; // Extract fields from request body
    const image = req.file ? req.file.filename : null; // Get the uploaded file name

    const query = "INSERT INTO `player` (`full_name`, `team`, `award`, `comment`, `image`) VALUES (?, ?, ?, ?, ?)"; // Define SQL query

    db.query(query, [fullname, team, award, comment, image], (err, result) => {
        if (err) {
            console.error('Error occurred during inserting player data'); // Log error
            res.status(500).json({ error: 'Error occurred during inserting' }); // Respond with error
            return;
        }
        res.status(200).json({ message: 'Data inserted successfully' }); // Respond with success message
    });
});



//lets do a get request for fetching data  for 


app.get('/api/players',(req,res)=>{


    const query="SELECT * FROM `player`";


    db.query(query,(err,results)=>{



        if(err){
            console.log('error ocurred during fetching the data');
            res.status(500).json({error:'erorr ocurred during fetching'});
            return;
        }

        res.status(200).json(results);

    });
});


//lets do delate route

app.delete('/api/player/delete/:id',(req, res)=>{


    const {id}=req.params;

    const query="DELETE FROM `player` WHERE `id`=?";


    db.query(query,[id],(err,result,fields)=>{


        if(err){


            console.log('errror ocurred during fetching');
            res.status(403).json({error:'error ocurred dring fetching'});

            return;
        }

        console.log('successfully delated the player');
        res.status(200).json({message:'sucessfully delated'});
    });

});


//update the data request from server

app.put('/api/player/update/:id',upload.single('image'),(req,res)=>{


    const {id}=req.params;
    const { fullname, team, award, comment }=req.body;

    //const image=req.file?req.file.filename: null;

    
    let image;

    if(req.file){
        image=req.file.filename;

        const query="UPDATE `player` SET `full_name`=? ,`award`=?,`comment`=?,`team`=? ,`image`=? WHERE `id`=?";



    db.query(query,[fullname,award,comment,team,image,id],(err,result,fields)=>{



        if(err){


            console.error('error ocurred during fetching',err);
            res.status(500).json({error:'eror ocurred during updating data'});
            return;
        }
        res.status(200).json({message:'data updated succesffully with image'});
        console.log('data updated successfully with image');
    });
    }
    else{


        const query="UPDATE `player` SET `full_name`=? ,`award`=?,`comment`=?,`team`=? WHERE `id`=?";



        db.query(query,[fullname,award,comment,team,id],(err,result,fields)=>{
    
    
    
            if(err){
    
    
                console.error('error ocurred during fetching',err);
                res.status(500).json({error:'eror ocurred during updating data'});
                return;
            }
            res.status(200).json({message:'data updated succesffully with out image'});
            console.log('data updated successfully');
        });
    }




    
});






//fetching the data by id
app.get('/api/player/:id',(req,res)=>{


    const {id}=req.params;


    const query="SELECT * FROM `player` WHERE `id`=?";

    db.query(query,[id],(err,results,fields)=>{



        if(err){
            console.error('Eror ocurred during feching data by id');


            res.status(500).json({error:'not sucedfully fetch data by id'});
            return ;
        }
        console.log('data fetched by id successfully');
        res.status(200).json(results);
      

    });
});


//lets fetch recent data fetched from player data
app.get('/recent/player',(req,res)=>{



const query="SELECT * FROM `player` LIMIT 3";


db.query(query, (err,results,fields)=>{


    if(err){


        console.error('erro ocurred fetching');
        res.status(500).json({error:'error ocurred during fetching'});
        return;
    }

    res.status(200).json(results);
    console.log('succesffuly fetched recent data from api');
});


})








// Start the server
app.listen(port, () => {
    console.log(`Server started successfully http://localhost:${port}`);
});
