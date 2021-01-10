const express = require("express")
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const app = express()
dotenv.config()
app.use(express.json());
//const bcrypt = require("bcryptjs");
const mongoClient = mongodb.MongoClient;

const dburl = process.env.DB_URL; // local db url

app.post("/login", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        requiredKeys = ["email", "password"];
        Keys = Object.keys(request.body)
        if (requiredKeys.every((key) => Keys.includes(key)) && (Keys.length === requiredKeys.length)) {
            let isPresentClients = await db
                .collection("Admin-users")
                .findOne({
                    email: request.body.email
                });
            let isAdminPresent = await db
                .collection("Admins")
                .findOne({
                    email: request.body.email
                });
            if (isAdminPresent && bcrypt.compareSync(request.body.password, isAdminPresent.password)) {
                response.status(202).json({
                    msg: "Login success"
                });
            } else if (isPresentClients && bcrypt.compareSync(request.body.password, isPresentClients.password)) {
                response.status(202).json({
                    msg: "Login success"
                });
            } else if ((isAdminPresent && !bcrypt.compareSync(request.body.password, isAdminPresent.password)) ||
                (isPresentClients && !bcrypt.compareSync(request.body.password, isPresentClients.password))) {
                response.status(401).json({
                    msg: "Wrong Password"
                });
            } else {
                response.status(404).json({
                    msg: "User Not Found"
                });
            }
        } else {
            response.status(406).json({
                msg: "Required details not found"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }

});

app.post("/register", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        if (request.body.email && request.body.name && request.body.password) {
            let isPresent = await db
                .collection("users_details")
                .findOne({
                    email: request.body.email
                });
            let total = await db.collection("users_details").find().toArray();
            if (isPresent) {
                response.status(406).json({
                    msg: "User already registered"
                });
            } else {
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(request.body.password, salt);
                request.body.password = hash;
                request.body["ID"] = total.length + 1;
                let result = await db.collection("users_details").insertOne(request.body);
                response
                    .status(202)
                    .json({
                        msg: "User registered successfully",
                        ID: request.body.ID
                    });
            }
        } else {
            response.status(406).json({
                msg: "Required details not found"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});

app.post("/theatre", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        if (request.body.name && request.body.address && request.body.rating) {
            let isPresent = await db
                .collection("theatre_details")
                .findOne({
                    name: request.body.name
                });
            let total = await db.collection("theatre_details").find().toArray();
            if (isPresent) {
                response.status(406).json({
                    msg: "theatre name already exist"
                });
            } else {
                request.body["ID"] = total.length + 1;
                let result = await db.collection("theatre_details").insertOne(request.body);
                response
                    .status(202)
                    .json({
                        msg: "theatre registered successfully",
                        ID: request.body.ID
                    });
            }
        } else {
            response.status(406).json({
                msg: "Theatre details not found"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});

app.delete("/theatre", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        var myquery = { name: request.body.name };
        let db = client.db("Ticket_Booking");
        db.collection("theatre_details").deleteOne(myquery, function(err, res) {
            if (err) throw err;
            //console.log("1 document deleted");
            response.status(406).json({
                msg: "1 document deleted"
            });


        });


    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});

app.post("/films", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        if (request.body.name && request.body.theatrassn && request.body.rating) {
            let isPresent = await db
                .collection("film_details")
                .findOne({
                    name: request.body.name
                });
            let total = await db.collection("film_details").find().toArray();
            if (isPresent) {
                response.status(406).json({
                    msg: "film name already allocatted"
                });
            } else {
                request.body["ID"] = total.length + 1;

                let result = await db.collection("film_details").insertOne(request.body);
                response
                    .status(202)
                    .json({
                        msg: "film assigned to theatre successfully",
                        ID: request.body.ID
                    });
            }
        } else {
            response.status(406).json({
                msg: "No theatre available"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});
app.post("/booking", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        if (request.body.name && request.body.email && request.body.status) {
            let isPresent = await db
                .collection("booking_details")
                .findOne({
                    name: request.body.name
                });
            let total = await db.collection("booking_details").find().toArray();
            if (isPresent) {
                response.status(406).json({
                    msg: "Booking unavailable"
                });
            } else {
                request.body["ID"] = total.length + 1;

                let result = await db.collection("booking_details").insertOne(request.body);
                response
                    .status(202)
                    .json({
                        msg: "booking done successfully",
                        ID: request.body.ID
                    });
            }
        } else {
            response.status(406).json({
                msg: "Booking cancelled"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});

app.post("/booking", async(request, response) => {
    try {
        let client = await mongoClient.connect(dburl);
        let db = client.db("Ticket_Booking");
        if (request.body.name && request.body.email && request.body.status) {
            let isPresent = await db
                .collection("booking_details")
                .findOne({
                    name: request.body.name
                });
            let total = await db.collection("booking_details").find().toArray();
            if (isPresent) {
                response.status(406).json({
                    msg: "Booking unavailable"
                });
            } else {
                request.body["ID"] = total.length + 1;

                let result = await db.collection("booking_details").insertOne(request.body);
                response
                    .status(202)
                    .json({
                        msg: "booking done successfully",
                        ID: request.body.ID
                    });
            }
        } else {
            response.status(406).json({
                msg: "Booking cancelled"
            });
        }
    } catch (err) {
        console.info("ERROR : ", err);
        response.sendStatus(500);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port} .....`));