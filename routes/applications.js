const express = require("express");
const applicationCtrl = require("../controller/applications");

// Middleware xác thực JWT (JSON Web Token)
const jwtAuth = require("../middleware/jwtAuth");

// Create a router object from Express
const router = express.Router();

// Get all applications , protected by JWT authentication
router.get("/", applicationCtrl.getAllApplications);
router.get("/:id", applicationCtrl.getIdApplicant);
router.post("/resume", jwtAuth, applicationCtrl.resumeApplication);
router.get("/get/getAllResume", applicationCtrl.getAllResume);
// Update the status of an applications, protected by JWT authentcation
router.put("/:id", jwtAuth, applicationCtrl.updateStatusApplication);
router.delete('/delete/:id',jwtAuth, applicationCtrl.applicationDelete);

module.exports = router;
