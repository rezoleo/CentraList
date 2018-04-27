#!/bin/bash

########################################################################################################
# File      : ./scripts/install-modules.sh                                                             #
# Author(s) : Zidmann (emmanuel.zidel@gmail.com)                                                       #
# Function  : Script to install the different dependancies in node_modules/ and bower_components/      #
#             directories                                                                              #
# Version   : 1.1.0                                                                                    #
########################################################################################################


# Root Id
ROOT_UID=0

#Check if user is not root
if [ $UID == $ROOT_UID ]; then
	echo -e "[-]Error : User must NOT be root to install nodejs and bower modules."
	exit 0
fi

SCRIPT_DIR=$(dirname "$0")
source $SCRIPT_DIR"/sources/sources.sh"
CURRENT_DIR=`pwd`

echo "-------------------------------"
for i in ${!dir_tab[@]};
do
	cd $DEV_DIR
	cd ${dir_tab[i]};
	echo "Installation in the directory ${dir_tab[i]}"
	npm i
	echo "-------------------------------"
	cd $CURRENT_DIR
done

for k in ${!dir_front_path[@]};
do
	cd $DEV_DIR
	cd ${dir_front_path[k]};
	echo "Installation in the directory ${dir_front_path[k]}"
	npm i
	bower i
	echo "-------------------------------"
	cd $CURRENT_DIR
done

