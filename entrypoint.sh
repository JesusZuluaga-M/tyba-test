#!/bin/sh

npx typeorm migration:run -d src/data-source.ts

node dist/main