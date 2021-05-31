#!/bin/bash

if [ ! "$1" ]; then
    printf "Usage: $ ./nb2md.sh <title>\n"
    exit 1
fi

# check that path and file exists
if [ ! -e "notebooks/$1/$1.ipynb" ]; then
    echo "Path notebooks/$1/$1.ipynb does not exist!"
    exit 1
fi

# compile notebook to markdown
python -m nbconvert "notebooks/$1/$1.ipynb" --to markdown
if [ $? != 0 ]; then
    echo "Exporting failed!"
    exit 1
fi

# copy files
rm -rf "img/$1_files"
cp "notebooks/$1/$1_data/*" "notebooks/$1/$1_files" 2>/dev/null
mv "notebooks/$1/$1_files" img/
if [ $? != 0 ]; then
    echo "Copying of dependent files failed!"
    exit 1
fi
mv "notebooks/$1/$1.md" _posts/
if [ $? != 0 ]; then
    echo "Copying of notebook failed!"
    exit 1
fi
# replace img directory
sed -ri "s/$1_data/$1_files/g" "_posts/$1.md"
sed -ri "s/[\"]$1_files/\"\/$1_files/g" "_posts/$1.md"
sed -ri "s/\($1_files/\(\/$1_files/g" "_posts/$1.md"
sed -ri "s/($1_files)/img\/\1/g" "_posts/$1.md"
# rename with date
printf -v date '%(%Y-%m-%d)T' -1
mv "_posts/$1.md" "_posts/$date-$1.md"
if [ $? != 0 ]; then
    echo "Renaming of notebook failed!"
    exit 1
fi