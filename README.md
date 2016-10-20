# Buzzwordizer - DEPRECATED

This was a fun, goofy project, but I'm deprecating it. I will leave all the code here for anybody who wants to continue to play with it or take this idea further.

## Site
Buzzwordizer site built using [Hugo](https://gohugo.io/). Build by running ```hugo --source buzzwordizer-hugo-theme/```.

## API
API requires nodejs


```
npm install
nodejs ./api.js
```

### Usage
``` curl -X POST localhost:8080 -d'{"INPUT": "i am a software engineer working on server side applications"}' -H 'Content-Type: application/json' ```
