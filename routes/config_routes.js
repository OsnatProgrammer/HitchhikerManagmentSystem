const indexR = require("./index")
// const userR = require("./user")
// const rideOffersR = require("./rideOffers")
// const rideRequestsR = require("./rideRequests")
// const rideDetailsR = require("./rideDetails")
// const ridesR = require("./rides")
// const messagesR = require("./messages")


exports.routesInit = (app) => {
    app.use("/", indexR);
    // app.use("/user", userR);
    // app.use("/rideOffers", rideOffersR);
    // app.use("/rideRequests", rideRequestsR);
    // app.use("/rideDetails", rideDetailsR);
    // app.use("/rides", ridesR);
    // app.use("/messages", messagesR);
}

