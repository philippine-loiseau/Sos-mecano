var models = require('../../models');
var debug = require('debug')('server:server');
var constants = require('../../../server/utils/constants');
var responseUtils = require('../../utils/response.utils');
var companyService = require('./company.service');
var NodeResponse = require('../../models/virtual-models/node-response');

class CompanyController {
  // get Company
  getCompany(req, res) {
    companyService.getCompany(req.body).then(
      company => {
        return responseUtils.returnGeneralResponse(
          company,
          constants.INFO_NO_COMPANY_FOUND,
          res
        );
      },
      error => {
        return responseUtils.returnGeneralError(error, res);
      }
    );
  }

  // Company creation
  createCompany(req, res) {
    companyService.createCompany(
      req.body,
      company => {
        return responseUtils.returnGeneralResponse(
          company,
          constants.INFO_NO_COMPANY_FOUND,
          res
        );
      },
      error => {
        return responseUtils.returnGeneralError(error, res);
      }
    );
  }

  // Company update
  updateCompany(req, res) {
    companyService.updateCompany(
      req.body,
      companies => {
        return responseUtils.returnGeneralResponse(
          companies,
          constants.ERR_NO_COMPANY_UPDATED,
          res
        );
      },
      error => {
        return responseUtils.returnGeneralError(error, res);
      }
    );
  }

  // Search filter Company
  filterCompaniesByKeyword(req, res) {
    companyService.filterCompaniesByKeyword(req.query.term).then(
      companies => {
        return responseUtils.returnGeneralResponse(
          companies,
          constants.INFO_NO_COMPANY_FOUND,
          res
        );
      },
      error => {
        return responseUtils.returnGeneralError(error, res);
      }
    );
  }

  //get company by id
  getCompanyById(req, res) {
    var userSession = req.app.get('user');
    var idCo = userSession ? userSession.id_co: req.query.id;

    companyService.getCompanyById(idCo).then(
      companies => {
        return responseUtils.returnGeneralResponse(
          companies,
          constants.INFO_NO_COMPANY_FOUND,
          res
        );
      },
      error => {
        return responseUtils.returnGeneralError(error, res);
      }
    );
  }
}

module.exports = new CompanyController();
