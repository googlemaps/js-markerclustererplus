var MarkerClusterer = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;
	var objectPropertyIsEnumerable = {
	  f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};
	var objectGetOwnPropertyDescriptor = {
	  f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var objectDefineProperty = {
	  f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	  (module.exports = function (key, value) {
	    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.6.5',
	    mode:  'global',
	    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(String).split('String');
	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;

	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }

	    if (O === global_1) {
	      if (simple) O[key] = value;else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }

	    if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	  });
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
	  f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;
	var objectGetOwnPropertySymbols = {
	  f: f$4
	};

	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var $indexOf = arrayIncludes.indexOf;
	var nativeIndexOf = [].indexOf;
	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', {
	  ACCESSORS: true,
	  1: 0
	}); // `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof

	_export({
	  target: 'Array',
	  proto: true,
	  forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH
	}, {
	  indexOf: function indexOf(searchElement
	  /* , fromIndex = 0 */
	  ) {
	    return NEGATIVE_ZERO // convert -0 to +0
	    ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-isarray

	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('slice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var SPECIES$1 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max; // `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
	}, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

	    var Constructor, result, n;

	    if (isArray(O)) {
	      Constructor = O.constructor; // cross-realm fallback

	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$1];
	        if (Constructor === null) Constructor = undefined;
	      }

	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }

	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));

	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);

	    result.length = n;
	    return result;
	  }
	});

	// https://tc39.github.io/ecma262/#sec-toobject

	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var SPECIES$2 = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES$2];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('splice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};
	test[TO_STRING_TAG] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag'); // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring


	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring

	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, {
	    unsafe: true
	  });
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING];
	var NOT_GENERIC = fails(function () {
	  return nativeToString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	}); // FF44- RegExp#toString has a wrong name

	var INCORRECT_NAME = nativeToString.name != TO_STRING; // `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, {
	    unsafe: true
	  });
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	var nativeJoin = [].join;
	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$1 = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join

	_export({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD$1
	}, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	var createMethod$1 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }

	      index += i;

	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }

	    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }

	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$1(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$1(true)
	};

	var $reduce = arrayReduce.left;
	var STRICT_METHOD$2 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('reduce', {
	  1: 0
	}); // `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !STRICT_METHOD$2 || !USES_TO_LENGTH$3
	}, {
	  reduce: function reduce(callbackfn
	  /* , initialValue */
	  ) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-object.keys

	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var FAILS_ON_PRIMITIVES = fails(function () {
	  objectKeys(1);
	}); // `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys

	_export({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// so we use an intermediate function.


	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});
	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});
	var regexpStickyHelpers = {
	  UNSUPPORTED_Y: UNSUPPORTED_Y,
	  BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');

	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== regexpExec
	}, {
	  exec: regexpExec
	});

	var SPECIES$3 = wellKnownSymbol('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	}); // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

	var REPLACE_KEEPS_$0 = function () {
	  return 'a'.replace(/./, '$0') === '$0';
	}();

	var REPLACE = wellKnownSymbol('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper


	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$3] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];
	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return regexMethod.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return regexMethod.call(string, this);
	    });
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex

	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// https://tc39.github.io/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // @@replace logic


	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [// `String.prototype.replace` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	  function (regexp, replaceValue) {
	    if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
	      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	      if (res.done) return res.value;
	    }

	    var rx = anObject(regexp);
	    var S = String(this);
	    var functionalReplace = typeof replaceValue === 'function';
	    if (!functionalReplace) replaceValue = String(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regexpExecAbstract(rx, S);
	      if (result === null) break;
	      results.push(result);
	      if (!global) break;
	      var matchStr = String(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = String(result[0]);
	      var position = max$3(min$3(toInteger(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = [matched].concat(captures, position, S);
	        if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	        var replacement = String(replaceValue.apply(undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + S.slice(nextSourcePosition);
	  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }

	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;

	      switch (ch.charAt(0)) {
	        case '$':
	          return '$';

	        case '&':
	          return matched;

	        case '`':
	          return str.slice(0, position);

	        case "'":
	          return str.slice(tailPos);

	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;

	        default:
	          // \d\d?
	          var n = +ch;
	          if (n === 0) return match;

	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }

	          capture = captures[n - 1];
	      }

	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var SPECIES$4 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var arrayPush = [].push;
	var min$4 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	  return !RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output.length > lim ? output.slice(0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = min$4(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	}, !SUPPORTS_Y);

	/**
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Extends an object's prototype by another's.
	 *
	 * @param type1 The Type to be extended.
	 * @param type2 The Type to extend with.
	 * @ignore
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function extend(type1, type2) {
	  // eslint-disable-next-line prefer-const
	  for (var property in type2.prototype) {
	    type1.prototype[property] = type2.prototype[property];
	  }
	}
	/**
	 * @ignore
	 */


	var OverlayViewSafe =
	/** @class */
	function () {
	  function OverlayViewSafe() {
	    // MarkerClusterer implements google.maps.OverlayView interface. We use the
	    // extend function to extend MarkerClusterer with google.maps.OverlayView
	    // because it might not always be available when the code is defined so we
	    // look for it at the last possible moment. If it doesn't exist now then
	    // there is no point going ahead :)
	    extend(OverlayViewSafe, google.maps.OverlayView);
	  }

	  return OverlayViewSafe;
	}();

	/**
	 *
	 * @hidden
	 */

	function toCssText(styles) {
	  return Object.keys(styles).reduce(function (acc, key) {
	    if (styles[key]) {
	      acc.push(key + ":" + styles[key]);
	    }

	    return acc;
	  }, []).join(";");
	}
	/**
	 *
	 * @hidden
	 */


	function coercePixels(pixels) {
	  return pixels ? pixels + "px" : undefined;
	}
	/**
	 * A cluster icon.
	 */


	var ClusterIcon =
	/** @class */
	function (_super) {
	  __extends(ClusterIcon, _super);
	  /**
	   * @param cluster_ The cluster with which the icon is to be associated.
	   * @param styles_ An array of {@link ClusterIconStyle} defining the cluster icons
	   *  to use for various cluster sizes.
	   */


	  function ClusterIcon(cluster_, styles_) {
	    var _this = _super.call(this) || this;

	    _this.cluster_ = cluster_;
	    _this.styles_ = styles_;
	    _this.center_ = null;
	    _this.div_ = null;
	    _this.sums_ = null;
	    _this.visible_ = false;
	    _this.style = null;

	    _this.setMap(cluster_.getMap()); // Note: this causes onAdd to be called


	    return _this;
	  }
	  /**
	   * Adds the icon to the DOM.
	   */


	  ClusterIcon.prototype.onAdd = function () {
	    var _this = this;

	    var cMouseDownInCluster;
	    var cDraggingMapByCluster;
	    var mc = this.cluster_.getMarkerClusterer();

	    var _a = google.maps.version.split("."),
	        major = _a[0],
	        minor = _a[1];

	    var gmVersion = parseInt(major, 10) * 100 + parseInt(minor, 10);
	    this.div_ = document.createElement("div");

	    if (this.visible_) {
	      this.show();
	    }

	    this.getPanes().overlayMouseTarget.appendChild(this.div_); // Fix for Issue 157

	    this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function () {
	      cDraggingMapByCluster = cMouseDownInCluster;
	    });
	    google.maps.event.addDomListener(this.div_, "mousedown", function () {
	      cMouseDownInCluster = true;
	      cDraggingMapByCluster = false;
	    }); // March 1, 2018: Fix for this 3.32 exp bug, https://issuetracker.google.com/issues/73571522
	    // But it doesn't work with earlier releases so do a version check.

	    if (gmVersion >= 332) {
	      // Ugly version-dependent code
	      google.maps.event.addDomListener(this.div_, "touchstart", function (e) {
	        e.stopPropagation();
	      });
	    }

	    google.maps.event.addDomListener(this.div_, "click", function (e) {
	      cMouseDownInCluster = false;

	      if (!cDraggingMapByCluster) {
	        /**
	         * This event is fired when a cluster marker is clicked.
	         * @name MarkerClusterer#click
	         * @param {Cluster} c The cluster that was clicked.
	         * @event
	         */
	        google.maps.event.trigger(mc, "click", _this.cluster_);
	        google.maps.event.trigger(mc, "clusterclick", _this.cluster_); // deprecated name
	        // The default click handler follows. Disable it by setting
	        // the zoomOnClick property to false.

	        if (mc.getZoomOnClick()) {
	          // Zoom into the cluster.
	          var mz_1 = mc.getMaxZoom();

	          var theBounds_1 = _this.cluster_.getBounds();

	          mc.getMap().fitBounds(theBounds_1); // There is a fix for Issue 170 here:

	          setTimeout(function () {
	            mc.getMap().fitBounds(theBounds_1); // Don't zoom beyond the max zoom level

	            if (mz_1 !== null && mc.getMap().getZoom() > mz_1) {
	              mc.getMap().setZoom(mz_1 + 1);
	            }
	          }, 100);
	        } // Prevent event propagation to the map:


	        e.cancelBubble = true;

	        if (e.stopPropagation) {
	          e.stopPropagation();
	        }
	      }
	    });
	    google.maps.event.addDomListener(this.div_, "mouseover", function () {
	      /**
	       * This event is fired when the mouse moves over a cluster marker.
	       * @name MarkerClusterer#mouseover
	       * @param {Cluster} c The cluster that the mouse moved over.
	       * @event
	       */
	      google.maps.event.trigger(mc, "mouseover", _this.cluster_);
	    });
	    google.maps.event.addDomListener(this.div_, "mouseout", function () {
	      /**
	       * This event is fired when the mouse moves out of a cluster marker.
	       * @name MarkerClusterer#mouseout
	       * @param {Cluster} c The cluster that the mouse moved out of.
	       * @event
	       */
	      google.maps.event.trigger(mc, "mouseout", _this.cluster_);
	    });
	  };
	  /**
	   * Removes the icon from the DOM.
	   */


	  ClusterIcon.prototype.onRemove = function () {
	    if (this.div_ && this.div_.parentNode) {
	      this.hide();
	      google.maps.event.removeListener(this.boundsChangedListener_);
	      google.maps.event.clearInstanceListeners(this.div_);
	      this.div_.parentNode.removeChild(this.div_);
	      this.div_ = null;
	    }
	  };
	  /**
	   * Draws the icon.
	   */


	  ClusterIcon.prototype.draw = function () {
	    if (this.visible_) {
	      var pos = this.getPosFromLatLng_(this.center_);
	      this.div_.style.top = pos.y + "px";
	      this.div_.style.left = pos.x + "px";
	    }
	  };
	  /**
	   * Hides the icon.
	   */


	  ClusterIcon.prototype.hide = function () {
	    if (this.div_) {
	      this.div_.style.display = "none";
	    }

	    this.visible_ = false;
	  };
	  /**
	   * Positions and shows the icon.
	   */


	  ClusterIcon.prototype.show = function () {
	    if (this.div_) {
	      this.div_.className = this.className_;
	      this.div_.style.cssText = this.createCss_(this.getPosFromLatLng_(this.center_));
	      this.div_.innerHTML = (this.style.url ? this.getImageElementHtml() : "") + this.getLabelDivHtml();

	      if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
	        this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
	      } else {
	        this.div_.title = this.sums_.title;
	      }

	      this.div_.style.display = "";
	    }

	    this.visible_ = true;
	  };

	  ClusterIcon.prototype.getLabelDivHtml = function () {
	    var mc = this.cluster_.getMarkerClusterer();
	    var ariaLabel = mc.ariaLabelFn(this.sums_.text);
	    var divStyle = {
	      position: "absolute",
	      top: coercePixels(this.anchorText_[0]),
	      left: coercePixels(this.anchorText_[1]),
	      color: this.style.textColor,
	      "font-size": coercePixels(this.style.textSize),
	      "font-family": this.style.fontFamily,
	      "font-weight": this.style.fontWeight,
	      "font-style": this.style.fontStyle,
	      "text-decoration": this.style.textDecoration,
	      "text-align": "center",
	      width: coercePixels(this.style.width),
	      "line-height": coercePixels(this.style.textLineHeight)
	    };
	    return "\n<div aria-label=\"" + ariaLabel + "\" style=\"" + toCssText(divStyle) + "\" tabindex=\"0\">\n  <span aria-hidden=\"true\">" + this.sums_.text + "</span>\n</div>\n";
	  };

	  ClusterIcon.prototype.getImageElementHtml = function () {
	    // NOTE: values must be specified in px units
	    var bp = (this.style.backgroundPosition || "0 0").split(" ");
	    var spriteH = parseInt(bp[0].replace(/^\s+|\s+$/g, ""), 10);
	    var spriteV = parseInt(bp[1].replace(/^\s+|\s+$/g, ""), 10);
	    var dimensions = {};

	    if (this.cluster_.getMarkerClusterer().getEnableRetinaIcons()) {
	      dimensions = {
	        width: coercePixels(this.style.width),
	        height: coercePixels(this.style.height)
	      };
	    } else {
	      var _a = [-1 * spriteV, -1 * spriteH + this.style.width, -1 * spriteV + this.style.height, -1 * spriteH],
	          Y1 = _a[0],
	          X1 = _a[1],
	          Y2 = _a[2],
	          X2 = _a[3];
	      dimensions = {
	        clip: "rect(" + Y1 + "px, " + X1 + "px, " + Y2 + "px, " + X2 + "px)"
	      };
	    }

	    var cssText = toCssText(__assign({
	      position: "absolute",
	      top: coercePixels(spriteV),
	      left: coercePixels(spriteH)
	    }, dimensions));
	    return "<img alt=\"" + this.sums_.text + "\" aria-hidden=\"true\" src=\"" + this.style.url + "\" style=\"" + cssText + "\"/>";
	  };
	  /**
	   * Sets the icon styles to the appropriate element in the styles array.
	   *
	   * @ignore
	   * @param sums The icon label text and styles index.
	   */


	  ClusterIcon.prototype.useStyle = function (sums) {
	    this.sums_ = sums;
	    var index = Math.max(0, sums.index - 1);
	    index = Math.min(this.styles_.length - 1, index);
	    this.style = this.styles_[index];
	    this.anchorText_ = this.style.anchorText || [0, 0];
	    this.anchorIcon_ = this.style.anchorIcon || [Math.floor(this.style.height / 2), Math.floor(this.style.width / 2)];
	    this.className_ = this.cluster_.getMarkerClusterer().getClusterClass() + " " + (this.style.className || "cluster-" + index);
	  };
	  /**
	   * Sets the position at which to center the icon.
	   *
	   * @param center The latlng to set as the center.
	   */


	  ClusterIcon.prototype.setCenter = function (center) {
	    this.center_ = center;
	  };
	  /**
	   * Creates the `cssText` style parameter based on the position of the icon.
	   *
	   * @param pos The position of the icon.
	   * @return The CSS style text.
	   */


	  ClusterIcon.prototype.createCss_ = function (pos) {
	    return toCssText({
	      "z-index": "" + this.cluster_.getMarkerClusterer().getZIndex(),
	      top: coercePixels(pos.y),
	      left: coercePixels(pos.x),
	      width: coercePixels(this.style.width),
	      height: coercePixels(this.style.height),
	      cursor: "pointer",
	      position: "absolute",
	      "-webkit-user-select": "none",
	      "-khtml-user-select": "none",
	      "-moz-user-select": "none",
	      "-o-user-select": "none",
	      "user-select": "none"
	    });
	  };
	  /**
	   * Returns the position at which to place the DIV depending on the latlng.
	   *
	   * @param latlng The position in latlng.
	   * @return The position in pixels.
	   */


	  ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
	    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
	    pos.x = Math.floor(pos.x - this.anchorIcon_[1]);
	    pos.y = Math.floor(pos.y - this.anchorIcon_[0]);
	    return pos;
	  };

	  return ClusterIcon;
	}(OverlayViewSafe);

	/**
	 * Creates a single cluster that manages a group of proximate markers.
	 *  Used internally, do not call this constructor directly.
	 */

	var Cluster =
	/** @class */
	function () {
	  /**
	   *
	   * @param markerClusterer_ The `MarkerClusterer` object with which this
	   *  cluster is associated.
	   */
	  function Cluster(markerClusterer_) {
	    this.markerClusterer_ = markerClusterer_;
	    this.map_ = this.markerClusterer_.getMap();
	    this.minClusterSize_ = this.markerClusterer_.getMinimumClusterSize();
	    this.averageCenter_ = this.markerClusterer_.getAverageCenter();
	    this.markers_ = []; // TODO: type;

	    this.center_ = null;
	    this.bounds_ = null;
	    this.clusterIcon_ = new ClusterIcon(this, this.markerClusterer_.getStyles());
	  }
	  /**
	   * Returns the number of markers managed by the cluster. You can call this from
	   * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
	   *
	   * @return The number of markers in the cluster.
	   */


	  Cluster.prototype.getSize = function () {
	    return this.markers_.length;
	  };
	  /**
	   * Returns the array of markers managed by the cluster. You can call this from
	   * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
	   *
	   * @return The array of markers in the cluster.
	   */


	  Cluster.prototype.getMarkers = function () {
	    return this.markers_;
	  };
	  /**
	   * Returns the center of the cluster. You can call this from
	   * a `click`, `mouseover`, or `mouseout` event handler
	   * for the `MarkerClusterer` object.
	   *
	   * @return The center of the cluster.
	   */


	  Cluster.prototype.getCenter = function () {
	    return this.center_;
	  };
	  /**
	   * Returns the map with which the cluster is associated.
	   *
	   * @return The map.
	   * @ignore
	   */


	  Cluster.prototype.getMap = function () {
	    return this.map_;
	  };
	  /**
	   * Returns the `MarkerClusterer` object with which the cluster is associated.
	   *
	   * @return The associated marker clusterer.
	   * @ignore
	   */


	  Cluster.prototype.getMarkerClusterer = function () {
	    return this.markerClusterer_;
	  };
	  /**
	   * Returns the bounds of the cluster.
	   *
	   * @return the cluster bounds.
	   * @ignore
	   */


	  Cluster.prototype.getBounds = function () {
	    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
	    var markers = this.getMarkers();

	    for (var i = 0; i < markers.length; i++) {
	      bounds.extend(markers[i].getPosition());
	    }

	    return bounds;
	  };
	  /**
	   * Removes the cluster from the map.
	   *
	   * @ignore
	   */


	  Cluster.prototype.remove = function () {
	    this.clusterIcon_.setMap(null);
	    this.markers_ = [];
	    delete this.markers_;
	  };
	  /**
	   * Adds a marker to the cluster.
	   *
	   * @param marker The marker to be added.
	   * @return True if the marker was added.
	   * @ignore
	   */


	  Cluster.prototype.addMarker = function (marker) {
	    if (this.isMarkerAlreadyAdded_(marker)) {
	      return false;
	    }

	    if (!this.center_) {
	      this.center_ = marker.getPosition();
	      this.calculateBounds_();
	    } else {
	      if (this.averageCenter_) {
	        var l = this.markers_.length + 1;
	        var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
	        var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
	        this.center_ = new google.maps.LatLng(lat, lng);
	        this.calculateBounds_();
	      }
	    }

	    marker.isAdded = true;
	    this.markers_.push(marker);
	    var mCount = this.markers_.length;
	    var mz = this.markerClusterer_.getMaxZoom();

	    if (mz !== null && this.map_.getZoom() > mz) {
	      // Zoomed in past max zoom, so show the marker.
	      if (marker.getMap() !== this.map_) {
	        marker.setMap(this.map_);
	      }
	    } else if (mCount < this.minClusterSize_) {
	      // Min cluster size not reached so show the marker.
	      if (marker.getMap() !== this.map_) {
	        marker.setMap(this.map_);
	      }
	    } else if (mCount === this.minClusterSize_) {
	      // Hide the markers that were showing.
	      for (var i = 0; i < mCount; i++) {
	        this.markers_[i].setMap(null);
	      }
	    } else {
	      marker.setMap(null);
	    }

	    return true;
	  };
	  /**
	   * Determines if a marker lies within the cluster's bounds.
	   *
	   * @param marker The marker to check.
	   * @return True if the marker lies in the bounds.
	   * @ignore
	   */


	  Cluster.prototype.isMarkerInClusterBounds = function (marker) {
	    return this.bounds_.contains(marker.getPosition());
	  };
	  /**
	   * Calculates the extended bounds of the cluster with the grid.
	   */


	  Cluster.prototype.calculateBounds_ = function () {
	    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
	    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
	  };
	  /**
	   * Updates the cluster icon.
	   */


	  Cluster.prototype.updateIcon = function () {
	    var mCount = this.markers_.length;
	    var mz = this.markerClusterer_.getMaxZoom();

	    if (mz !== null && this.map_.getZoom() > mz) {
	      this.clusterIcon_.hide();
	      return;
	    }

	    if (mCount < this.minClusterSize_) {
	      // Min cluster size not yet reached.
	      this.clusterIcon_.hide();
	      return;
	    }

	    var numStyles = this.markerClusterer_.getStyles().length;
	    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
	    this.clusterIcon_.setCenter(this.center_);
	    this.clusterIcon_.useStyle(sums);
	    this.clusterIcon_.show();
	  };
	  /**
	   * Determines if a marker has already been added to the cluster.
	   *
	   * @param marker The marker to check.
	   * @return True if the marker has already been added.
	   */


	  Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
	    if (this.markers_.indexOf) {
	      return this.markers_.indexOf(marker) !== -1;
	    } else {
	      for (var i = 0; i < this.markers_.length; i++) {
	        if (marker === this.markers_[i]) {
	          return true;
	        }
	      }
	    }

	    return false;
	  };

	  return Cluster;
	}();

	/**
	 * @ignore
	 */

	var getOption = function getOption(options, prop, def) {
	  if (options[prop] !== undefined) {
	    return options[prop];
	  } else {
	    return def;
	  }
	};

	var MarkerClusterer =
	/** @class */
	function (_super) {
	  __extends(MarkerClusterer, _super);
	  /**
	   * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
	   * @param map The Google map to attach to.
	   * @param markers The markers to be added to the cluster.
	   * @param options The optional parameters.
	   */


	  function MarkerClusterer(map, markers, options) {
	    if (markers === void 0) {
	      markers = [];
	    }

	    if (options === void 0) {
	      options = {};
	    }

	    var _this = _super.call(this) || this;

	    _this.options = options;
	    _this.markers_ = [];
	    _this.clusters_ = [];
	    _this.listeners_ = [];
	    _this.activeMap_ = null;
	    _this.ready_ = false;

	    _this.ariaLabelFn = _this.options.ariaLabelFn || function () {
	      return "";
	    };

	    _this.zIndex_ = _this.options.zIndex || google.maps.Marker.MAX_ZINDEX + 1;
	    _this.gridSize_ = _this.options.gridSize || 60;
	    _this.minClusterSize_ = _this.options.minimumClusterSize || 2;
	    _this.maxZoom_ = _this.options.maxZoom || null;
	    _this.styles_ = _this.options.styles || [];
	    _this.title_ = _this.options.title || "";
	    _this.zoomOnClick_ = getOption(_this.options, "zoomOnClick", true);
	    _this.averageCenter_ = getOption(_this.options, "averageCenter", false);
	    _this.ignoreHidden_ = getOption(_this.options, "ignoreHidden", false);
	    _this.enableRetinaIcons_ = getOption(_this.options, "enableRetinaIcons", false);
	    _this.imagePath_ = _this.options.imagePath || MarkerClusterer.IMAGE_PATH;
	    _this.imageExtension_ = _this.options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
	    _this.imageSizes_ = _this.options.imageSizes || MarkerClusterer.IMAGE_SIZES;
	    _this.calculator_ = _this.options.calculator || MarkerClusterer.CALCULATOR;
	    _this.batchSize_ = _this.options.batchSize || MarkerClusterer.BATCH_SIZE;
	    _this.batchSizeIE_ = _this.options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
	    _this.clusterClass_ = _this.options.clusterClass || "cluster";

	    if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
	      // Try to avoid IE timeout when processing a huge number of markers:
	      _this.batchSize_ = _this.batchSizeIE_;
	    }

	    _this.setupStyles_();

	    _this.addMarkers(markers, true);

	    _this.setMap(map); // Note: this causes onAdd to be called


	    return _this;
	  }
	  /**
	   * Implementation of the onAdd interface method.
	   * @ignore
	   */


	  MarkerClusterer.prototype.onAdd = function () {
	    var _this = this;

	    this.activeMap_ = this.getMap();
	    this.ready_ = true;
	    this.repaint();
	    this.prevZoom_ = this.getMap().getZoom(); // Add the map event listeners

	    this.listeners_ = [google.maps.event.addListener(this.getMap(), "zoom_changed", function () {
	      var map = _this.getMap(); // eslint-disable-line @typescript-eslint/no-explicit-any
	      // Fix for bug #407
	      // Determines map type and prevents illegal zoom levels


	      var minZoom = map.minZoom || 0;
	      var maxZoom = Math.min(map.maxZoom || 100, map.mapTypes[map.getMapTypeId()].maxZoom);
	      var zoom = Math.min(Math.max(_this.getMap().getZoom(), minZoom), maxZoom);

	      if (_this.prevZoom_ != zoom) {
	        _this.prevZoom_ = zoom;

	        _this.resetViewport_(false);
	      }
	    }), google.maps.event.addListener(this.getMap(), "idle", function () {
	      _this.redraw_();
	    })];
	  };
	  /**
	   * Implementation of the onRemove interface method.
	   * Removes map event listeners and all cluster icons from the DOM.
	   * All managed markers are also put back on the map.
	   * @ignore
	   */


	  MarkerClusterer.prototype.onRemove = function () {
	    // Put all the managed markers back on the map:
	    for (var i = 0; i < this.markers_.length; i++) {
	      if (this.markers_[i].getMap() !== this.activeMap_) {
	        this.markers_[i].setMap(this.activeMap_);
	      }
	    } // Remove all clusters:


	    for (var i = 0; i < this.clusters_.length; i++) {
	      this.clusters_[i].remove();
	    }

	    this.clusters_ = []; // Remove map event listeners:

	    for (var i = 0; i < this.listeners_.length; i++) {
	      google.maps.event.removeListener(this.listeners_[i]);
	    }

	    this.listeners_ = [];
	    this.activeMap_ = null;
	    this.ready_ = false;
	  };
	  /**
	   * Implementation of the draw interface method.
	   * @ignore
	   */


	  MarkerClusterer.prototype.draw = function () {};
	  /**
	   * Sets up the styles object.
	   */


	  MarkerClusterer.prototype.setupStyles_ = function () {
	    if (this.styles_.length > 0) {
	      return;
	    }

	    for (var i = 0; i < this.imageSizes_.length; i++) {
	      var size = this.imageSizes_[i];
	      this.styles_.push(MarkerClusterer.withDefaultStyle({
	        url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
	        height: size,
	        width: size
	      }));
	    }
	  };
	  /**
	   *  Fits the map to the bounds of the markers managed by the clusterer.
	   */


	  MarkerClusterer.prototype.fitMapToMarkers = function (padding) {
	    var markers = this.getMarkers();
	    var bounds = new google.maps.LatLngBounds();

	    for (var i = 0; i < markers.length; i++) {
	      // March 3, 2018: Bug fix -- honor the ignoreHidden property
	      if (markers[i].getVisible() || !this.getIgnoreHidden()) {
	        bounds.extend(markers[i].getPosition());
	      }
	    }

	    this.getMap().fitBounds(bounds, padding);
	  };
	  /**
	   * Returns the value of the `gridSize` property.
	   *
	   * @return The grid size.
	   */


	  MarkerClusterer.prototype.getGridSize = function () {
	    return this.gridSize_;
	  };
	  /**
	   * Sets the value of the `gridSize` property.
	   *
	   * @param gridSize The grid size.
	   */


	  MarkerClusterer.prototype.setGridSize = function (gridSize) {
	    this.gridSize_ = gridSize;
	  };
	  /**
	   * Returns the value of the `minimumClusterSize` property.
	   *
	   * @return The minimum cluster size.
	   */


	  MarkerClusterer.prototype.getMinimumClusterSize = function () {
	    return this.minClusterSize_;
	  };
	  /**
	   * Sets the value of the `minimumClusterSize` property.
	   *
	   * @param minimumClusterSize The minimum cluster size.
	   */


	  MarkerClusterer.prototype.setMinimumClusterSize = function (minimumClusterSize) {
	    this.minClusterSize_ = minimumClusterSize;
	  };
	  /**
	   *  Returns the value of the `maxZoom` property.
	   *
	   *  @return The maximum zoom level.
	   */


	  MarkerClusterer.prototype.getMaxZoom = function () {
	    return this.maxZoom_;
	  };
	  /**
	   *  Sets the value of the `maxZoom` property.
	   *
	   *  @param maxZoom The maximum zoom level.
	   */


	  MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
	    this.maxZoom_ = maxZoom;
	  };

	  MarkerClusterer.prototype.getZIndex = function () {
	    return this.zIndex_;
	  };

	  MarkerClusterer.prototype.setZIndex = function (zIndex) {
	    this.zIndex_ = zIndex;
	  };
	  /**
	   *  Returns the value of the `styles` property.
	   *
	   *  @return The array of styles defining the cluster markers to be used.
	   */


	  MarkerClusterer.prototype.getStyles = function () {
	    return this.styles_;
	  };
	  /**
	   *  Sets the value of the `styles` property.
	   *
	   *  @param styles The array of styles to use.
	   */


	  MarkerClusterer.prototype.setStyles = function (styles) {
	    this.styles_ = styles;
	  };
	  /**
	   * Returns the value of the `title` property.
	   *
	   * @return The content of the title text.
	   */


	  MarkerClusterer.prototype.getTitle = function () {
	    return this.title_;
	  };
	  /**
	   *  Sets the value of the `title` property.
	   *
	   *  @param title The value of the title property.
	   */


	  MarkerClusterer.prototype.setTitle = function (title) {
	    this.title_ = title;
	  };
	  /**
	   * Returns the value of the `zoomOnClick` property.
	   *
	   * @return True if zoomOnClick property is set.
	   */


	  MarkerClusterer.prototype.getZoomOnClick = function () {
	    return this.zoomOnClick_;
	  };
	  /**
	   *  Sets the value of the `zoomOnClick` property.
	   *
	   *  @param zoomOnClick The value of the zoomOnClick property.
	   */


	  MarkerClusterer.prototype.setZoomOnClick = function (zoomOnClick) {
	    this.zoomOnClick_ = zoomOnClick;
	  };
	  /**
	   * Returns the value of the `averageCenter` property.
	   *
	   * @return True if averageCenter property is set.
	   */


	  MarkerClusterer.prototype.getAverageCenter = function () {
	    return this.averageCenter_;
	  };
	  /**
	   *  Sets the value of the `averageCenter` property.
	   *
	   *  @param averageCenter The value of the averageCenter property.
	   */


	  MarkerClusterer.prototype.setAverageCenter = function (averageCenter) {
	    this.averageCenter_ = averageCenter;
	  };
	  /**
	   * Returns the value of the `ignoreHidden` property.
	   *
	   * @return True if ignoreHidden property is set.
	   */


	  MarkerClusterer.prototype.getIgnoreHidden = function () {
	    return this.ignoreHidden_;
	  };
	  /**
	   *  Sets the value of the `ignoreHidden` property.
	   *
	   *  @param ignoreHidden The value of the ignoreHidden property.
	   */


	  MarkerClusterer.prototype.setIgnoreHidden = function (ignoreHidden) {
	    this.ignoreHidden_ = ignoreHidden;
	  };
	  /**
	   * Returns the value of the `enableRetinaIcons` property.
	   *
	   * @return True if enableRetinaIcons property is set.
	   */


	  MarkerClusterer.prototype.getEnableRetinaIcons = function () {
	    return this.enableRetinaIcons_;
	  };
	  /**
	   *  Sets the value of the `enableRetinaIcons` property.
	   *
	   *  @param enableRetinaIcons The value of the enableRetinaIcons property.
	   */


	  MarkerClusterer.prototype.setEnableRetinaIcons = function (enableRetinaIcons) {
	    this.enableRetinaIcons_ = enableRetinaIcons;
	  };
	  /**
	   * Returns the value of the `imageExtension` property.
	   *
	   * @return The value of the imageExtension property.
	   */


	  MarkerClusterer.prototype.getImageExtension = function () {
	    return this.imageExtension_;
	  };
	  /**
	   *  Sets the value of the `imageExtension` property.
	   *
	   *  @param imageExtension The value of the imageExtension property.
	   */


	  MarkerClusterer.prototype.setImageExtension = function (imageExtension) {
	    this.imageExtension_ = imageExtension;
	  };
	  /**
	   * Returns the value of the `imagePath` property.
	   *
	   * @return The value of the imagePath property.
	   */


	  MarkerClusterer.prototype.getImagePath = function () {
	    return this.imagePath_;
	  };
	  /**
	   *  Sets the value of the `imagePath` property.
	   *
	   *  @param imagePath The value of the imagePath property.
	   */


	  MarkerClusterer.prototype.setImagePath = function (imagePath) {
	    this.imagePath_ = imagePath;
	  };
	  /**
	   * Returns the value of the `imageSizes` property.
	   *
	   * @return The value of the imageSizes property.
	   */


	  MarkerClusterer.prototype.getImageSizes = function () {
	    return this.imageSizes_;
	  };
	  /**
	   *  Sets the value of the `imageSizes` property.
	   *
	   *  @param imageSizes The value of the imageSizes property.
	   */


	  MarkerClusterer.prototype.setImageSizes = function (imageSizes) {
	    this.imageSizes_ = imageSizes;
	  };
	  /**
	   * Returns the value of the `calculator` property.
	   *
	   * @return the value of the calculator property.
	   */


	  MarkerClusterer.prototype.getCalculator = function () {
	    return this.calculator_;
	  };
	  /**
	   * Sets the value of the `calculator` property.
	   *
	   * @param calculator The value of the calculator property.
	   */


	  MarkerClusterer.prototype.setCalculator = function (calculator) {
	    this.calculator_ = calculator;
	  };
	  /**
	   * Returns the value of the `batchSizeIE` property.
	   *
	   * @return the value of the batchSizeIE property.
	   */


	  MarkerClusterer.prototype.getBatchSizeIE = function () {
	    return this.batchSizeIE_;
	  };
	  /**
	   * Sets the value of the `batchSizeIE` property.
	   *
	   *  @param batchSizeIE The value of the batchSizeIE property.
	   */


	  MarkerClusterer.prototype.setBatchSizeIE = function (batchSizeIE) {
	    this.batchSizeIE_ = batchSizeIE;
	  };
	  /**
	   * Returns the value of the `clusterClass` property.
	   *
	   * @return the value of the clusterClass property.
	   */


	  MarkerClusterer.prototype.getClusterClass = function () {
	    return this.clusterClass_;
	  };
	  /**
	   * Sets the value of the `clusterClass` property.
	   *
	   *  @param clusterClass The value of the clusterClass property.
	   */


	  MarkerClusterer.prototype.setClusterClass = function (clusterClass) {
	    this.clusterClass_ = clusterClass;
	  };
	  /**
	   *  Returns the array of markers managed by the clusterer.
	   *
	   *  @return The array of markers managed by the clusterer.
	   */


	  MarkerClusterer.prototype.getMarkers = function () {
	    return this.markers_;
	  };
	  /**
	   *  Returns the number of markers managed by the clusterer.
	   *
	   *  @return The number of markers.
	   */


	  MarkerClusterer.prototype.getTotalMarkers = function () {
	    return this.markers_.length;
	  };
	  /**
	   * Returns the current array of clusters formed by the clusterer.
	   *
	   * @return The array of clusters formed by the clusterer.
	   */


	  MarkerClusterer.prototype.getClusters = function () {
	    return this.clusters_;
	  };
	  /**
	   * Returns the number of clusters formed by the clusterer.
	   *
	   * @return The number of clusters formed by the clusterer.
	   */


	  MarkerClusterer.prototype.getTotalClusters = function () {
	    return this.clusters_.length;
	  };
	  /**
	   * Adds a marker to the clusterer. The clusters are redrawn unless
	   *  `nodraw` is set to `true`.
	   *
	   * @param marker The marker to add.
	   * @param nodraw Set to `true` to prevent redrawing.
	   */


	  MarkerClusterer.prototype.addMarker = function (marker, nodraw) {
	    this.pushMarkerTo_(marker);

	    if (!nodraw) {
	      this.redraw_();
	    }
	  };
	  /**
	   * Adds an array of markers to the clusterer. The clusters are redrawn unless
	   *  `nodraw` is set to `true`.
	   *
	   * @param markers The markers to add.
	   * @param nodraw Set to `true` to prevent redrawing.
	   */


	  MarkerClusterer.prototype.addMarkers = function (markers, nodraw) {
	    for (var key in markers) {
	      if (Object.prototype.hasOwnProperty.call(markers, key)) {
	        this.pushMarkerTo_(markers[key]);
	      }
	    }

	    if (!nodraw) {
	      this.redraw_();
	    }
	  };
	  /**
	   * Pushes a marker to the clusterer.
	   *
	   * @param marker The marker to add.
	   */


	  MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
	    var _this = this; // If the marker is draggable add a listener so we can update the clusters on the dragend:


	    if (marker.getDraggable()) {
	      google.maps.event.addListener(marker, "dragend", function () {
	        if (_this.ready_) {
	          marker.isAdded = false;

	          _this.repaint();
	        }
	      });
	    }

	    marker.isAdded = false;
	    this.markers_.push(marker);
	  };
	  /**
	   * Removes a marker from the cluster.  The clusters are redrawn unless
	   *  `nodraw` is set to `true`. Returns `true` if the
	   *  marker was removed from the clusterer.
	   *
	   * @param marker The marker to remove.
	   * @param nodraw Set to `true` to prevent redrawing.
	   * @return True if the marker was removed from the clusterer.
	   */


	  MarkerClusterer.prototype.removeMarker = function (marker, nodraw) {
	    var removed = this.removeMarker_(marker);

	    if (!nodraw && removed) {
	      this.repaint();
	    }

	    return removed;
	  };
	  /**
	   * Removes an array of markers from the cluster. The clusters are redrawn unless
	   *  `nodraw` is set to `true`. Returns `true` if markers were removed from the clusterer.
	   *
	   * @param markers The markers to remove.
	   * @param nodraw Set to `true` to prevent redrawing.
	   * @return True if markers were removed from the clusterer.
	   */


	  MarkerClusterer.prototype.removeMarkers = function (markers, nodraw) {
	    var removed = false;

	    for (var i = 0; i < markers.length; i++) {
	      var r = this.removeMarker_(markers[i]);
	      removed = removed || r;
	    }

	    if (!nodraw && removed) {
	      this.repaint();
	    }

	    return removed;
	  };
	  /**
	   * Removes a marker and returns true if removed, false if not.
	   *
	   * @param marker The marker to remove
	   * @return Whether the marker was removed or not
	   */


	  MarkerClusterer.prototype.removeMarker_ = function (marker) {
	    var index = -1;

	    if (this.markers_.indexOf) {
	      index = this.markers_.indexOf(marker);
	    } else {
	      for (var i = 0; i < this.markers_.length; i++) {
	        if (marker === this.markers_[i]) {
	          index = i;
	          break;
	        }
	      }
	    }

	    if (index === -1) {
	      // Marker is not in our list of markers, so do nothing:
	      return false;
	    }

	    marker.setMap(null);
	    this.markers_.splice(index, 1); // Remove the marker from the list of managed markers

	    return true;
	  };
	  /**
	   * Removes all clusters and markers from the map and also removes all markers
	   *  managed by the clusterer.
	   */


	  MarkerClusterer.prototype.clearMarkers = function () {
	    this.resetViewport_(true);
	    this.markers_ = [];
	  };
	  /**
	   * Recalculates and redraws all the marker clusters from scratch.
	   *  Call this after changing any properties.
	   */


	  MarkerClusterer.prototype.repaint = function () {
	    var oldClusters = this.clusters_.slice();
	    this.clusters_ = [];
	    this.resetViewport_(false);
	    this.redraw_(); // Remove the old clusters.
	    // Do it in a timeout to prevent blinking effect.

	    setTimeout(function () {
	      for (var i = 0; i < oldClusters.length; i++) {
	        oldClusters[i].remove();
	      }
	    }, 0);
	  };
	  /**
	   * Returns the current bounds extended by the grid size.
	   *
	   * @param bounds The bounds to extend.
	   * @return The extended bounds.
	   * @ignore
	   */


	  MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
	    var projection = this.getProjection(); // Turn the bounds into latlng.

	    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
	    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng()); // Convert the points to pixels and the extend out by the grid size.

	    var trPix = projection.fromLatLngToDivPixel(tr);
	    trPix.x += this.gridSize_;
	    trPix.y -= this.gridSize_;
	    var blPix = projection.fromLatLngToDivPixel(bl);
	    blPix.x -= this.gridSize_;
	    blPix.y += this.gridSize_; // Convert the pixel points back to LatLng

	    var ne = projection.fromDivPixelToLatLng(trPix);
	    var sw = projection.fromDivPixelToLatLng(blPix); // Extend the bounds to contain the new bounds.

	    bounds.extend(ne);
	    bounds.extend(sw);
	    return bounds;
	  };
	  /**
	   * Redraws all the clusters.
	   */


	  MarkerClusterer.prototype.redraw_ = function () {
	    this.createClusters_(0);
	  };
	  /**
	   * Removes all clusters from the map. The markers are also removed from the map
	   *  if `hide` is set to `true`.
	   *
	   * @param hide Set to `true` to also remove the markers from the map.
	   */


	  MarkerClusterer.prototype.resetViewport_ = function (hide) {
	    // Remove all the clusters
	    for (var i = 0; i < this.clusters_.length; i++) {
	      this.clusters_[i].remove();
	    }

	    this.clusters_ = []; // Reset the markers to not be added and to be removed from the map.

	    for (var i = 0; i < this.markers_.length; i++) {
	      var marker = this.markers_[i];
	      marker.isAdded = false;

	      if (hide) {
	        marker.setMap(null);
	      }
	    }
	  };
	  /**
	   * Calculates the distance between two latlng locations in km.
	   *
	   * @param p1 The first lat lng point.
	   * @param p2 The second lat lng point.
	   * @return The distance between the two points in km.
	   * @link http://www.movable-type.co.uk/scripts/latlong.html
	   */


	  MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
	    var R = 6371; // Radius of the Earth in km

	    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
	    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    return R * c;
	  };
	  /**
	   * Determines if a marker is contained in a bounds.
	   *
	   * @param marker The marker to check.
	   * @param bounds The bounds to check against.
	   * @return True if the marker is in the bounds.
	   */


	  MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
	    return bounds.contains(marker.getPosition());
	  };
	  /**
	   * Adds a marker to a cluster, or creates a new cluster.
	   *
	   * @param marker The marker to add.
	   */


	  MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
	    var distance = 40000; // Some large number

	    var clusterToAddTo = null;

	    for (var i = 0; i < this.clusters_.length; i++) {
	      var cluster = this.clusters_[i];
	      var center = cluster.getCenter();

	      if (center) {
	        var d = this.distanceBetweenPoints_(center, marker.getPosition());

	        if (d < distance) {
	          distance = d;
	          clusterToAddTo = cluster;
	        }
	      }
	    }

	    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
	      clusterToAddTo.addMarker(marker);
	    } else {
	      var cluster = new Cluster(this);
	      cluster.addMarker(marker);
	      this.clusters_.push(cluster);
	    }
	  };
	  /**
	   * Creates the clusters. This is done in batches to avoid timeout errors
	   *  in some browsers when there is a huge number of markers.
	   *
	   * @param iFirst The index of the first marker in the batch of
	   *  markers to be added to clusters.
	   */


	  MarkerClusterer.prototype.createClusters_ = function (iFirst) {
	    var _this = this;

	    if (!this.ready_) {
	      return;
	    } // Cancel previous batch processing if we're working on the first batch:


	    if (iFirst === 0) {
	      google.maps.event.trigger(this, "clusteringbegin", this);

	      if (typeof this.timerRefStatic !== "undefined") {
	        clearTimeout(this.timerRefStatic);
	        delete this.timerRefStatic;
	      }
	    } // Get our current map view bounds.
	    // Create a new bounds object so we don't affect the map.
	    //
	    // See Comments 9 & 11 on Issue 3651 relating to this workaround for a Google Maps bug:


	    var mapBounds;

	    if (this.getMap().getZoom() > 3) {
	      mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast());
	    } else {
	      mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
	    }

	    var bounds = this.getExtendedBounds(mapBounds);
	    var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);

	    for (var i = iFirst; i < iLast; i++) {
	      var marker = this.markers_[i];

	      if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
	        if (!this.ignoreHidden_ || this.ignoreHidden_ && marker.getVisible()) {
	          this.addToClosestCluster_(marker);
	        }
	      }
	    }

	    if (iLast < this.markers_.length) {
	      this.timerRefStatic = window.setTimeout(function () {
	        _this.createClusters_(iLast);
	      }, 0);
	    } else {
	      delete this.timerRefStatic;
	      google.maps.event.trigger(this, "clusteringend", this);

	      for (var i = 0; i < this.clusters_.length; i++) {
	        this.clusters_[i].updateIcon();
	      }
	    }
	  };
	  /**
	   * The default function for determining the label text and style
	   * for a cluster icon.
	   *
	   * @param markers The array of markers represented by the cluster.
	   * @param numStyles The number of marker styles available.
	   * @return The information resource for the cluster.
	   */


	  MarkerClusterer.CALCULATOR = function (markers, numStyles) {
	    var index = 0;
	    var count = markers.length;
	    var dv = count;

	    while (dv !== 0) {
	      dv = Math.floor(dv / 10);
	      index++;
	    }

	    index = Math.min(index, numStyles);
	    return {
	      text: count.toString(),
	      index: index,
	      title: ""
	    };
	  };
	  /**
	   * Generates default styles augmented with user passed values.
	   * Useful when you want to override some default values but keep untouched
	   *
	   * @param overrides override default values
	   */


	  MarkerClusterer.withDefaultStyle = function (overrides) {
	    return __assign({
	      textColor: "black",
	      textSize: 11,
	      textDecoration: "none",
	      textLineHeight: overrides.height,
	      fontWeight: "bold",
	      fontStyle: "normal",
	      fontFamily: "Arial,sans-serif",
	      backgroundPosition: "0 0"
	    }, overrides);
	  };
	  /**
	   * The number of markers to process in one batch.
	   */


	  MarkerClusterer.BATCH_SIZE = 2000;
	  /**
	   * The number of markers to process in one batch (IE only).
	   */

	  MarkerClusterer.BATCH_SIZE_IE = 500;
	  /**
	   * The default root name for the marker cluster images.
	   */

	  MarkerClusterer.IMAGE_PATH = "../images/m";
	  /**
	   * The default extension name for the marker cluster images.
	   */

	  MarkerClusterer.IMAGE_EXTENSION = "png";
	  /**
	   * The default array of sizes for the marker cluster images.
	   */

	  MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];
	  return MarkerClusterer;
	}(OverlayViewSafe);

	/**
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	return MarkerClusterer;

}());
