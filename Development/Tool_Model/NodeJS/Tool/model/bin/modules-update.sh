#!/bin/bash

########################################################################################################
# File      : ./bin/modules-update.sh                                                                  #
# Author(s) : Zidmann (emmanuel.zidel@gmail.com)                                                       #
# Function  : Script to install or update all the NodeJS modules for this tool                         #
# Version   : 1.0.0                                                                                    #
########################################################################################################


CURRENT_DIR=`pwd`
SCRIPT_DIR=`dirname "$0"`

cd $SCRIPT_DIR/../
npm install
npm update
cd $CURRENT_DIR

