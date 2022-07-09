#!/bin/bash
npm run build
aws s3 sync ./out s3://measures.apfel.io --exclude ".git/*" --exclude ".DS_Store" --exclude "pushNDeploy.sh" --delete --region us-east-1
