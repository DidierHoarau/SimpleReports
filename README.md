# SimpleReports

This is a simple PHP reporting tool for MySQL databases.

# Installation

## Requirement

To build and run this project, you will need the following:
- Docker
- Docker Compose
- NodeJS
- PHP Composer

## Procedure

```
git clone https://github.com/DidierHoarau/simple-reports
cd simple-reports
npm run packaging:prepare
npm run packaging:image-build
npm run packaging:service-run
```

# Configuration
- Database:
 - Edit the file `src/api/config/config.php`
 - Edit the file `docker-packaging-config/docker-compose.yml`
- Docker Container: edit the file `docker-packaging-config/docker-compose.yml`
