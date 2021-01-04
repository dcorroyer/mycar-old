# Maintain Your Car - MYCar

An application of a course about Symfony 5 w/ API-Platform and React.
It was a personal project used to present a technical project in team at school examen. I was working on this project with:

    @tiagfernandes
    @thibaut-comte

## Configuration of webpack for linux or windows

Make sure you have run this command before configuration:

    symfony server:start

This command was important to create symfony certs, now you can run:

    symfony server:start --no-tls

## Package.json

Now you have to make modification in your **package.json** to enable symfony certs in your project running on linux or windows with local API:

### For linux development with lamp:

    "dev-server": "encore dev-server --https --pfx=$HOME/.symfony/certs/default.p12 --port 8080",

### For windows development with xampp:

    "dev-server": "encore dev-server --https --pfx=%UserProfile%\\.symfony\\certs\\default.p12 --port 8080",

Now you can run:

    npm install
    npm run build
    npm run dev-server
