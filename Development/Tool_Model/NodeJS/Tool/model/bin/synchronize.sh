#!/bin/bash

############################################################################################################
# File      : ./bin/synchronize.sh                                                                         #
# Author(s) : Zidmann (emmanuel.zidel@gmail.com)                                                           #
# Function  : Script to start NodeJS server to synchronize datas from project Zer0 API  with CentraList DB #
# Version   : 1.0.0                                                                                        #
############################################################################################################


CURRENT_DIR=`pwd`
SCRIPT_DIR=`dirname "$0"`

cd $SCRIPT_DIR/../
nodejs ./server/index.js 1>>./log/console.log 2>>./log/console.err

cd $CURRENT_DIR

