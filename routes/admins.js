require('dotenv').config()
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')
const multer = require('multer');
const Plan = require('../models/plan');
//bring in method override
const methodOverride = require('method-override');

router.use(express.json());
router.use(cookieParser());
router.use(methodOverride('_method'));

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '917125623041-ekqr0s49rold0bm41pjaol26oghamvdn.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

router.get('/login', (req,res)=>{
    res.render('login');
})

const storage = multer.diskStorage({
    //destination for files
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
  
    //add back the extension
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });
  
  //upload parameters for multer
  const upload = multer({
    storage: storage,
  });  

router.get('/dietplan/new', checkAuthenticated, (req,res)=>{
    let user = req.user;
    res.render('new', {user});
})

router.post('/login', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})

//view route
router.get('/dietplan/:slug', checkAuthenticated, async (req, res) => {
    let plan = await Plan.findOne({ slug: req.params.slug });
    let user = req.user;
    if (plan) {
      res.render('show', {user: user, plan: plan });
    } else {
      res.redirect('/admins/dietplan');
    }
  });
  
  //route that handles new post
  router.post('/dietplan', upload.single('image'), async (req, res) => {
    console.log(req.file);
    // console.log(req.body);
    let plan = new Plan({
      title: req.body.title,
      url: req.body.url,
      plan_description: req.body.plan_description,
      img: req.file.filename
    });
  
    try {
      plan = await plan.save();
  
      res.redirect('/admins/dietplan/${plan.slug}');
    } catch (error) {
      console.log(error);
    }
  });
  
  // route that handles edit view
  router.get('/dietplan/edit/:id', checkAuthenticated, async (req, res) => {
    let user = req.user;
    let plan = await Plan.findById(req.params.id);
    res.render('edit', {user: user, plan: plan });
  });
  
  //route to handle updates
  router.put('/dietplan/:id', checkAuthenticated, async (req, res) => {
    let user = req.user;
    req.plan = await Plan.findById(req.params.id);
    let plan = req.plan;
    plan.title = req.body.title;
    plan.url = req.body.url;
    plan.plan_description = req.body.plan_description;
  
    try {
      plan = await plan.save();
      //redirect to the view route
      res.redirect('/admins/dietplan/${plan.slug}');
    } catch (error) {
      console.log(error);
      res.redirect('/admins/dietplan/edit/${plan.id}', {user: user, plan: plan });
    }
  });
  
  ///route to handle delete
  router.delete('/dietplan/:id', checkAuthenticated, async (req, res) => {
    await Plan.findByIdAndDelete(req.params.id);
    res.redirect('/admins/dietplan');
  });
  
router.get('/dietplan', checkAuthenticated, async (req, res)=>{
    let plans = await Plan.find().sort({ timeCreated: 'desc' });
    let user = req.user;
    res.render('dietplan', {user: user, plans: plans });
});

router.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/admins/login')

});

function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/admins/login')
      })

}

module.exports = router;

