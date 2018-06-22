let cors = require('cors');
let express=require('express');
let parser=require('body-parser');
let http=require('http');
let route=require('./controllers/controller');
let model=require('./models/model');
let app=new express();
let server=http.createServer(app);
let io=require('socket.io').listen(server);


app.use(parser.json());
app.use(parser.urlencoded({extended:true}));
app.use(cors());

route.controller(app,io);
server.listen(process.env.PORT || 8080);

