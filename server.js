var express = require('express');
	var app = express();

var bodyParser = require('body-parser');
	app.use(bodyParser.json());

var _ = require('underscore');


var PORT = process.env.PORT || 3000;
var journal = [];
var nextRec = 1;


app.get('/', function(req, res){
	res.send('My Group Journal');
});

//get #Выводит все записи в журнале

app.get('/journal', function(req, res){
	res.json(journal);
});

//get #Выводит запись по запрошенному номеру записи (rec)

app.get('/journal/:rec', function(req, res){
	var recNum = parseInt(req.params.rec, 10);
	var matchedStud = _.findWhere(journal, {rec: recNum});

	if(matchedStud){
		res.json(matchedStud);
	}else{
		res.status(404).send('Record with this number not found');
	}
});

//get #Выводит записи по ID Студента

app.get('/journal/studid/:id', function(req, res){
	var sID = parseInt(req.params.id, 10);
	var matchedStud = _.findWhere(journal, {Student_ID: sID});

	if(matchedStud){
		res.json(matchedStud);
	}else{
		res.status(404).send('Student with this ID not found');
	}
});

//post 

app.post('/journal', function(req, res){
	var body = _.pick(req.body, 'Student_ID', 'Name','Surname','Mark');

	if(!_.isNumber(body.Student_ID) || !_.isString(body.Name) || !_.isString(body.Surname) || !_.isNumber(body.Mark) 
		|| body.Mark>5 || body.Mark<1
		|| body.Name.trim().length === 0 || body.Surname.trim().length === 0){
		return res.status(400).send();
	}

	body.Name = body.Name.trim();
	body.Surname = body.Surname.trim();
	body.rec = nextRec++;

	journal.push(body);

	res.json(body);
});

app.delete('/journal/:rec', function(req, res){
	var recNum = parseInt(req.params.rec, 10);
	var matchedStud = _.findWhere(journal, {rec: recNum});

	if(!matchedStud){
		res.status(404).json({"error": "no record found with that id"});
	}else{
		journal = _.without(journal, matchedStud);
		res.json(matchedStud);
	}
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
