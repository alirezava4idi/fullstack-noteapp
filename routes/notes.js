const router = require("express").Router();
const queries = require("../db/queries")

const authenticateToken = require('../lib/authenticate');
const { route } = require("./auth");

router.get("/", authenticateToken, (req, res) => {
	queries.notes.getAll(req.user.id).then(rows => {
		res.status(200).json(rows)
	})
});

router.post("/create", authenticateToken, async (req, res) => {
	const response = await queries.notes.create({user_id: req.user.id, content: req.body.content})
	if (response) {
		queries.notes.getOne(response).then(row => {
			res.status(201).json(row);
		})
	} else {
		res.sendStatus(500);
	}
})

router.put("/update", authenticateToken, async (req, res) => {
	const response = await queries.notes.updateOne(req.body)
	if(response){
		res.sendStatus(200)
	}else{
		res.sendStatus(500)
	}
})

router.delete("/delete", authenticateToken, async (req, res) => {
	const response = await queries.notes.deleteOne(req.body.id)
	console.log(response)
	if(response){
		res.sendStatus(200)
	}else{
		res.sendStatus(500)
	}
})



module.exports = router;
