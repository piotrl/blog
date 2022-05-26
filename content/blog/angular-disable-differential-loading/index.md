---
title: 'Angular - disable differential loading'
author: [Piotr Lewandowski]
tags: ['angular', 'build', 'performance']
cover: './cover.png'
date: '2020-04-14'
description: 'We have seen various benchmarks and charts on conferences. What is the real impact on our application?'
---

What is differential loading?

In short:
* Mechanism to build two bundles: ES5 for older browser and ES2015+ for modern 
* Introduced in Angular 8.2
* Improved in Angular 10 to reuse parts of the compilation targets

How differential loading knows we need to build bundle twice?

It takes information from your `.browserlistrc` about browsers you want to support.  
  * Your `.browserlistrc`, defining which browsers you want to support 
  * Current `caniuse` library data

From those two, it does check `es6-module` feature, which is supported by:
  * Edge 16+
  * Firefox 60+
  * Chrome 61+

* For most of the companies, we can safely remove support for IE11.
* Edge Legacy is quickly being migrated to Edge Chromium
