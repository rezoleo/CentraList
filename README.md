# Project CentraList

The project CentraList, based of Project Zer0, consists in creating a tool to generate lists of students of l'Ecole Centrale de Lille.

## References

The project is a fork of CentraleIA, a project developed by Hugo Lehmann and Nathan Gaberel.

The initial project implements an MVC pattern : the source of the controllers, the models and the web pages were kept but the server management was replaced by the libraries developed in Project Zer0.

Some scripts of Projet Zer0 to manage NodeJS server, installation, front pages compilation were copied and pasted in the CentraList project.
The version 1.1.0 of Project Zero was used here.

## Components

The project uses a NodeJS server which interacts with the service Authentification to use the common password of the RezoLution applications and also the service Card by HTTP request.

A script is also used to interact with the service People to copy student information in the CentraList database.

The services Authentification, Card and People are requested through the service Provider since this information are only read.

The Module_ProjectZer0 package is used to manage the HTTP NodeJS server like with Project Zer0 servers.

## Contributors

* [Emmanuel ZIDEL-CAUFFET](mailto:emmanuel.zidel@gmail.com) :bow:
* [Hugo LEHMANN](mailto:shogi31@gmail.com) :bow:
