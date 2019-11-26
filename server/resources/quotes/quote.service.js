var models = require('../../models');
var debug = require('debug')('server:server');
var adService = require('../ads/ad.service');

class QuoteService {

    // get Quote by its ID
    getQuote(idQuoteToFind) {
        return models.Quote.findOne({ where: { id: idQuoteToFind } })
    }

    // get Quotes for an AD
    getAdQuotes(idAdToFind) {
        return models.Quote.findAll({
            where: {
                id_ad: idAdToFind
            }
        })
    }

    getValidatedQuoteByAd(idAdToFind) {
        return models.Quote.findOne({
            where: {
                id_ad: idAdToFind,
                accept_quote: true
            }
        })
    }

    // get Waiting quotes by User id
    getWaitingQuotes(userId, callback) {
        adService.getUsersAd(userId).then(ads => {
            models.Quote.findAll({
                where: {
                    id_ad: ads[0].id_ad,
                    accept_quote: false
                }
            }).then(quotes => callback(quotes));
        });
    }

    // get Wainting quotes by company id
    getWaitingQuotesByCompany(idCo) {
        return models.Quote.findAll({
            where: {
                id_co: idCo,
                accept_quote: false
            }
        });
    }

    // get Accept quotes by User id
    getAcceptQuotes(userId, callback) {
        adService.getUsersAd(userId).then(ads => {
            models.Quote.findAll({
                where: {
                    id_ad: ads[0].id_ad,
                    accept_quote: true
                }
            }).then(quotes => callback(quotes));
        });
    }

    // Quote Creation
    createQuote(quoteToCreate) {
        return models.Quote.create({
            price_estimate: quoteToCreate.price_estimate,
            date_quote: quoteToCreate.date_quote,
            description_quote: quoteToCreate.description_quote,
            name_quote: quoteToCreate.name_quote,
            id_ad: quoteToCreate.id_ad,
            id_co: quoteToCreate.id_co
        });
    }

    // Quote Update
    updateQuote(quoteToUpdate, callback) {
        models.Quote.findOne({ where: { id_ad: quoteToUpdate.id_ad } }).then(quote => {

            _checkIfNotAssigned(quoteToUpdate, quote);

            models.Quote.update({
                price_estimate: quoteToUpdate.price_estimate,
                date_quote: quoteToUpdate.date_quote,
                description_quote: quoteToUpdate.description_quote,
                accept_quote: quoteToUpdate.accept_quote,
            }, 
            {
                where: { name_quote: quoteToUpdate.name_quote }
            }).then(quotesUpdated => {
                callback(quotesUpdated)
            })
        })
    }

    // Delete Quote
    deleteQuote(quoteToDelete) {
        return models.Quote.destroy({ where: { id_ad: quoteToDelete.id_ad } });
    }

    getCustomObjectAcceptedOrRejectedQuotes(idCo, accepted) {
        if (accepted) {
            return this.getAcceptedQuotesWithAd(idCo);
        } else {
            return this.getRefusedQuotesWithAd(idCo);
        }
    }

    getAcceptedQuotesWithAd(idCo) {
        return models.Quote.findAll({
            where: {
                accept_quote: true,
                id_co: idCo
            },
            include: [{
                model: models.Ad,
                where: {
                    accept_ad: true,
                    ad_type: 'Réparation'
                },
                include: [models.User]
            }]
        })
    }

    getRefusedQuotesWithAd(idCo) {
        return models.Quote.findAll({
            where: {
                accept_quote: false,
                id_co: idCo
            },
            include: [{
                model: models.Ad,
                where: {
                    accept_ad: true,
                    ad_type: 'Réparation'
                },
                include: [models.User]
            }]
        })
    }
}

/**
 * Private functions
 */

// Avoid undefined / null or empty fields update
function _checkIfNotAssigned(quoteToUpdate, quote) {
    if (!quoteToUpdate.price_estimate) {
        quoteToUpdate.price_estimate = quote.price_estimate;
    }
    if (!quoteToUpdate.date_quote) {
        quoteToUpdate.date_quote = quote.date_quote;
    }
    if (!quoteToUpdate.description_quote) {
        quoteToUpdate.description_quote = quote.description_quote;
    }
    if (!quoteToUpdate.accept_quote) {
        quoteToUpdate.accept_quote = quote.accept_quote;
    }
}

module.exports = new QuoteService();