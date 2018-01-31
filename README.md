# ID TECH TLV
Solution to managing ID TECH TLVs

## Requirements
- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## To set up project
```bash
brew install yarn --without-node  #installs yarn without node, remove flags if you don't have node
npm install                       #installs all packages specified in package.json
```

## To Start Server
```bash
yarn
yarn migrate
yarn start
```

## Environment Variables that needs to be set
### Using Google login
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
### Using Outlook login
- OUTLOOK_CLIENT_ID
- OUTLOOK_CLIENT_SECRET
### Set session key when using production build
- SESSION_SECRET
### Optional
- GOOGLE_ANALYTICS_ID
