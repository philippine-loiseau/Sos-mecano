var models = require('../../models');
var debug = require('debug')('server:server');
var NodeResponse = require('../../models/virtual-models/node-response');
var bCrypt = require('bcrypt-nodejs');

class CompanyService {

    // get Company by its ID
    getCompanyById(idCompany) {
        return models.Company.findOne({
            where: { id_co: idCompany }
        })
    }

    // Login Company
    loginCompany(company) {
        return models.Company.findOne({
            where: { email_co: company.email_co }
        })
    }

    // Search filter Company
    filterCompaniesByKeyword(query) {
        return models.Company.findAll({
            where: {
                $or: [
                    { address_co: { like: '%' + query + '%' } },
                    { name_co: { like: '%' + query + '%' } },
                    { tel_co: { like: '%' + query + '%' } },
                    { postal_code_co: { like: '%' + query + '%' } },
                    { city_co: { like: '%' + query + '%' } },
                    { website_co: { like: '%' + query + '%' } },
                ]
            }
        })
    }

    // Kbis creation
    createUncompleteCompany(companyToCreate){

        return models.Company.create({
            kbis: companyToCreate.kbis
        })
    }

    // Company creation
    createCompany(companyToCreate, callback) {
        companyToCreate.password_co = _generateHash(companyToCreate.password_co);
        if(companyToCreate.kbis){
            models.Company.create({
                kbis: companyToCreate.kbis
            }).then( company => {
                companyToCreate.id_co = company.id_co;
                callback(companyToCreate);
            })
        }else {
            if(companyToCreate.id_co){
                this.updateCompany(companyToCreate, callback);
            }else {
                models.Company.create({
                    name_co: companyToCreate.name_co,
                    siret: companyToCreate.siret,
                    naf: companyToCreate.name_co,
                    kbis: companyToCreate.kbis,
                    tel_co: companyToCreate.tel_co,
                    address_co: companyToCreate.address_co,
                    postal_code_co: companyToCreate.postal_code_co,
                    city_co: companyToCreate.city_co,
                    boss_co: companyToCreate.boss_co,
                    creation_co: companyToCreate.creation_co,
                    password_co: companyToCreate.password_co,
                    website_co: companyToCreate.website_co,
                    email_co : companyToCreate.email_co
                })
                    .then(company => {
                        _createSchedule(companyToCreate.workSchedules, company.id_co)
                        callback(companyToCreate)
                    })
            }
        } 
    }

    // Company update
    updateCompany(companyToUpdate, callback) {
        models.Company.findOne({ where: { id_co: companyToUpdate.id_co } })
            .then(company => {

                if(company){

                _checkIfNotAssigned(companyToUpdate, company)

                models.Company.update({
                    name_co: companyToUpdate.name_co,
                    siret: companyToUpdate.siret,
                    naf: companyToUpdate.name_co,
                    kbis: companyToUpdate.kbis,
                    tel_co: companyToUpdate.tel_co,
                    address_co: companyToUpdate.address_co,
                    postal_code_co: companyToUpdate.postal_code_co,
                    city_co: companyToUpdate.city_co,
                    boss_co: companyToUpdate.boss_co,
                    creation_co: companyToUpdate.creation_co,
                    password_co: companyToUpdate.password_co,
                    opening_day: companyToUpdate.opening_day,
                    opening_time: companyToUpdate.opening_time,
                    closing_time: companyToUpdate.closing_time,
                    night_service: companyToUpdate.night_service,
                    website_co: companyToUpdate.website_co
                }, {
                        where: { id_co: companyToUpdate.id_co }
                    })
                    .then(companiesUpdated => callback(companiesUpdated))
                }
                });
    }
}

/**
 * Private functions
 */

function _generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

function _createSchedule(workSchedules, companyId) {
    for(var i = 0; i<workSchedules.workDay.length; i++)
    {
        let workDay = workSchedules.workDay[i];
        models.Schedule.create({
            day: workDay.day,
            opening_time: workDay.opening_time,
            closing_time: workDay.closing_time,
            night_service: workDay.night_service,
            id_co: companyId
        })
    }
}

// Avoid undefined / null or empty fields update
function _checkIfNotAssigned(companyToUpdate, company) {
    if (!companyToUpdate.name_co) {
        companyToUpdate.name_co = company.name_co;
    }
    if (!companyToUpdate.siret) {
        companyToUpdate.siret = company.siret;
    }
    if (!companyToUpdate.naf) {
        companyToUpdate.naf = company.naf;
    }
    if (!companyToUpdate.kbis) {
        companyToUpdate.kbis = company.kbis;
    }
    if (!companyToUpdate.tel_co) {
        companyToUpdate.tel_co = company.tel_co;
    }
    if (!companyToUpdate.address_co) {
        companyToUpdate.address_co = company.tel_co;
    }
    if (!companyToUpdate.postal_code_co) {
        companyToUpdate.postal_code_co = company.postal_code_co;
    }
    if (!companyToUpdate.city_co) {
        companyToUpdate.city_co = company.city_co;
    }
    if (!companyToUpdate.boss_co) {
        companyToUpdate.boss_co = company.boss_co;
    }
    if (!companyToUpdate.creation_co) {
        companyToUpdate.creation_co = company.creation_co;
    }
    if (!companyToUpdate.password_co) {
        companyToUpdate.password_co = company.password_co;
    }
    if (!companyToUpdate.opening_day) {
        companyToUpdate.opening_day = company.opening_day;
    }
    if (!companyToUpdate.opening_time) {
        companyToUpdate.opening_time = company.opening_time;
    }
    if (!companyToUpdate.closing_time) {
        companyToUpdate.closing_time = company.closing_time;
    }
    if (!companyToUpdate.night_service) {
        companyToUpdate.night_service = company.night_service;
    }
    if (!companyToUpdate.website_co) {
        companyToUpdate.website_co = company.website_co;
    }
}

module.exports = new CompanyService();