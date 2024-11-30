const multer = require("multer");
const express = require("express");
const { default: mongoose } = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".pdf");
  },
});

const upload = multer({ storage: storage });

router.post("/resume", upload.single("resume"), async (req, res) => {

  const fileName = req.file.filename;        
  const id = req.body.userId;
  const mobile = req.body?.phoneNumber || `0(000)-0000`;
  

  try {
    const applicant = await ApplicantSchema.findOne({         
      userId: id,
    });
    if (!applicant) {
      return res.status(404).json({
        message: "User does not exist",     
      });
    }
    // Update resume filename
    if (fileName) {
      applicant.resume = fileName;
    }

    // Update phone number
    if (mobile) {
      applicant.mobile = mobile;
    }

    await applicant.save();
    res.send({ status: "upload oke" });
  } catch (error) {   
    res.json({ status: error });  
  }

});



module.exports = router;
