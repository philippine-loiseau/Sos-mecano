'use strict';
module.exports = (sequelize, DataTypes) => {
    var Rating = sequelize.define('Rating', {

        // Description, comment
        description_rating: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        // Rating, evaluation
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        // Date 
        date_rating: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });
    
    Rating.associate = function (models) {
        // associations, foreign keys
        /*
        *   ALTER TABLE RATING ADD CONSTRAINT FK_RATING_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        *   ALTER TABLE RATING ADD CONSTRAINT FK_RATING_id_user FOREIGN KEY (id_user) REFERENCES USER(id_user);
        */
        Rating.belongsTo(models.Company, { foreignKey: 'id_co' });
        Rating.belongsTo(models.User, { foreignKey: 'id_user' });
    }

    return Rating;
}