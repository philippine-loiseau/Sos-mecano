'use strict';
module.exports = (sequelize, DataTypes) => {
    var Company = sequelize.define('Company', {

        // Company id -> Primary Key
        id_co: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // Company name
        name_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // SIRET
        siret: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // NAF
        naf: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // KBIS scanned
        kbis: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        // Phone
        tel_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // Address
        address_co: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        // Postal Code
        postal_code_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // City
        city_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // Boss, owner
        boss_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // Company date of creation
        creation_co: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Password
        password_co: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // Email company
        email_co: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        // Website company
        website_co: {
            type: DataTypes.STRING(25),
            allowNull: true
        }
    });

    Company.associate = function (models) {
        // associations, foreign keys
        /*
        *   ALTER TABLE USER ADD CONSTRAINT FK_USER_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        *   ALTER TABLE AD ADD CONSTRAINT FK_AD_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        *   ALTER TABLE RATING ADD CONSTRAINT FK_RATING_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        *   ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        */
        Company.hasMany(models.User, { foreignKey: 'id_co' });
        Company.hasMany(models.Rating, { foreignKey: 'id_co' });
        Company.hasMany(models.Quote, { foreignKey: 'id_co' });
        Company.hasMany(models.Schedule, { foreignKey: 'id_co' });
        
        /*
        *   ALTER TABLE COMPANY ADD CONSTRAINT FK_COMPANY_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);
        */
        //Company.belongsTo(models.Ad, { foreignKey: 'id_ad' });

    }

    return Company;
};