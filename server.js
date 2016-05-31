// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var mongoose = require('mongoose');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var nodemailer = require('nodemailer');
var multer  =   require('multer');
var fs = require("fs");

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// configuration
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

mongoose.connect('mongodb://localhost/boredrill-eazybiz');     // connect to mongoDB database

var Schema = mongoose.Schema;

// user account schema
var projectSchema = new Schema({
    project_name: String,
    project_description: String,
    images: [String]
});

var Projects = mongoose.model('Projects', projectSchema);

module.exports = Projects;

var latestJobsSchema = new Schema({
    project_name: String,
    project_description: String,
    images: [String]
});

var LatestJobs = mongoose.model('LatestJobs', latestJobsSchema);

module.exports = LatestJobs;

var mailSchema = new Schema({
    name: String,
    email: String,
    phone: Number,
    images: [String],
    subject: String,
    status: String,
    message: String,
    date: { type: Date, default: Date.now }
});

var Mails = mongoose.model('Mails', mailSchema);

module.exports = Mails;

// listen (start app with node server.js) ======================================
app.listen(8000);
console.log("App listening on port 8000");

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "eazybiz.biz@gmail.com",
      pass: "s02Ma#eazybuyeazysell#Ne89M"
    }
});

// file upload code
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var uploadMultiple = multer({ //multer settings
        storage: storage
    }).array('file',20);

var uploadSingle = multer({ //multer settings
        storage: storage
    }).single('file');

app.get('/', function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
});

app.get('/321889_786921', function(req, res) {
    res.sendfile('./public/321889_786921/index.html');
});


/** API for single file upload */
app.post('/api/uploadPhoto', function(req, res) {
    uploadSingle(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json(req.file);
    })

});

/** API for single file upload */
app.post('/api/uploadPhotos', function(req, res) {
    uploadMultiple(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json(req.files);
    })

});

// admin login
app.post('/api/adminLogin', function(req, res) {
    if(req.body.email == 'eazyboredrill' && req.body.password == 'eazyboredrilladmin1') {
        return res.json({"message":"success"});
    }
    else {
        return res.json({"message":"Invalid Credentials"});
    }
});

// send mail
app.post('/api/sendMail', function(req, res) {
        // send mail
      var mail = req.body;
      mail.status = 'INBOX';
      Mails.create(mail, function(err, mails) {
          if (err)
              res.send(err);
      });
      var msg = {
        html: "<p><strong>Name: </strong>" + req.body.name + "</p><p><strong>Email: </strong>" + req.body.email + "</p><p><strong>Phone: </strong>" + req.body.phone + "</p><p><strong>Message: </strong>" + req.body.message + "</p>",
        createTextFromHtml: true,
        from: "<eazybiz.biz@gmail.com>",
        to: "<eazybiz.biz@gmail.com>",
        subject: "Message from boredrill website"
      };
      transport.sendMail(msg, function (err) {
        if (err) {
          return;
        }
        return res.json({"message":"Message sent successfully."});
      });
});

// send custom mail
app.post('/api/sendCustomMail', function(req, res) {
      var attachment = [];
      if(req.body.images) {
          var attachmentImages = req.body.images;
          for(var i = 0;i<attachmentImages.length;i++) {
              var imageNumber = i + 1;
              var imageName = 'EazyBore Image ' + imageNumber;
              attachment.push({path: attachmentImages[i]});
          }
      }
      var mail = {name: 'EazyBiz',email: req.body.to, status: 'SENT', message: req.body.message, subject: req.body.subject, images : req.body.images};
      Mails.create(mail, function(err, mails) {
          if (err)
              res.send(err);
      });
      var msg = {
        html: req.body.message,
        createTextFromHtml: true,
        from: "<eazybiz.biz@gmail.com>",
        to: req.body.to,
        subject: req.body.subject,
        attachments: attachment
      };
      transport.sendMail(msg, function (err) {
        if (err) {
          return;
        }
        return res.json({"message":"Message sent successfully."});
      });
});

// update mail status
app.put('/api/updateMail', function(req, res) {
    Mails.update({_id : { $in: req.body.updateMailList }}, {status: req.body.status}
    ,{multi:true}, function(err, mail) {
        if (err)
        {
            res.send(err);
        }
        return res.json({"message":"Updated successfully."});
    });
});

// delete mail
app.delete('/api/deleteMail', function(req, res) {
    Mails.remove({
        _id : { $in: req.body.deleteMailList }
    }, function(err, mail) {
        if (err)
            res.send(err);
        Mails.find(function(err, mails) {
            if (err)
                res.send(err)
            res.json(mails); // return all advertisement in JSON format
        });
    });
});

// get products
app.post('/api/getEmailIds', function(req, res) {
    Mails.find({"email": new RegExp(req.body.email_search, "i")},function(err, mails) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(mails); // return all mails in JSON format
    });
});


/** API for sending mail to admin */
app.post('/api/forgotAdminPassword', function(req, res) {
   var msg = {
      html: "<b>Hello!</b><p>Your password for Eazy Boredrill account <strong>eazyboredrill</strong> is <strong>eazyboredrilladmin1</strong></p>.",
      createTextFromHtml: true,
      from: "<eazybiz.biz@gmail.com>",
      to: "<eazybiz.biz@gmail.com>",
      subject: "Eazy Boredrill Credentials"
    };
    transport.sendMail(msg, function (err) {
      if (err) {
        return;
      }


      return res.json({"successMessage":"Credentials has been sent to your Email."});
    });

});

// Mail API

// add project
app.post('/api/addProject', function(req, res) {
    var delete_images = req.body.delete_images;

    Projects.create(req.body.projectData, function(err, projects) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        if(projects) {
            return res.json({"message":"Project has been added successfully."});
        }
    });
    if(delete_images.length > 0) {
        delete_images.forEach(function(file_path) {
          fs.unlink(file_path);
        });
    }

});

// update project
app.put('/api/updateProject', function(req, res) {
    var delete_images = req.body.delete_images;
    Projects.findByIdAndUpdate(req.body.projectData._id, req.body.projectData
    , function(err, projects) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        return res.json({"message":"Updated successfully."});
    });
});

// delete project
app.delete('/api/removeProject', function(req, res) {
    var delete_images = req.body.images;
    Projects.remove({
        _id : req.body._id
    }, function(err, project) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        Projects.find(function(err, projects) {
            if (err)
                res.send(err)
            res.json(projects); // return all advertisement in JSON format
        });
    });
});

// get mails
app.post('/api/getMails', function(req, res) {
    Mails.find(req.body, function(err, mails) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(mails); // return all advertisement in JSON format
    });
});


// Projects API

// add project
app.post('/api/addProject', function(req, res) {
    var delete_images = req.body.delete_images;

    Projects.create(req.body.projectData, function(err, projects) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        if(projects) {
            return res.json({"message":"Project has been added successfully."});
        }
    });
    if(delete_images.length > 0) {
        delete_images.forEach(function(file_path) {
          fs.unlink(file_path);
        });
    }

});

// update project
app.put('/api/updateProject', function(req, res) {
    var delete_images = req.body.delete_images;
    Projects.findByIdAndUpdate(req.body.projectData._id, req.body.projectData
    , function(err, projects) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        return res.json({"message":"Updated successfully."});
    });
});

// delete project
app.delete('/api/removeProject', function(req, res) {
    var delete_images = req.body.images;
    Projects.remove({
        _id : req.body._id
    }, function(err, project) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        Projects.find(function(err, projects) {
            if (err)
                res.send(err)
            res.json(projects); // return all advertisement in JSON format
        });
    });
});

// get projects
app.post('/api/getProjects', function(req, res) {
    Projects.find(req.body.projectData, function(err, projects) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(projects); // return all advertisement in JSON format
    });
});

// Latest Jobs API

// add latestJob
app.post('/api/addLatestJob', function(req, res) {
    var delete_images = req.body.delete_images;

    LatestJobs.create(req.body.latestJobData, function(err, latestJob) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        if(latestJob) {
            return res.json({"message":"Project has been added successfully."});
        }
    });
    if(delete_images.length > 0) {
        delete_images.forEach(function(file_path) {
          fs.unlink(file_path);
        });
    }

});

// update latestJob
app.put('/api/updateLatestJob', function(req, res) {
    var delete_images = req.body.delete_images;
    LatestJobs.findByIdAndUpdate(req.body.latestJobData._id, req.body.latestJobData
    , function(err, latestJob) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        return res.json({"message":"Updated successfully."});
    });
});

// delete latestJob
app.delete('/api/removeLatestJob', function(req, res) {
    var delete_images = req.body.images;
    LatestJobs.remove({
        _id : req.body._id
    }, function(err, latestJob) {
        if (err)
            res.send(err);
        if(delete_images.length > 0) {
            delete_images.forEach(function(file_path) {
              fs.unlink(file_path);
            });
        }
        LatestJobs.find(function(err, latestJobs) {
            if (err)
                res.send(err)
            res.json(latestJobs); // return all advertisement in JSON format
        });
    });
});

// get latestJobs
app.post('/api/getLatestJobs', function(req, res) {
    LatestJobs.find(req.body.latestJobData, function(err, latestJobs) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(latestJobs); // return all advertisement in JSON format
    });
});