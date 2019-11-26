
'use strict';
module.exports = (sequelize, DataTypes) => {
    var Schedule = sequelize.define('Schedule', {
        // Id of schedule
        id_schedule: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // Days availability
        day: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        // Hours availability (text format)
        opening_time: {
            type: DataTypes.TIME(),
            allowNull: true
        },
        // Hours non availability (text format)
        closing_time: {
            type: DataTypes.TIME(),
            allowNull: true
        },
        // Night service ?
        night_service: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    });

    Schedule.associate = function (models) {
        //   ALTER TABLE SCHEDULE ADD CONSTRAINT FK_SCHEDULE_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
        Schedule.belongsTo(models.Company, { foreignKeyConstraint: true, foreignKey: 'id_co' });
    };
    
    return Schedule;
}