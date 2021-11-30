var MarkerClusterer = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var fails$i = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$h = fails$i; // Detect IE8's incomplete defineProperty implementation

	var descriptors = !fails$h(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$z = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var FunctionPrototype$2 = Function.prototype;
	var bind$1 = FunctionPrototype$2.bind;
	var call$9 = FunctionPrototype$2.call;
	var callBind = bind$1 && bind$1.bind(call$9);
	var functionUncurryThis = bind$1 ? function (fn) {
	  return fn && callBind(call$9, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$9.apply(fn, arguments);
	  };
	};

	// https://tc39.es/ecma262/#sec-iscallable

	var isCallable$f = function (argument) {
	  return typeof argument == 'function';
	};

	var fails$g = fails$i;
	var isCallable$e = isCallable$f;
	var replacement = /#|\.prototype\./;

	var isForced$2 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$e(detection) ? fails$g(detection) : !!detection;
	};

	var normalize = isForced$2.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$2.data = {};
	var NATIVE = isForced$2.NATIVE = 'N';
	var POLYFILL = isForced$2.POLYFILL = 'P';
	var isForced_1 = isForced$2;

	var redefine$5 = {exports: {}};

	var global$y = global$z;
	var TypeError$d = global$y.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$6 = function (it) {
	  if (it == undefined) throw TypeError$d("Can't call method on " + it);
	  return it;
	};

	var global$x = global$z;
	var requireObjectCoercible$5 = requireObjectCoercible$6;
	var Object$4 = global$x.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$5 = function (argument) {
	  return Object$4(requireObjectCoercible$5(argument));
	};

	var uncurryThis$m = functionUncurryThis;
	var toObject$4 = toObject$5;
	var hasOwnProperty = uncurryThis$m({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$4(it), key);
	};

	var objectDefineProperty = {};

	var isCallable$d = isCallable$f;

	var isObject$a = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$d(it);
	};

	var global$w = global$z;
	var isObject$9 = isObject$a;
	var document$1 = global$w.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$9(document$1) && isObject$9(document$1.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$6 = descriptors;
	var fails$f = fails$i;
	var createElement = documentCreateElement$1; // Thank's IE8 for his funny defineProperty

	var ie8DomDefine = !DESCRIPTORS$6 && !fails$f(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var global$v = global$z;
	var isObject$8 = isObject$a;
	var String$4 = global$v.String;
	var TypeError$c = global$v.TypeError; // `Assert: Type(argument) is Object`

	var anObject$b = function (argument) {
	  if (isObject$8(argument)) return argument;
	  throw TypeError$c(String$4(argument) + ' is not an object');
	};

	var call$8 = Function.prototype.call;
	var functionCall = call$8.bind ? call$8.bind(call$8) : function () {
	  return call$8.apply(call$8, arguments);
	};

	var global$u = global$z;
	var isCallable$c = isCallable$f;

	var aFunction = function (argument) {
	  return isCallable$c(argument) ? argument : undefined;
	};

	var getBuiltIn$5 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$u[namespace]) : global$u[namespace] && global$u[namespace][method];
	};

	var uncurryThis$l = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$l({}.isPrototypeOf);

	var getBuiltIn$4 = getBuiltIn$5;
	var engineUserAgent = getBuiltIn$4('navigator', 'userAgent') || '';

	var global$t = global$z;
	var userAgent = engineUserAgent;
	var process = global$t.process;
	var Deno = global$t.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$2 = engineV8Version;
	var fails$e = fails$i; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$e(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$1 = nativeSymbol;
	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$s = global$z;
	var getBuiltIn$3 = getBuiltIn$5;
	var isCallable$b = isCallable$f;
	var isPrototypeOf$2 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var Object$3 = global$s.Object;
	var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$3('Symbol');
	  return isCallable$b($Symbol) && isPrototypeOf$2($Symbol.prototype, Object$3(it));
	};

	var global$r = global$z;
	var String$3 = global$r.String;

	var tryToString$2 = function (argument) {
	  try {
	    return String$3(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$q = global$z;
	var isCallable$a = isCallable$f;
	var tryToString$1 = tryToString$2;
	var TypeError$b = global$q.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$1 = function (argument) {
	  if (isCallable$a(argument)) return argument;
	  throw TypeError$b(tryToString$1(argument) + ' is not a function');
	};

	var aCallable = aCallable$1; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod

	var getMethod$3 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var global$p = global$z;
	var call$7 = functionCall;
	var isCallable$9 = isCallable$f;
	var isObject$7 = isObject$a;
	var TypeError$a = global$p.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$9(fn = input.toString) && !isObject$7(val = call$7(fn, input))) return val;
	  if (isCallable$9(fn = input.valueOf) && !isObject$7(val = call$7(fn, input))) return val;
	  if (pref !== 'string' && isCallable$9(fn = input.toString) && !isObject$7(val = call$7(fn, input))) return val;
	  throw TypeError$a("Can't convert object to primitive value");
	};

	var shared$4 = {exports: {}};

	var global$o = global$z; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var defineProperty$1 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$1(global$o, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$o[key] = value;
	  }

	  return value;
	};

	var global$n = global$z;
	var setGlobal$2 = setGlobal$3;
	var SHARED = '__core-js_shared__';
	var store$3 = global$n[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;
	(shared$4.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.19.2',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var uncurryThis$k = functionUncurryThis;
	var id = 0;
	var postfix = Math.random();
	var toString$8 = uncurryThis$k(1.0.toString);

	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$8(++id + postfix, 36);
	};

	var global$m = global$z;
	var shared$3 = shared$4.exports;
	var hasOwn$7 = hasOwnProperty_1;
	var uid$1 = uid$2;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var WellKnownSymbolsStore = shared$3('wks');
	var Symbol$1 = global$m.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$b = function (name) {
	  if (!hasOwn$7(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL && hasOwn$7(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore[name];
	};

	var global$l = global$z;
	var call$6 = functionCall;
	var isObject$6 = isObject$a;
	var isSymbol$2 = isSymbol$3;
	var getMethod$2 = getMethod$3;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$a = wellKnownSymbol$b;
	var TypeError$9 = global$l.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$a('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$2 = function (input, pref) {
	  if (!isObject$6(input) || isSymbol$2(input)) return input;
	  var exoticToPrim = getMethod$2(input, TO_PRIMITIVE);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$6(exoticToPrim, input, pref);
	    if (!isObject$6(result) || isSymbol$2(result)) return result;
	    throw TypeError$9("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive$1 = toPrimitive$2;
	var isSymbol$1 = isSymbol$3; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey

	var toPropertyKey$3 = function (argument) {
	  var key = toPrimitive$1(argument, 'string');
	  return isSymbol$1(key) ? key : key + '';
	};

	var global$k = global$z;
	var DESCRIPTORS$5 = descriptors;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;
	var anObject$a = anObject$b;
	var toPropertyKey$2 = toPropertyKey$3;
	var TypeError$8 = global$k.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$5 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$a(O);
	  P = toPropertyKey$2(P);
	  anObject$a(Attributes);
	  if (IE8_DOM_DEFINE$1) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$8('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var createPropertyDescriptor$3 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var DESCRIPTORS$4 = descriptors;
	var definePropertyModule$3 = objectDefineProperty;
	var createPropertyDescriptor$2 = createPropertyDescriptor$3;
	var createNonEnumerableProperty$4 = DESCRIPTORS$4 ? function (object, key, value) {
	  return definePropertyModule$3.f(object, key, createPropertyDescriptor$2(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var uncurryThis$j = functionUncurryThis;
	var isCallable$8 = isCallable$f;
	var store$1 = sharedStore;
	var functionToString = uncurryThis$j(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$8(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource$3 = store$1.inspectSource;

	var global$j = global$z;
	var isCallable$7 = isCallable$f;
	var inspectSource$2 = inspectSource$3;
	var WeakMap$1 = global$j.WeakMap;
	var nativeWeakMap = isCallable$7(WeakMap$1) && /native code/.test(inspectSource$2(WeakMap$1));

	var shared$2 = shared$4.exports;
	var uid = uid$2;
	var keys$1 = shared$2('keys');

	var sharedKey$2 = function (key) {
	  return keys$1[key] || (keys$1[key] = uid(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;
	var global$i = global$z;
	var uncurryThis$i = functionUncurryThis;
	var isObject$5 = isObject$a;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$4;
	var hasOwn$6 = hasOwnProperty_1;
	var shared$1 = sharedStore;
	var sharedKey$1 = sharedKey$2;
	var hiddenKeys$3 = hiddenKeys$4;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$7 = global$i.TypeError;
	var WeakMap = global$i.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$5(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$7('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared$1.state) {
	  var store = shared$1.state || (shared$1.state = new WeakMap());
	  var wmget = uncurryThis$i(store.get);
	  var wmhas = uncurryThis$i(store.has);
	  var wmset = uncurryThis$i(store.set);

	  set = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey$1('state');
	  hiddenKeys$3[STATE] = true;

	  set = function (it, metadata) {
	    if (hasOwn$6(it, STATE)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$3(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return hasOwn$6(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$6(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$3 = descriptors;
	var hasOwn$5 = hasOwnProperty_1;
	var FunctionPrototype$1 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$3 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$5(FunctionPrototype$1, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$3 || DESCRIPTORS$3 && getDescriptor(FunctionPrototype$1, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$h = global$z;
	var isCallable$6 = isCallable$f;
	var hasOwn$4 = hasOwnProperty_1;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$4;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$1 = inspectSource$3;
	var InternalStateModule = internalState;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var getInternalState$1 = InternalStateModule.get;
	var enforceInternalState = InternalStateModule.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$5.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$6(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$4(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	      createNonEnumerableProperty$2(value, 'name', name);
	    }

	    state = enforceInternalState(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$h) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$2(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$6(this) && getInternalState$1(this).source || inspectSource$1(this);
	});

	var global$g = global$z;
	var isCallable$5 = isCallable$f;
	var String$2 = global$g.String;
	var TypeError$6 = global$g.TypeError;

	var aPossiblePrototype$1 = function (argument) {
	  if (typeof argument == 'object' || isCallable$5(argument)) return argument;
	  throw TypeError$6("Can't set " + String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */
	var uncurryThis$h = functionUncurryThis;
	var anObject$9 = anObject$b;
	var aPossiblePrototype = aPossiblePrototype$1; // `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe

	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = uncurryThis$h(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject$9(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var isCallable$4 = isCallable$f;
	var isObject$4 = isObject$a;
	var setPrototypeOf = objectSetPrototypeOf; // makes subclassing work correct for wrapped built-ins

	var inheritIfRequired$1 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if ( // it can work only with native `setPrototypeOf`
	  setPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  isCallable$4(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$4(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var objectGetOwnPropertyNames = {};

	var uncurryThis$g = functionUncurryThis;
	var toString$7 = uncurryThis$g({}.toString);
	var stringSlice$5 = uncurryThis$g(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$5(toString$7(it), 8, -1);
	};

	var global$f = global$z;
	var uncurryThis$f = functionUncurryThis;
	var fails$d = fails$i;
	var classof$7 = classofRaw$1;
	var Object$2 = global$f.Object;
	var split = uncurryThis$f(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$d(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$2('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$7(it) == 'String' ? split(it, '') : Object$2(it);
	} : Object$2;

	var IndexedObject$1 = indexedObject;
	var requireObjectCoercible$4 = requireObjectCoercible$6;

	var toIndexedObject$6 = function (it) {
	  return IndexedObject$1(requireObjectCoercible$4(it));
	};

	var ceil = Math.ceil;
	var floor$1 = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$5 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$1 : ceil)(number);
	};

	var toIntegerOrInfinity$4 = toIntegerOrInfinity$5;
	var max$4 = Math.max;
	var min$4 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$4 = function (index, length) {
	  var integer = toIntegerOrInfinity$4(index);
	  return integer < 0 ? max$4(integer + length, 0) : min$4(integer, length);
	};

	var toIntegerOrInfinity$3 = toIntegerOrInfinity$5;
	var min$3 = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$3 = function (argument) {
	  return argument > 0 ? min$3(toIntegerOrInfinity$3(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$2 = toLength$3; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike

	var lengthOfArrayLike$5 = function (obj) {
	  return toLength$2(obj.length);
	};

	var toIndexedObject$5 = toIndexedObject$6;
	var toAbsoluteIndex$3 = toAbsoluteIndex$4;
	var lengthOfArrayLike$4 = lengthOfArrayLike$5; // `Array.prototype.{ indexOf, includes }` methods implementation

	var createMethod$2 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$5($this);
	    var length = lengthOfArrayLike$4(O);
	    var index = toAbsoluteIndex$3(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$2(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$2(false)
	};

	var uncurryThis$e = functionUncurryThis;
	var hasOwn$3 = hasOwnProperty_1;
	var toIndexedObject$4 = toIndexedObject$6;
	var indexOf$1 = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;
	var push$2 = uncurryThis$e([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$4(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && push$2(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$2(result, key);
	  }

	  return result;
	};

	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;
	var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyDescriptor = {};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$2(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var DESCRIPTORS$2 = descriptors;
	var call$5 = functionCall;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$1 = createPropertyDescriptor$3;
	var toIndexedObject$3 = toIndexedObject$6;
	var toPropertyKey$1 = toPropertyKey$3;
	var hasOwn$2 = hasOwnProperty_1;
	var IE8_DOM_DEFINE = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$2 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$3(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$2(O, P)) return createPropertyDescriptor$1(!call$5(propertyIsEnumerableModule.f, O, P), O[P]);
	};

	var uncurryThis$d = functionUncurryThis; // `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue

	var thisNumberValue$1 = uncurryThis$d(1.0.valueOf);

	var wellKnownSymbol$9 = wellKnownSymbol$b;
	var TO_STRING_TAG$1 = wellKnownSymbol$9('toStringTag');
	var test = {};
	test[TO_STRING_TAG$1] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var global$e = global$z;
	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$3 = isCallable$f;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$8 = wellKnownSymbol$b;
	var TO_STRING_TAG = wellKnownSymbol$8('toStringTag');
	var Object$1 = global$e.Object; // ES3 wrong here

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


	var classof$6 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable$3(O.callee) ? 'Arguments' : result;
	};

	var global$d = global$z;
	var classof$5 = classof$6;
	var String$1 = global$d.String;

	var toString$6 = function (argument) {
	  if (classof$5(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	var whitespaces$1 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' + '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var uncurryThis$c = functionUncurryThis;
	var requireObjectCoercible$3 = requireObjectCoercible$6;
	var toString$5 = toString$6;
	var whitespaces = whitespaces$1;
	var replace$2 = uncurryThis$c(''.replace);
	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

	var createMethod$1 = function (TYPE) {
	  return function ($this) {
	    var string = toString$5(requireObjectCoercible$3($this));
	    if (TYPE & 1) string = replace$2(string, ltrim, '');
	    if (TYPE & 2) string = replace$2(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$1(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$1(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$1(3)
	};

	var DESCRIPTORS$1 = descriptors;
	var global$c = global$z;
	var uncurryThis$b = functionUncurryThis;
	var isForced$1 = isForced_1;
	var redefine$4 = redefine$5.exports;
	var hasOwn$1 = hasOwnProperty_1;
	var inheritIfRequired = inheritIfRequired$1;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var isSymbol = isSymbol$3;
	var toPrimitive = toPrimitive$2;
	var fails$c = fails$i;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var defineProperty = objectDefineProperty.f;
	var thisNumberValue = thisNumberValue$1;
	var trim = stringTrim.trim;
	var NUMBER = 'Number';
	var NativeNumber = global$c[NUMBER];
	var NumberPrototype = NativeNumber.prototype;
	var TypeError$5 = global$c.TypeError;
	var arraySlice$2 = uncurryThis$b(''.slice);
	var charCodeAt$1 = uncurryThis$b(''.charCodeAt); // `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric

	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
	}; // `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber


	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol(it)) throw TypeError$5('Cannot convert a Symbol value to a number');

	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = charCodeAt$1(it, 0);

	    if (first === 43 || first === 45) {
	      third = charCodeAt$1(it, 2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (charCodeAt$1(it, 1)) {
	        case 66:
	        case 98:
	          radix = 2;
	          maxCode = 49;
	          break;
	        // fast equal of /^0b[01]+$/i

	        case 79:
	        case 111:
	          radix = 8;
	          maxCode = 55;
	          break;
	        // fast equal of /^0o[0-7]+$/i

	        default:
	          return +it;
	      }

	      digits = arraySlice$2(it, 2);
	      length = digits.length;

	      for (index = 0; index < length; index++) {
	        code = charCodeAt$1(digits, index); // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols

	        if (code < 48 || code > maxCode) return NaN;
	      }

	      return parseInt(digits, radix);
	    }
	  }

	  return +it;
	}; // `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor


	if (isForced$1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	    var dummy = this; // check on 1..constructor(foo) case

	    return isPrototypeOf$1(NumberPrototype, dummy) && fails$c(function () {
	      thisNumberValue(dummy);
	    }) ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
	  };

	  for (var keys = DESCRIPTORS$1 ? getOwnPropertyNames(NativeNumber) : ( // ES3:
	  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES2015 (in case, if modules with ES2015 Number statics required before):
	  'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' + // ESNext
	  'fromString,range').split(','), j = 0, key; keys.length > j; j++) {
	    if (hasOwn$1(NativeNumber, key = keys[j]) && !hasOwn$1(NumberWrapper, key)) {
	      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor$1(NativeNumber, key));
	    }
	  }

	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine$4(global$c, NUMBER, NumberWrapper);
	}

	var objectGetOwnPropertySymbols = {};

	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$2 = getBuiltIn$5;
	var uncurryThis$a = functionUncurryThis;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var anObject$8 = anObject$b;
	var concat$1 = uncurryThis$a([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn$2('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$8(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$2 = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$2.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var global$b = global$z;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$4;
	var redefine$3 = redefine$5.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties = copyConstructorProperties$1;
	var isForced = isForced_1;
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
	  options.name        - the .name of the function if it does not match the key
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global$b;
	  } else if (STATIC) {
	    target = global$b[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$b[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$1(sourceProperty, 'sham', true);
	    } // extend global


	    redefine$3(target, key, sourceProperty, options);
	  }
	};

	var classof$4 = classofRaw$1; // `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe

	var isArray$3 = Array.isArray || function isArray(argument) {
	  return classof$4(argument) == 'Array';
	};

	var uncurryThis$9 = functionUncurryThis;
	var fails$b = fails$i;
	var isCallable$2 = isCallable$f;
	var classof$3 = classof$6;
	var getBuiltIn$1 = getBuiltIn$5;
	var inspectSource = inspectSource$3;

	var noop = function () {
	  /* empty */
	};

	var empty = [];
	var construct = getBuiltIn$1('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$2 = uncurryThis$9(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function (argument) {
	  if (!isCallable$2(argument)) return false;

	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function (argument) {
	  if (!isCallable$2(argument)) return false;

	  switch (classof$3(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	    // we can't check .prototype since constructors produced by .bind haven't it
	  }

	  return INCORRECT_TO_STRING || !!exec$2(constructorRegExp, inspectSource(argument));
	}; // `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor


	var isConstructor$3 = !construct || fails$b(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var global$a = global$z;
	var isArray$2 = isArray$3;
	var isConstructor$2 = isConstructor$3;
	var isObject$3 = isObject$a;
	var wellKnownSymbol$7 = wellKnownSymbol$b;
	var SPECIES$4 = wellKnownSymbol$7('species');
	var Array$3 = global$a.Array; // a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;

	  if (isArray$2(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (isConstructor$2(C) && (C === Array$3 || isArray$2(C.prototype))) C = undefined;else if (isObject$3(C)) {
	      C = C[SPECIES$4];
	      if (C === null) C = undefined;
	    }
	  }

	  return C === undefined ? Array$3 : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1; // `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate$2 = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var toPropertyKey = toPropertyKey$3;
	var definePropertyModule$1 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$3;

	var createProperty$4 = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) definePropertyModule$1.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var fails$a = fails$i;
	var wellKnownSymbol$6 = wellKnownSymbol$b;
	var V8_VERSION$1 = engineV8Version;
	var SPECIES$3 = wellKnownSymbol$6('species');

	var arrayMethodHasSpeciesSupport$3 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$1 >= 51 || !fails$a(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$3] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$5 = _export;
	var global$9 = global$z;
	var toAbsoluteIndex$2 = toAbsoluteIndex$4;
	var toIntegerOrInfinity$2 = toIntegerOrInfinity$5;
	var lengthOfArrayLike$3 = lengthOfArrayLike$5;
	var toObject$3 = toObject$5;
	var arraySpeciesCreate$1 = arraySpeciesCreate$2;
	var createProperty$3 = createProperty$4;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$2('splice');
	var TypeError$4 = global$9.TypeError;
	var max$3 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	$$5({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject$3(this);
	    var len = lengthOfArrayLike$3(O);
	    var actualStart = toAbsoluteIndex$2(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$3(toIntegerOrInfinity$2(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError$4(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate$1(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty$3(A, k, O[from]);
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

	var uncurryThis$8 = functionUncurryThis;
	var arraySlice$1 = uncurryThis$8([].slice);

	var $$4 = _export;
	var global$8 = global$z;
	var isArray$1 = isArray$3;
	var isConstructor$1 = isConstructor$3;
	var isObject$2 = isObject$a;
	var toAbsoluteIndex$1 = toAbsoluteIndex$4;
	var lengthOfArrayLike$2 = lengthOfArrayLike$5;
	var toIndexedObject$2 = toIndexedObject$6;
	var createProperty$2 = createProperty$4;
	var wellKnownSymbol$5 = wellKnownSymbol$b;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$3;
	var un$Slice = arraySlice$1;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('slice');
	var SPECIES$2 = wellKnownSymbol$5('species');
	var Array$2 = global$8.Array;
	var max$2 = Math.max; // `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects

	$$4({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT
	}, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject$2(this);
	    var length = lengthOfArrayLike$2(O);
	    var k = toAbsoluteIndex$1(start, length);
	    var fin = toAbsoluteIndex$1(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

	    var Constructor, result, n;

	    if (isArray$1(O)) {
	      Constructor = O.constructor; // cross-realm fallback

	      if (isConstructor$1(Constructor) && (Constructor === Array$2 || isArray$1(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject$2(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }

	      if (Constructor === Array$2 || Constructor === undefined) {
	        return un$Slice(O, k, fin);
	      }
	    }

	    result = new (Constructor === undefined ? Array$2 : Constructor)(max$2(fin - k, 0));

	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$2(result, n, O[k]);

	    result.length = n;
	    return result;
	  }
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$2 = classof$6; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$2(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$2 = redefine$5.exports;
	var toString$4 = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$2(Object.prototype, 'toString', toString$4, {
	    unsafe: true
	  });
	}

	var anObject$7 = anObject$b; // `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags

	var regexpFlags$1 = function () {
	  var that = anObject$7(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var uncurryThis$7 = functionUncurryThis;
	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var redefine$1 = redefine$5.exports;
	var anObject$6 = anObject$b;
	var isPrototypeOf = objectIsPrototypeOf;
	var $toString = toString$6;
	var fails$9 = fails$i;
	var regExpFlags = regexpFlags$1;
	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var n$ToString = RegExpPrototype$1[TO_STRING];
	var getFlags = uncurryThis$7(regExpFlags);
	var NOT_GENERIC = fails$9(function () {
	  return n$ToString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	}); // FF44- RegExp#toString has a wrong name

	var INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING; // `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring

	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine$1(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject$6(this);
	    var p = $toString(R.source);
	    var rf = R.flags;
	    var f = $toString(rf === undefined && isPrototypeOf(RegExpPrototype$1, R) && !('flags' in RegExpPrototype$1) ? getFlags(R) : rf);
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
	var extendStatics = function (d, b) {
	  extendStatics = Object.setPrototypeOf || {
	    __proto__: []
	  } instanceof Array && function (d, b) {
	    d.__proto__ = b;
	  } || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	  };

	  return extendStatics(d, b);
	};

	function __extends(d, b) {
	  extendStatics(d, b);

	  function __() {
	    this.constructor = d;
	  }

	  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}
	var __assign = function () {
	  __assign = Object.assign || function __assign(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	      s = arguments[i];

	      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }

	    return t;
	  };

	  return __assign.apply(this, arguments);
	};

	var fails$8 = fails$i;

	var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$8(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $$3 = _export;
	var uncurryThis$6 = functionUncurryThis;
	var IndexedObject = indexedObject;
	var toIndexedObject$1 = toIndexedObject$6;
	var arrayMethodIsStrict = arrayMethodIsStrict$1;
	var un$Join = uncurryThis$6([].join);
	var ES3_STRINGS = IndexedObject != Object;
	var STRICT_METHOD = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join

	$$3({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD
	}, {
	  join: function join(separator) {
	    return un$Join(toIndexedObject$1(this), separator === undefined ? ',' : separator);
	  }
	});

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe

	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var $$2 = _export;
	var toObject$2 = toObject$5;
	var nativeKeys = objectKeys$1;
	var fails$7 = fails$i;
	var FAILS_ON_PRIMITIVES = fails$7(function () {
	  nativeKeys(1);
	}); // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys

	$$2({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return nativeKeys(toObject$2(it));
	  }
	});

	var fails$6 = fails$i;
	var global$7 = global$z; // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError

	var $RegExp$2 = global$7.RegExp;
	var UNSUPPORTED_Y$2 = fails$6(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	}); // UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008

	var MISSED_STICKY = UNSUPPORTED_Y$2 || fails$6(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});
	var BROKEN_CARET = UNSUPPORTED_Y$2 || fails$6(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});
	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$2
	};

	var DESCRIPTORS = descriptors;
	var definePropertyModule = objectDefineProperty;
	var anObject$5 = anObject$b;
	var toIndexedObject = toIndexedObject$6;
	var objectKeys = objectKeys$1; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe

	var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$5(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);

	  return O;
	};

	var getBuiltIn = getBuiltIn$5;
	var html$1 = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$4 = anObject$b;
	var defineProperties = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html = html$1;
	var documentCreateElement = documentCreateElement$1;
	var sharedKey = sharedKey$2;
	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH

	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$4(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var fails$5 = fails$i;
	var global$6 = global$z; // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError

	var $RegExp$1 = global$6.RegExp;
	var regexpUnsupportedDotAll = fails$5(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$4 = fails$i;
	var global$5 = global$z; // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError

	var $RegExp = global$5.RegExp;
	var regexpUnsupportedNcg = fails$4(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' || 'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */

	/* eslint-disable regexp/no-useless-quantifier -- testing */


	var call$4 = functionCall;
	var uncurryThis$5 = functionUncurryThis;
	var toString$3 = toString$6;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;
	var shared = shared$4.exports;
	var create = objectCreate;
	var getInternalState = internalState.get;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$3 = uncurryThis$5(''.charAt);
	var indexOf = uncurryThis$5(''.indexOf);
	var replace$1 = uncurryThis$5(''.replace);
	var stringSlice$4 = uncurryThis$5(''.slice);

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call$4(nativeExec, re1, 'a');
	  call$4(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState(re);
	    var str = toString$3(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call$4(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = call$4(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace$1(flags, 'y', '');

	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$4(str, re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$3(str, re.lastIndex - 1) !== '\n')) {
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
	    match = call$4(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$4(match.input, charsAdded);
	        match[0] = stringSlice$4(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      call$4(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create(null);

	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $$1 = _export;
	var exec$1 = regexpExec$3; // `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec

	$$1({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== exec$1
	}, {
	  exec: exec$1
	});

	var FunctionPrototype = Function.prototype;
	var apply$2 = FunctionPrototype.apply;
	var bind = FunctionPrototype.bind;
	var call$3 = FunctionPrototype.call; // eslint-disable-next-line es/no-reflect -- safe

	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind ? call$3.bind(apply$2) : function () {
	  return call$3.apply(apply$2, arguments);
	});

	var uncurryThis$4 = functionUncurryThis;
	var redefine = redefine$5.exports;
	var regexpExec$2 = regexpExec$3;
	var fails$3 = fails$i;
	var wellKnownSymbol$4 = wellKnownSymbol$b;
	var createNonEnumerableProperty = createNonEnumerableProperty$4;
	var SPECIES$1 = wellKnownSymbol$4('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$4(KEY);
	  var DELEGATES_TO_SYMBOL = !fails$3(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$3(function () {
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

	      re.constructor[SPECIES$1] = function () {
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

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
	    var uncurriedNativeRegExpMethod = uncurryThis$4(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = uncurryThis$4(nativeMethod);
	      var $exec = regexp.exec;

	      if ($exec === regexpExec$2 || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: uncurriedNativeRegExpMethod(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: uncurriedNativeMethod(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    redefine(String.prototype, KEY, methods[0]);
	    redefine(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var isObject$1 = isObject$a;
	var classof$1 = classofRaw$1;
	var wellKnownSymbol$3 = wellKnownSymbol$b;
	var MATCH = wellKnownSymbol$3('match'); // `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$1(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof$1(it) == 'RegExp');
	};

	var global$4 = global$z;
	var isConstructor = isConstructor$3;
	var tryToString = tryToString$2;
	var TypeError$3 = global$4.TypeError; // `Assert: IsConstructor(argument) is true`

	var aConstructor$1 = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$3(tryToString(argument) + ' is not a constructor');
	};

	var anObject$3 = anObject$b;
	var aConstructor = aConstructor$1;
	var wellKnownSymbol$2 = wellKnownSymbol$b;
	var SPECIES = wellKnownSymbol$2('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor

	var speciesConstructor$1 = function (O, defaultConstructor) {
	  var C = anObject$3(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$3(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var uncurryThis$3 = functionUncurryThis;
	var toIntegerOrInfinity$1 = toIntegerOrInfinity$5;
	var toString$2 = toString$6;
	var requireObjectCoercible$2 = requireObjectCoercible$6;
	var charAt$2 = uncurryThis$3(''.charAt);
	var charCodeAt = uncurryThis$3(''.charCodeAt);
	var stringSlice$3 = uncurryThis$3(''.slice);

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$2(requireObjectCoercible$2($this));
	    var position = toIntegerOrInfinity$1(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$2(S, position) : first : CONVERT_TO_STRING ? stringSlice$3(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};

	var charAt$1 = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex

	var advanceStringIndex$2 = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	var global$3 = global$z;
	var toAbsoluteIndex = toAbsoluteIndex$4;
	var lengthOfArrayLike$1 = lengthOfArrayLike$5;
	var createProperty$1 = createProperty$4;
	var Array$1 = global$3.Array;
	var max$1 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike$1(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = Array$1(max$1(fin - k, 0));

	  for (var n = 0; k < fin; k++, n++) createProperty$1(result, n, O[k]);

	  result.length = n;
	  return result;
	};

	var global$2 = global$z;
	var call$2 = functionCall;
	var anObject$2 = anObject$b;
	var isCallable$1 = isCallable$f;
	var classof = classofRaw$1;
	var regexpExec$1 = regexpExec$3;
	var TypeError$2 = global$2.TypeError; // `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (isCallable$1(exec)) {
	    var result = call$2(exec, R, S);
	    if (result !== null) anObject$2(result);
	    return result;
	  }

	  if (classof(R) === 'RegExp') return call$2(regexpExec$1, R, S);
	  throw TypeError$2('RegExp#exec called on incompatible receiver');
	};

	var apply$1 = functionApply;
	var call$1 = functionCall;
	var uncurryThis$2 = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
	var isRegExp = isRegexp;
	var anObject$1 = anObject$b;
	var requireObjectCoercible$1 = requireObjectCoercible$6;
	var speciesConstructor = speciesConstructor$1;
	var advanceStringIndex$1 = advanceStringIndex$2;
	var toLength$1 = toLength$3;
	var toString$1 = toString$6;
	var getMethod$1 = getMethod$3;
	var arraySlice = arraySliceSimple;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var stickyHelpers = regexpStickyHelpers;
	var fails$2 = fails$i;
	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min$1 = Math.min;
	var $push = [].push;
	var exec = uncurryThis$2(/./.exec);
	var push$1 = uncurryThis$2($push);
	var stringSlice$2 = uncurryThis$2(''.slice); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$2(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	}); // @@split logic

	fixRegExpWellKnownSymbolLogic$1('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	  '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString$1(requireObjectCoercible$1(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegExp(separator)) {
	        return call$1(nativeSplit, string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = call$1(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          push$1(output, stringSlice$2(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) apply$1($push, output, arraySlice(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec(separatorCopy, '')) push$1(output, '');
	      } else push$1(output, stringSlice$2(string, lastLastIndex));

	      return output.length > lim ? arraySlice(output, 0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : call$1(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.es/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible$1(this);
	    var splitter = separator == undefined ? undefined : getMethod$1(separator, SPLIT);
	    return splitter ? call$1(splitter, separator, O, limit) : call$1(internalSplit, toString$1(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (string, limit) {
	    var rx = anObject$1(this);
	    var S = toString$1(string);
	    var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (UNSUPPORTED_Y ? 'g' : 'y'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	      var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice$2(S, q) : S);
	      var e;

	      if (z === null || (e = min$1(toLength$1(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
	        q = advanceStringIndex$1(S, q, unicodeMatching);
	      } else {
	        push$1(A, stringSlice$2(S, p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          push$1(A, z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    push$1(A, stringSlice$2(S, p));
	    return A;
	  }];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var $ = _export;
	var global$1 = global$z;
	var fails$1 = fails$i;
	var isArray = isArray$3;
	var isObject = isObject$a;
	var toObject$1 = toObject$5;
	var lengthOfArrayLike = lengthOfArrayLike$5;
	var createProperty = createProperty$4;
	var arraySpeciesCreate = arraySpeciesCreate$2;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$3;
	var wellKnownSymbol$1 = wellKnownSymbol$b;
	var V8_VERSION = engineV8Version;
	var IS_CONCAT_SPREADABLE = wellKnownSymbol$1('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$1 = global$1.TypeError; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$1(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	$({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$1(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var uncurryThis$1 = functionUncurryThis;
	var toObject = toObject$5;
	var floor = Math.floor;
	var charAt = uncurryThis$1(''.charAt);
	var replace = uncurryThis$1(''.replace);
	var stringSlice$1 = uncurryThis$1(''.slice);
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g; // `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution

	var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }

	  return replace(replacement, symbols, function (match, ch) {
	    var capture;

	    switch (charAt(ch, 0)) {
	      case '$':
	        return '$';

	      case '&':
	        return matched;

	      case '`':
	        return stringSlice$1(str, 0, position);

	      case "'":
	        return stringSlice$1(str, tailPos);

	      case '<':
	        capture = namedCaptures[stringSlice$1(ch, 1, -1)];
	        break;

	      default:
	        // \d\d?
	        var n = +ch;
	        if (n === 0) return match;

	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
	          return match;
	        }

	        capture = captures[n - 1];
	    }

	    return capture === undefined ? '' : capture;
	  });
	};

	var apply = functionApply;
	var call = functionCall;
	var uncurryThis = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var fails = fails$i;
	var anObject = anObject$b;
	var isCallable = isCallable$f;
	var toIntegerOrInfinity = toIntegerOrInfinity$5;
	var toLength = toLength$3;
	var toString = toString$6;
	var requireObjectCoercible = requireObjectCoercible$6;
	var advanceStringIndex = advanceStringIndex$2;
	var getMethod = getMethod$3;
	var getSubstitution = getSubstitution$1;
	var regExpExec = regexpExecAbstract;
	var wellKnownSymbol = wellKnownSymbol$b;
	var REPLACE = wellKnownSymbol('replace');
	var max = Math.max;
	var min = Math.min;
	var concat = uncurryThis([].concat);
	var push = uncurryThis([].push);
	var stringIndexOf = uncurryThis(''.indexOf);
	var stringSlice = uncurryThis(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0


	var REPLACE_KEEPS_$0 = function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	}(); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string


	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  }; // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive


	  return ''.replace(re, '$<a>') !== '7';
	}); // @@replace logic

	fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [// `String.prototype.replace` method
	  // https://tc39.es/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
	    return replacer ? call(replacer, searchValue, O, replaceValue) : call(nativeReplace, toString(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	  function (string, replaceValue) {
	    var rx = anObject(this);
	    var S = toString(string);

	    if (typeof replaceValue == 'string' && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, '$<') === -1) {
	      var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	      if (res.done) return res.value;
	    }

	    var functionalReplace = isCallable(replaceValue);
	    if (!functionalReplace) replaceValue = toString(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regExpExec(rx, S);
	      if (result === null) break;
	      push(results, result);
	      if (!global) break;
	      var matchStr = toString(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = toString(result[0]);
	      var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = concat([matched], captures, position, S);
	        if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
	        var replacement = toString(apply(replaceValue, undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + stringSlice(S, nextSourcePosition);
	  }];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

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
	    });
	    google.maps.event.addDomListener(this.div_, "contextmenu", function () {
	      /**
	       * This event is fired when a cluster marker contextmenu is requested.
	       * @name MarkerClusterer#mouseover
	       * @param {Cluster} c The cluster that the contextmenu is requested.
	       * @event
	       */
	      google.maps.event.trigger(mc, "contextmenu", _this.cluster_);
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
	    return "\n<div aria-label=\"".concat(ariaLabel, "\" style=\"").concat(toCssText(divStyle), "\" tabindex=\"0\">\n  <span aria-hidden=\"true\">").concat(this.sums_.text, "</span>\n</div>\n");
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
	        clip: "rect(".concat(Y1, "px, ").concat(X1, "px, ").concat(Y2, "px, ").concat(X2, "px)")
	      };
	    }

	    var overrideDimensionsDynamicIcon = this.sums_.url ? {
	      width: "100%",
	      height: "100%"
	    } : {};
	    var cssText = toCssText(__assign(__assign({
	      position: "absolute",
	      top: coercePixels(spriteV),
	      left: coercePixels(spriteH)
	    }, dimensions), overrideDimensionsDynamicIcon));
	    return "<img alt=\"".concat(this.sums_.text, "\" aria-hidden=\"true\" src=\"").concat(this.style.url, "\" style=\"").concat(cssText, "\"/>");
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
	    this.style = this.sums_.url ? __assign(__assign({}, this.styles_[index]), {
	      url: this.sums_.url
	    }) : this.styles_[index];
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
	      "z-index": "".concat(this.cluster_.getMarkerClusterer().getZIndex()),
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

	    _this.zIndex_ = _this.options.zIndex || Number(google.maps.Marker.MAX_ZINDEX) + 1;
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


	    var mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast());
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

})();
