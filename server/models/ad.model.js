var models = require('../models');

'use strict';
module.exports = (sequelize, DataTypes) => {
	var Ad = sequelize.define('Ad', {

		// Ad id -> Primary Key
		id_ad: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		// Longitude of warning ad
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		// Token of approval
		token: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		// Decription of ad
		description_ad: {
			type: DataTypes.STRING(5000),
			allowNull: false
		},
		// Is accepted ?
		accept_ad: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		// Name, title of ad
		name_ad: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		// Date online 
		date_ad: {
			type: DataTypes.DATE,
			allowNull: false
		},
		// Is ad warning or not (String and not boolean for future evolutions)
		ad_type: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		// Photo
		photo_ad: {
			type: DataTypes.STRING(500)
		},
		// Latitude for warning ad
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		// Distance calculated for warning ad
		distance: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		// Date of repair
		repair_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	});

	Ad.associate = function (models) {
		// associations, foreign keys
		/*
		 *   ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);
		 *   ALTER TABLE COMPANY ADD CONSTRAINT FK_COMPANY_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);
		 */
		Ad.hasMany(models.Quote, { foreignKey: 'id_ad' });
		// Ad.hasMany(models.Company, { foreignKey: 'id_ad' });

		/*
		 *   ALTER TABLE AD ADD CONSTRAINT FK_AD_id_user FOREIGN KEY (id_user) REFERENCES USER(id_user);
		 *   ALTER TABLE AD ADD CONSTRAINT FK_AD_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
		 *   ALTER TABLE AD ADD CONSTRAINT FK_AD_id_car FOREIGN KEY (id_car) REFERENCES CAR(id_car);
		 */
		Ad.belongsTo(models.User, { foreignKey: 'id_user' });
		Ad.belongsTo(models.Car, { foreignKey: 'id_car' });
	}

	return Ad;
};