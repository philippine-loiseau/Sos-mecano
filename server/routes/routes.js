var express = require('express');
var router = express.Router();
var passport = require('passport');

// Require our controllers
var adController = require('../resources/ads/ad.controller');
var carController = require('../resources/cars/car.controller');
var companyController = require('../resources/company/company.controller');
var quoteController = require('../resources/quotes/quote.controller');
var ratingController = require('../resources/rating/rating.controller');
var userController = require('../resources/users/user.controller');
var authenticationService = require('../resources/authentication/authentication.service');

// Routes to adController
router.get('/ads/getAdById', adController.getAd);
router.get('/ads/getAds', adController.getAds);
router.get('/ads/getAdsWarning', adController.getAdsWarning);
router.get('/ads/getDefaultAds', adController.getDefaultAds);
router.post('/ads/createAd', adController.createAd);
router.get('/ads/search', adController.filterAdsByKeyword);
router.post('/ads/deleteAd', adController.deleteAd);
router.get('/ads/getDefaultAdsByUser', adController.getDefaultAdsByUser);
router.get('/ads/getAdsWithQuotes', adController.getAdsWithQuotes);

// Routes to carController
router.get('/car/createCar', carController.createCar);
router.post('/car/updateCar', carController.updateCar);
router.post('/car/deleteCar', carController.deleteCar);
router.get('/car/getCar', carController.getCar);
router.get('/car/getUserCars', carController.getUserCars);

// Routes to companyController
router.post('/company/createCompany', companyController.createCompany);
router.post('/company/updateCompany', companyController.updateCompany);
router.get('/company/search', companyController.filterCompaniesByKeyword);
router.get('/company/getCompany', companyController.getCompanyById);

// Routes to quoteController
router.post('/quote/createQuote', quoteController.createQuote);
router.post('/quote/updateQuote', quoteController.updateQuote);
router.post('/quote/deleteQuote', quoteController.deleteQuote);
router.get('/quote/getWaitingQuotes', quoteController.getWaitingQuotes);
router.post('/quote/acceptQuote', quoteController.acceptQuote);
router.get('/quote/getAcceptQuotes', quoteController.getAcceptQuotes);
router.get('/quote/getWaitingQuoteForCompany', quoteController.getWaitingQuotesByCompany);
router.get('/quote/getQuotesByAd', quoteController.getAdQuotes);
router.get('/quote/getValidatedQuoteByAd', quoteController.getValidatedQuoteByAd);
router.get('/quote/getAdsWithAcceptedQuotes', quoteController.getAdsWithAcceptedQuotes);
router.get('/quote/getAdsWithRefusedQuotes', quoteController.getAdsWithRejectedQuotes);

// Routes to ratingController
router.post('/rating/createRating', ratingController.createRating);
router.get('/rating/getAverageRating', ratingController.getAverageRating);

// Routes to userController
router.post('/users/createUser', userController.createUser);
router.get('/users/getUser', userController.getUserById);

// Login
router.post('/signin', userController.signin);

module.exports = router;