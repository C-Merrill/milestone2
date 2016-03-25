var express = require('express');
var router = express.Router();


var entries = [{slug:"How to pass class", body: "Come to class. Do your homework"},{slug:"February 12, 2016", body:"There are options for free web hosting, such as Heroku. I was under the impression that I would have to pay monthly to put any website on the web, but it seems I can do it free."},{slug:"February 13,2016", body:"I've been using Emacs for a while, but never took the time to master the keyboard shortcuts. Today, I learned how to open files using C-x C-f and how to switch between open buffers, so I can edit multiple files at once. Because there is no visual interface evidence of other open buffers, I assumed that you can only have one file open at a time. Now I can work much more productively in this editor."},{slug:"March 4, 2016", body:"Learned all about rendering sites in javascript to make this site work."}];

/* READ all: GET entries listing. */
router.get('/', function(req, res, next){
    req.db.driver.execQuery{
	"SELECT * FROM entries;",
	function(err, data){
	    if(err){
		console.log(err);
	    }
	    res.render('til/index', { title: 'Entries', parent:'../', entries: entries });
	}
    };
});

/* CREATE entry form: GET /til/new */
router.get('/new', function(req, res, next) {
    res.render('til/new', { title: "Create new entry", parent:'../'});
});

/*CREATE entry: POST /til/ */
router.post('/', function(req, res, next) {
    entries.push(req.body);
    req.db.driver.execQuery(
	"INSERT INTO entries (slug,body) VALUES ('" + req.body.slug + "','" + req.body.body"');"
	function(err,data){
	    if(err)
	    {
		console.log(err);
	    }
	    res.render('til/index', { title: 'Entries', parent:'../', entries: entries });
	});
});

/* UPDATE entry form: GET /til/1/edit */
router.get('/:id/edit', function(req, res, next) {
    res.render('til/update',
	       {
		   title: 'Update an entry',
		   parent:'../../',
		   id: req.params.id,
		   entry: entries[req.params.id]
	       });
});

/* UPDATE entry: POST /til/1 */
router.post('/:id', function(req, res, next){
    entries[req.params.id]=req.body;
    res.render('til/index',
	       {
		   title: 'Update an entry',
		   parent:'../',
		   entries: entries
	       });
});

/*DELETE entry: GET /til/1/delete */
router.get('/:id/delete', function(req, res, next){
    var id = req.params.id;
    entries = entries.slice(0,id).concat(entries.slice(id+1, entries.length));
    res.render('til/index', { title: 'Entries', parent:'../../', entries: entries });
});

/* READ one entry: GET /til/0 */
router.get('/:id', function(req, res, next) {
    res.render('til/entry', {title: "Entry", parent:'../', entry: entries[req.params.id]});
});

module.exports = router;
