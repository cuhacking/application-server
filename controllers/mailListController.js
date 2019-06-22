const COLLECTION_NAME = 'mailing_list';

const Database  = require('../model/database');
const MailListController = module.exports;

MailListController.get = function(req, res){
    
    let limit = req.query.limit || 0; // If the limit query is set, use that, otherwise use 0
    Database.getAll(COLLECTION_NAME, limit).then(function(databaseResult){
        let data = {
            operation: 'get',
            status: 'success',
            items: databaseResult.length,
            data: databaseResult
        };
    
        res.status(200).send(data);
    });

}

MailListController.getByEmail = function(req, res){
    
    let email = req.email;
    Database.get(COLLECTION_NAME, email).then(function(databaseResult){
        if(databaseResult){
            res.status(200).send({
                email: email,
                operation: 'get',
                status: 'success',
                data: databaseResult
            });
        } else {
            res.status(404).send({
                email: email,
                operation: 'get',
                status: 'failed',
                message: 'Email not found'
            });
        }
    });

}

MailListController.add = function(req, res){

    let email = req.body.email;

    if(validateEmail(email)){
        let data = {
            email: email
        }

        Database.add(COLLECTION_NAME, 'email', data).then(function(ref){
            if(ref){
                res.status(201).send({
                    email: email,
                    operation: 'add',
                    status: 'success',
                    message: 'Email successfully added to mailing list'
                });
            } else {
                res.status(500).send({
                    email: email,
                    operation: 'add',
                    status: 'failed',
                    message: 'Add to mailing list failed on database'
                });
            }
        });
    } else {
        res.status(400).send({
            email: email,
            operation: 'add',
            status: 'failed',
            message: 'Invalid email provided'
        });
    }
}


MailListController.delete = function(req, res){

    let email = req.email;
    let doc = Database.get(COLLECTION_NAME, email);

    if(!doc){
        res.status(404).send({
            email: email,
            operation: 'delete',
            status: 'failed',
            message: 'Email not found'
        });
    } else {
        Database.remove(COLLECTION_NAME, email).then(function(){
            res.status(204).send({
                email: email,
                operation: 'delete',
                status: 'success',
                message: 'Email successfully deleted' 
            });
        });
    }

}


/**
 * Checks if an email is valid
 * 
 * @param {string}  email - the email to check
 * 
 * @return {boolean}      - a boolean indicating whether the email is valid        
 */
function validateEmail(email){
    // Extremely rudimentary validation for now
    return email.includes("@") && email.includes(".");
}
