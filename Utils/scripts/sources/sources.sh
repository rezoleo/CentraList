#!/bin/bash

########################################################################################################
# File      : ./scripts/sources/sources.sh                                                             #
# Author(s) : Zidmann (emmanuel.zidel@gmail.com)                                                       #
# Function  : Script to define the NodeJS directories                                                  #
# Version   : 1.1.0                                                                                    #
########################################################################################################


# Information about the different NodeJS server used for testing the different components
dir_tab=(
     "Application_CentraList/NodeJS/Application/centralist/"
     "Tool_Synchronizer/NodeJS/Tool/synchronizer/"
)

########################################################################################################
## Directory name of the applications
dir_application_path=(
     "Application_CentraList/NodeJS/Application/centralist/"
)

########################################################################################################
## Directory name of the tools
dir_tool_path=(
     "Tool_Synchronizer/NodeJS/Tool/synchronizer/"
)

########################################################################################################
## Path of the front pages which need to be compiled
dir_front_path=(
     "Application_CentraList/NodeJS/Application/centralist/front/"
)

########################################################################################################
## Project source directory paths
PROJECT_DIR="/opt/centralist"
DOC_DIR="$PROJECT_DIR/Documentation/"
DEV_DIR="$PROJECT_DIR/Development/"
INT_DIR="$PROJECT_DIR/Integration/"
TRC_DIR="$PROJECT_DIR/Trace/"

