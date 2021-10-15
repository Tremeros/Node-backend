const express = require('express')
const fs = require('fs')
const cors = require('cors')
const { check, validationResult } = require('express-validator/check')

const dataBase = JSON.parse(
	fs.readFileSync(`${__dirname}/database.json`, 'utf8')
)

const port = 5000

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.status(200).json(dataBase)
})

app.post('/dishes', (req, res) => {
	const newId = dataBase[dataBase.length - 1].id + 1
	const newElement = Object.assign({ id: newId }, req.body)
	// console.log('Body' + JSON.parse(req.body))
	dataBase.push(newElement)
	fs.writeFile(
		`${__dirname}/database.json`,
		JSON.stringify(dataBase),
		(err) => {
			res.status(201).json(newElement)
		}
	)
})

app.delete('/:id', (req, res) => {
	const index = dataBase.findIndex((item) => item.id == req.params.id)
	dataBase.splice(index, 1)

	if (index === -1) {
		res.status(404).json({ status: 'Fail', message: 'Invalid ID' })
	} else {
		fs.writeFile(
			`${__dirname}/database.json`,
			JSON.stringify(dataBase),
			(err) => {
				res.status(200).json(dataBase)
			}
		)
	}
})

app.listen(port, () => {
	console.log('Server is running on port' + port)
})
