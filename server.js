const { json } = require('express')
const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require('cors')
const app = express()
const PORT = 4000

const authRoute = require("./routes/auth")
const notesRoute = require("./routes/notes")
app.use(
	cors({
        origin: "http://localhost:5000",
        credentials: true
	})
);
app.use(cookieParser())
app.use(express.json())

app.use("/api/user", authRoute)
app.use("/api/notes", notesRoute)

app.listen(process.env.PORT || PORT, () => {
    console.log(`SERVER is running on PORT ${process.env.PORT || PORT}`)
})