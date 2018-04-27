#!/bin/bash

########################################################################################################
# File      : ./scripts/prepare-mongo.sh                                                               #
# Author(s) : Zidmann (emmanuel.zidel@gmail.com)                                                       #
# Function  : Script to prepare data inside MongoDB databases                                          #
# Version   : 1.1.0                                                                                    #
########################################################################################################


# Root Id
ROOT_UID=0

#Check if user is not root
if [ $UID == $ROOT_UID ]; then
	echo -e "[-]Error : User must NOT be root to update information in MongoDB databases."
	exit 0
fi	

CURRENT_DIR=`pwd`
SCRIPTS_DIR=$(dirname "$0")"/prepare-mongo/"

cd $SCRIPTS_DIR;

# Scripts to update data in MongoDB databases
echo "-------------------------------"
mongo Application_CentraList app-centralist.js
echo "-------------------------------"

cd $CURRENT_DIR;
