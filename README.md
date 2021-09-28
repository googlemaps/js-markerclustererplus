# Google Maps JavaScript MarkerClustererPlus

[![npm](https://img.shields.io/npm/v/@googlemaps/markerclustererplus)](https://www.npmjs.com/package/@googlemaps/markerclustererplus)
![Build](https://github.com/googlemaps/js-markerclustererplus/workflows/Build/badge.svg)
![Release](https://github.com/googlemaps/js-markerclustererplus/workflows/Release/badge.svg)
[![codecov](https://codecov.io/gh/googlemaps/js-markerclustererplus/branch/main/graph/badge.svg)](https://codecov.io/gh/googlemaps/js-markerclustererplus)
![GitHub contributors](https://img.shields.io/github/contributors/googlemaps/js-markerclustererplus?color=green)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![](https://github.com/jpoehnelt/in-solidarity-bot/raw/main/static//badge-flat.png)](https://github.com/apps/in-solidarity)

## Description

The library creates and manages per-zoom-level clusters for large amounts of markers.

> **Note**: This library has been refactored into [@googlemaps/markerclusterer](https://www.npmjs.com/package/@googlemaps/markerclusterer), check out the new and improved version!

> **Note**: This library is the same as the existing library `@google/markerclustererplus`, but renamed and in its own repository.

## Install

Available via npm as the package [@googlemaps/markerclustererplus](https://www.npmjs.com/package/@googlemaps/markerclustererplus).

`npm i @googlemaps/markerclustererplus`

or

`yarn add @googlemaps/markerclustererplus`

Alternativly you may add the umd package directly to the html document using the unpkg link.

`<script src="https://unpkg.com/@googlemaps/markerclustererplus/dist/index.min.js"></script>`

When adding via unpkg, the loader can be accessed at `MarkerClusterer`.

A version can be specified by using `https://unpkg.com/@googlemaps/markerclustererplus@VERSION/dist/...`.

#### TypeScript

This library uses the official TypeScript typings for Google Maps Platform, [@types/google.maps](https://www.npmjs.com/package/@types/google.maps).

`npm i -D @types/google.maps`

It may also require the [skipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck) TypeScript compiler option.


## Documentation

The reference documentation can be found at this [link](https://googlemaps.github.io/js-markerclustererplus/index.html).


## Example


```js
import MarkerClusterer from '@googlemaps/markerclustererplus';

const markerCluster = new MarkerClusterer(map, markers);
```

View the package in action:

* [Simple Example](https://googlemaps.github.io/js-markerclustererplus/examples/simple_example.html)
* [Advanced Example](https://googlemaps.github.io/js-markerclustererplus/examples/advanced_example.html)
* [Events Example](https://googlemaps.github.io/js-markerclustererplus/examples/events_example.html)
* [Speed Test Example](https://googlemaps.github.io/js-markerclustererplus/examples/speed_test_example.html)
