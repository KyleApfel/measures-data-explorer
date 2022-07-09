#!/bin/bash
aws s3 sync ./out s3://measures.apfel.io --exclude ".git/*" --exclude ".DS_Store" --exclude "pushNDeploy.sh" --delete --profile personal --region us-west-2
