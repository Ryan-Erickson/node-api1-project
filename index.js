// This import is pulling from node_modules now
const express = require("express")
const db = require("./database.js")

const server = express()

// This is installing some middleware to allow Express
// to parse JSON request bodies.
server.use(express.json())

server.get("/api/users", (req, res) => {
	const users = db.getUsers()
	res.json(users)
})

server.get("/api/users/:id", (req, res) => {
	// The param variable matches up to the name of our URL param above
	const user = db.getUserById(req.params.id)

	// Since we're now taking in values from the client,
	// we need to make sure the value is valid before trying to use it
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.post("/api/users", (req, res) => {
	// never trust data coming from the client,
	// always validate it to some degree. make sure it's what you're expecting
	if (!req.body.name) {
		return res.status(400).json({
			message: "Need a name for the user",
		})
	}

	const newUser = db.createUser({
		name: req.body.name,
	})

	res.status(201).json(newUser)
})

server.put("/api/users/:id", (req, res) => {
	const user = db.getUserById(req.params.id)

	// can't update a user that doesn't exist, so check first
	if (user) {
		const updatedUser = db.updateUser(user.id, {
			// we whitelist values here instead of passing req.body directly,
			// so we know exactly what's allowed to be updated and what's not.
			name: req.body.name || user.name,
		})

		res.json(updatedUser)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.delete("/api/users/:id", (req, res) => {
	const user = db.getUserById(req.params.id)

	if (user) {
		db.deleteUser(user.id)
		// 204 is just a successful empty response,
		res.json(user)
		res.status(204).end()
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.listen(8080, () => {
	console.log("server started on port 8080")
})

//GET



//POST



//PUT



//DELETE 