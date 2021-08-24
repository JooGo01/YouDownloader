//const

const express= require('express');
const app=express();
const path = require('path');
const ytdl = require("ytdl-core");

//settings

app.set('port', 3000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cors());

//static files

app.use(express.static(path.join(__dirname, 'public')));

var whiteList =['http://localhost:3000/']

var corsOptions =
{
	origin: function(origin, callback)
	{
		if(whiteList.indexOf(origin)!= -1)
		{
			callback(null, true)
		}
		else
		{
			callback(new Error('Not allowed by CORS'));
		}
	}
}

//getting video data--download

app.get("/videoInfo", cors(corsOptions), async function(request,response){
	const videoURL = request.query.videoURL;
	const info = await ytdl.getInfo(videoURL);
	response.status(200).json(info);
});

app.get("/download", function(request,response){
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