const router = require('./index');
var passport = require('passport-mfp-token-validation').Passport;
var mfpStrategy = require('passport-mfp-token-validation').Strategy;

const mfpUrl =
  'https://mobilefoundation.mofoso-testing-c33bf0f22ab59313b3628c493e016b88-0000.us-south.containers.appdomain.cloud';

passport.use(
  new mfpStrategy({
    authServerUrl: `${mfpUrl}/mfp/api`,
    confClientID: 'external',
    confClientPass: 'external',
    analytics: {
      onpremise: {
        url: `${mfpUrl}/analytics-service/rest/v3`,
        username: 'admin',
        password: 'admin'
      }
    }
  })
);

router.get(
  '/account',
  passport.authenticate('mobilefirst-strategy', {
    session: false,
    scope: 'userlogin'
  }),
  (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.send({
      accountNumber: '1234 1234 1234 4444',
      name: 'CHETHAN KUMAR SN',
      balance: 8000000,
      recentTransactions: [
        {
          txn: 'Electricity Bill',
          amt: '240'
        },
        {
          txn: 'Phone Bill',
          amt: '140'
        }
      ]
    });
  }
);
