/* 
 * File 	: ./server/errors/referential.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the registered error of the NodeJS module for managing the application
 * Version  	: 1.0.0
 */


var findError = require('toolbox')('ERROR_REFERENTIAL');

var errors = [];
errors.push({status : 404, code : 'CENTRALIST.1.1.1',  message : "L'utilisateur n'existe pas",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.2.1.1',  message : "L'utilisateur est déjà inscrit à la liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.3.1.1',  message : "L'identifiant de l'objet recherché est inexistant",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.5.1.1',  message : "Vous devez être connecté pour effectuer cette action !",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.1.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.1.2',  message : "Vous n'avez pas accès à cette liste",		stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.2.1',  message : "L'identifiant de liste envoyé est incorrect",				stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.2.2',  message : "L'identifiant d'utilisateur envoyé est incorrect",			stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.2.3',  message : "L'utilisateur est déjà inscrit à la liste",				stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.2.4',  message : "Vous n'avez pas le droit d'inscrire un utilisateur à cette liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.2.5',  message : "Les données envoyées ne correspondent pas aux champs de la liste",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.2.6',  message : "Vous n'avez pas le droit d'inscrire un extérieur à cette liste",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.2.7',  message : "Les données envoyées ne correspondent pas aux champs de la liste",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.3.1',  message : "L'identifiant d'utilisateur envoyé est incorrect",	stack : null});
errors.push({status : 500, code : 'CENTRALIST.6.3.2',  message : "Le lien appartient à une liste qui n'existe plus",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.4.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.4.2',  message : "Vous n'avez pas accès à cette liste",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.4.3',  message : "L'identifiant de lien envoyé est incorrect",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.4.4',  message : "Ce lien n'appartient pas à cette liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.5.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.5.2',  message : "Les données envoyées ne correspondent pas aux champs de la liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.5.3',  message : "L'identifiant de lien envoyé est incorrect",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.5.4',  message : "Ce lien n'appartient pas à cette liste",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.5.5',  message : "Vous n'avez pas le droit de modifier ces données",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.5.6',  message : "Vous n'avez pas le droit de modifier ces données",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.6.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.6.6.2',  message : "L'identifiant de lien envoyé est incorrect",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.6.6.3',  message : "Ce lien n'appartient pas à cette liste",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.6.4',  message : "Vous n'avez pas le droit de modifier ces données",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.6.6.5',  message : "Vous n'avez pas le droit de modifier ces données",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.1.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 401, code : 'CENTRALIST.7.1.2',  message : "Vous n'avez pas le droit de voir cette liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.2.1',  message : "Les paramètres envoyés ne sont pas corrects",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.3.1',  message : "L'identifiant de liste envoyé est incorrect",			stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.3.2',  message : "Vous n'avez pas les droits pour modifier cette liste",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.4.1',  message : "L'identifiant de liste envoyé est incorrect",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.4.2',  message : "Vous n'avez pas le droit de supprimer cette liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.5.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.5.2',  message : "Vous ne pouvez pas exporter cette liste",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.6.1',  message : "L'identifiant de liste envoyé est incorrect.",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.7.6.2',  message : "Vous ne pouvez pas accéder à cette liste",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.8.1.1',  message : "La requête est incomplete",					stack : null});
errors.push({status : 400, code : 'CENTRALIST.8.1.2',  message : "Les identifiants sont incorrects",				stack : null});
errors.push({status : 400, code : 'CENTRALIST.8.1.3',  message : "Le login n'est pas présent dans la liste des utilisateurs",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.9.1.1',  message : "L'identifiant de liste envoyé est incorrect",	stack : null});
errors.push({status : 403, code : 'CENTRALIST.9.1.2',  message : "Vous n'avez pas accès à cette liste",		stack : null});
errors.push({status : 404, code : 'CENTRALIST.9.2.1',  message : "L'identifiant de liste envoyé est incorrect",		stack : null});
errors.push({status : 403, code : 'CENTRALIST.9.2.2',  message : "Vous ne pouvez pas changer la liste des modérateurs",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.9.2.3',  message : "Vous devez fournir une liste de modérateurs",		stack : null});
errors.push({status : 500, code : 'CENTRALIST.9.3.1',  message : "Le lien appartient à une liste qui n'existe plus",stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.1.1', message : "L'utilisateur n'existe pas",						stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.1.2', message : "Vous ne pouvez pas voir les requêtes émises par cet utilisateur",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.2.1', message : "La liste n'existe pas",						stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.2.2', message : "Vous ne pouvez pas voir les requêtes envoyées à cette liste",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.1', message : "La liste n'existe pas",							stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.2', message : "L'utilisateur n'existe pas",						stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.3', message : "Vous avez déjà envoyé une requête pour cette liste",			stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.4', message : "Les données envoyées ne sont pas correctes",				stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.5', message : "Vous ne pouvez pas envoyer une requête pour quelqu'un d'autre",		stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.3.6', message : "Vous ne pouvez pas envoyer de requête",					stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.4.1', message : "La liste n'existe pas",			stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.4.2', message : "Vous ne pouvez pas voir cette requête",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.4.3', message : "Cette requête n'existe pas",		stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.5.1', message : "La liste n'existe pas",				stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.5.2', message : "Les données envoyées ne sont pas correctes",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.5.3', message : "Vous ne pouvez pas modifier cette requête",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.5.4', message : "Cette requête n'existe pas",			stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.6.1', message : "La liste n'existe pas",					stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.6.2', message : "Vous ne pouvez pas rejeter cette requête",		stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.6.3', message : "Cette requête n'existe pas",				stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.7.1', message : "La liste n'existe pas",				stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.7.2', message : "Vous ne pouvez pas accepter cette requête",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.10.7.3', message : "Cette requête n'existe pas",			stack : null});
errors.push({status : 404, code : 'CENTRALIST.11.1.1', message : "L'utilisateur n'existe pas",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.11.2.1', message : "L'utilisateur n'existe pas",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.11.3.1', message : "Les paramètres envoyés ne sont pas complets",	stack : null});
errors.push({status : 400, code : 'CENTRALIST.11.3.2', message : "Erreur lors de la création du compte",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.11.3.3', message : "Le login choisi est déjà utilisé",		stack : null});
errors.push({status : 400, code : 'CENTRALIST.11.4.1', message : "Il n'y a aucun paramètre à changer",			stack : null});
errors.push({status : 404, code : 'CENTRALIST.11.4.2', message : "L'utilisateur n'existe pas",				stack : null});
errors.push({status : 403, code : 'CENTRALIST.11.4.3', message : "Vous n'avez pas le droit de modifier cet utilisateur",	stack : null});
errors.push({status : 404, code : 'CENTRALIST.11.5.1', message : "L'utilisateur n'existe pas",					stack : null});
errors.push({status : 403, code : 'CENTRALIST.11.5.2', message : "Vous n'avez pas le droit de modifier cet utilisateur",		stack : null});


module.exports = findError(errors);
