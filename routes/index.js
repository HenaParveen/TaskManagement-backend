const express = require("express");
const v1Routes = require("./v1");

const router = express.Router(); //router is insan to route the req to specific location

/* second level of routing till api keyword */
router.use("/v1", v1Routes);

module.exports = router;
