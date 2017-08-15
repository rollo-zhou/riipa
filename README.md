# [generator-gulp-app ](https://github.com/keith3/generator-gulp-app)

> [Yeoman](http://yeoman.io) generator

This is a yeoman webapp generator with [gulpjs](http://gulpjs.com) && livereload.

Scaffolds out a complete project directory structure for you:

    .
    ├── app
    │   ├── index.html
    │   └── css
    │   │   ├── less/
    │   │   └── style.css
    │   └── js
    │   │   └── coffee
    │   └── images/
    │       └── gulplogo.png
    ├── node_modules/
    ├── bower.json
    ├── package.json
    └── README.md


## Getting Started

```bash
$ npm install -g yo

$ npm install -g generator-gulp-app
```
initiate the generator:

```bash
$ yo gulp-app
```

Start a local server to enable livereload:

```bash
$ gulp
```

## License

MIT


console.log(JSON.stringify({"my_phone":"aaa_aa" ,"city_name":"aaa_aa"}).replace(/([a-z]+)(_)([a-z])([^"]+)(?=":)/g,function(s1,s2,s3,s4,s5){return s2+s4.toUpperCase()+s5}))
console.log(JSON.stringify({"myPhone":"aaaAaa" ,"cityName":"aaaAaa"}).replace(/([a-z]+)([A-Z])([^"]+)+(?=":)/g,function(s1,s2,s3,s4){return s2+"_"+s3.toLowerCase()+s4}))
