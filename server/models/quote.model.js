'use strict';
module.exports = (sequelize, DataTypes) => {
    var Quote = sequelize.define('Quote', {

        // Price estimation
        price_estimate: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        // Date of the quote
        date_quote: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Description, comment
        description_quote: {
            type: DataTypes.STRING(5000),
            allowNull: false
        },
          // Description, comment
          name_quote: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        // Accepted quote ?
        accept_quote: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Quote.associate = function (models) {
        // associations can be defined here
        /*
        *   ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        *   ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);
        */
        Quote.belongsTo(models.Ad, { foreignKey: 'id_ad' });
        Quote.belongsTo(models.Company, { foreignKey: 'id_co' });
    }

    return Quote;
};