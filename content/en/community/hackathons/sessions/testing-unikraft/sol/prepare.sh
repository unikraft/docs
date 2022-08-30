#!/bin/bash
LIB_DIR="libs"
LIBS=("lib-googletest" "lib-libcxx" "lib-libcxxabi" "lib-libunwind" "lib-compiler-rt" "lib-newlib")

if test ! -d unikraft; then
    git clone https://github.com/unikraft/unikraft
fi


cp "03-testing-vfscore/0003-Add-test-for-vfscore-lib.patch" ./unikraft/
cp "04-testing-nolibc/0004-Add-tests-for-nolibc-lib.patch" ./unikraft/
(cd unikraft && git apply 0003-Add-test-for-vfscore-lib.patch && git apply 0004-Add-tests-for-nolibc-lib.patch)

test -d unikraft/.git && rm -fr unikraft/.git

(cd unikraft && rm 0003-Add-test-for-vfscore-lib.patch && rm 0004-Add-tests-for-nolibc-lib.patch)

if test ! -d $LIB_DIR; then
       mkdir $LIB_DIR
fi

for AUX in "${LIBS[@]}"
do
	if test ! -d "$LIB_DIR/$AUX"; then
		git clone "https://github.com/unikraft/$AUX.git" "$LIB_DIR/$AUX"
	fi
	test -d "$LIB_DIR/$AUX/.git" && rm -fr "$LIB_DIR/$AUX/.git"
done
