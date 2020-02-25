# How-To-Upload-Project-on-heroku


Create the project
1 . Create a new project, for example a simple express-server. You have to have a package.json and all your dependencies must be added to this package.json. Make sure of this otherwise the app will crash.

2 . Heroku will look for a startup-script, this is by default npm start so make sure you have that in your package.json (assuming your script is called app.js):

 "scripts": {
    "start" : "node app.js"
 }
3 . You also have to make changes to the port, you can't hardcode a dev-port. But you can reference herokus port without knowing it by a special variabel. So add the following to your code:

const port = process.env.PORT || 4000;
When you upload to Heroku it will use the environment-port but when you are developing it will use the port 4000. Then reference this port in your app:

app.listen(port);
4 . Then create a remote heroku project, kinda like creating a git repository on GitHub. This will create a project on Heroku with a random name. If you want to name your app you have to supply your own name like heroku create project-name. The command below will just create a random name:

heroku create
5 . Push your app to Heroku like pushing to GitHub expect for origin you have heroku (you will see a wall of code).

git push heroku master
6 . Visit your newly create app by opening it via heroku:

heroku open
If you are getting errors you can view the error logs by running this command:

heroku logs --tail
