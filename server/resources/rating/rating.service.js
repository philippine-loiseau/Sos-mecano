var models = require('../../models');
var debug = require('debug')('server:server');

class RatingService {

    // Rating Creation
    createRating(ratingToCreate) {
        return models.Rating.create({
            description_rating: ratingToCreate.description_rating,
            rating: ratingToCreate.rating,
            date_rating: ratingToCreate.date_rating,
            id_co: ratingToCreate.id_co
        });
    }

    // Average rating for a selected company
    getAverageRating(ratingToFind) {
        return model.Rating.find({
            where: { id_co: ratingToFind.id_co },
            attributes: ['id_co', [sequelize.fn('AVG', sequelize.col('rating'))]],
            group: ['id_co']
        })
    }
}

module.exports = new RatingService();