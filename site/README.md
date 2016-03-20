#The Buzzwordizer site
##Requirements
* nodejs, graphicsmagick, imagemagick (for image resizing)

##Build the site (assets and everything else)
`npm install`
Either
`./node_modules/gulp/bin/gulp.js`
or
`npm install -g gulp && gulp`

To do minifcation, run `gulp --production`

The site root should be generated at `public/`.
