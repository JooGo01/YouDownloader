//const

const express= require('express');
const app=express();
const path = require('path');
const ytdl = require("ytdl-core");

//settings

app.set('port', 5000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static files

app.use(express.static(path.join(__dirname, 'public')));

//getting video data--download

app.get("/videoInfo",async function(request,response){
	const videoURL = request.query.videoURL;
	const info = await ytdl.getInfo(videoURL);
	response.status(200).json(info);
});

app.get("/download",function(request,response){
	const videoURL = request.query.videoURL;
	const itag = request.query.itag;
	const format = request.query.format;
	response.header("Content-Disposition",'attachment;\ filename="video.'+format+'"');
	ytdl(videoURL).pipe(response);
});

//routes

app.use(require('./routes/indexRoute'));

//listening port

app.listen(app.get('port'), () =>
{
 console.log('server on port', app.get('port'));    
});