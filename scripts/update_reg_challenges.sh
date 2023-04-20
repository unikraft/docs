#!/bin/bash

pushd "content/en/community/hackathons/sessions/registration-challenges/work/" > /dev/null || exit 1

zip -r "../../../../../../../static/assets/files/hackathon-registration.zip" "."

popd > /dev/null || exit 1
