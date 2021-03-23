require('dotenv').config()
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')

router.use(express.json());
router.use(cookieParser());
router.use(express.static('public'));
// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '917125623041-ekqr0s49rold0bm41pjaol26oghamvdn.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

router.get('/login', (req,res)=>{
    res.render('login');
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

router.get('/dietplan', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('dietplan', {user});
});

router.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('admins/login')

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
          res.redirect('/login')
      })

}

module.exports = router;

