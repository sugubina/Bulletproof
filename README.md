# SASSERPLATE


## main.scss

* variables - colors, fonts (with imports), sizes
* helpers - additional classes
* typography - default fonts, margins and colors
* forms - forms
* layouts - page layouts, main sections
* components - elements inside main sections
* vendor - css for vendor libraries
* media-queries 
* print


We can add additional files like:
* buttons - buttons
* tables - tables
* alerts - alerts
* popups - popups


## Requirements
1. node & npm
2. **gulp** node package installed globally:
`npm install -g gulp`

## Installation

```shell
cd package_directory
npm install
```

## Grunt Tasks

### Default Task 

This task is used for development. 
What it does?
1. Compiles src/sass files into CSS (out/css).
2. Copies src/js files into JS (out/js).
3. LiveReload + BrowserSync
4. Create .zip packages for camino

```shell
gulp
```

#### Options

##### Port

Type: `Integer`  
Default: `4500`

The port on which the webserver will respond. The task will fail if the specified port is already in use. You can use the special values `0` or `'?'` to use a system-assigned port.

```shell
grunt --port 8011
```

### Compile Task

This task will compile SASS (src/sass) files into CSS files (out/css) and add prefixes.

```shell
gulp sass
```

### Crate Packages Task

This task will prepare .zip file ready for camino

```shell
gulp dist_lp
gulp dist_thx
```
