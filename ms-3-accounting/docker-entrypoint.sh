#!/bin/sh

shouldRunSeed=${MS_CFG_SHOULD_RUN_SEED}
runSeed=true

yarn db:migrate

if [[ "$runSeed" == "$shouldRunSeed" ]]
then
  yarn db:seed
fi

yarn dev