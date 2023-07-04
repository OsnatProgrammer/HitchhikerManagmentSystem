const indexR = require("./index")
const userR = require("./user")
const rideOffersR = require("./rideOffers")
const rideRequestsR = require("./rideRequests")
const rideDetailsR = require("./rideDetail")
const ridesR = require("./rides")
const messagesR = require("./messages")
const algorithmR = require("./algorithm")
const uploadR = require("./upload");


exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/users", userR);
    app.use("/rideOffers", rideOffersR);
    app.use("/rideRequests", rideRequestsR);
    app.use("/rideDetails", rideDetailsR);
    app.use("/rides", ridesR);
    app.use("/messages", messagesR);
    app.use("/algorithm", algorithmR);
    app.use("/upload", uploadR);
    
}


