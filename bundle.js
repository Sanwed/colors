/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/nav.js
var initNav = function initNav() {
  var nav = document.querySelector('.nav');
  var openNavButton = document.querySelector('.header__nav-button');
  var closeNavButton = document.querySelector('.nav__close-button');
  openNavButton.addEventListener('click', function () {
    nav.classList.add('nav--open');
    document.body.classList.add('no-scroll');
  });
  closeNavButton.addEventListener('click', function () {
    nav.classList.remove('nav--open');
    document.body.classList.remove('no-scroll');
  });
};
;// ./src/js/sort.js

var sortMethods = [{
  id: 1,
  name: 'Сначала дорогие'
}, {
  id: 2,
  name: 'Сначала недорогие'
}, {
  id: 3,
  name: 'Сначала популярные'
}, {
  id: 4,
  name: 'Сначала новые'
}];
var sort = document.querySelector('.products__sort');
var sortOpenButton = document.querySelector('.products__open-sort-button');
var overlay = document.querySelector('.overlay');
var sortList = document.querySelector('.products__sort-list');
var sortItems = function sortItems(items, method) {
  switch (method) {
    case 1:
      return items.sort(function (a, b) {
        return b.price - a.price;
      });
    case 2:
      return items.sort(function (a, b) {
        return a.price - b.price;
      });
    case 3:
      return items.sort(function (a, b) {
        return b.sells - a.sells;
      });
    case 4:
      return items.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    default:
      return items;
  }
};
var createSortButton = function createSortButton(method, isActive) {
  var sortButton = document.createElement('button');
  sortButton.classList.add('products__sort-button');
  if (isActive) {
    sortButton.classList.add('products__sort-button--active');
  }
  sortButton.dataset.sortId = method.id;
  sortButton.textContent = method.name;
  sortButton.addEventListener('click', onSortButtonClick);
  return sortButton;
};
var onSortButtonClick = function onSortButtonClick(evt) {
  var btnText = document.querySelector('.products__open-sort-button-text');
  btnText.textContent = evt.target.textContent;
  closeSort();
  refreshItems(Number(evt.target.dataset.sortId));
};
var createSortButtons = function createSortButtons(id) {
  var buttons = sortMethods.map(function (method) {
    return createSortButton(method, method.id === id);
  });
  var activeBtnIndex = buttons.findIndex(function (btn) {
    return btn.classList.contains('products__sort-button--active');
  });
  var activeBtn = buttons.splice(activeBtnIndex, 1)[0];
  buttons.unshift(activeBtn);
  buttons.forEach(function (btn) {
    return sortList.appendChild(btn);
  });
};
var removeSortButtons = function removeSortButtons() {
  while (sortList.firstChild) {
    sortList.removeChild(sortList.firstChild);
  }
};
var openSort = function openSort() {
  var task = sortMethods.find(function (method) {
    return method.name === sortOpenButton.textContent;
  });
  createSortButtons(task.id);
  sort.classList.add('products__sort--open');
  overlay.classList.add('overlay--open');
  document.body.classList.add('no-scroll');
  setTimeout(function () {
    return document.addEventListener('click', closeOnClick);
  }, 0);
};
var closeSort = function closeSort() {
  sort.classList.remove('products__sort--open');
  overlay.classList.remove('overlay--open');
  document.removeEventListener('click', closeOnClick);
  document.body.classList.remove('no-scroll');
  removeSortButtons();
};
var closeOnClick = function closeOnClick(evt) {
  if (evt.target.closest('.overlay')) {
    closeSort();
  }
};
var initSort = function initSort() {
  sortOpenButton.addEventListener('click', openSort);
};
;// ./src/js/cart.js
var cart = document.querySelector('.cart');
var cartList = document.querySelector('.cart__list');
var openCartButton = document.querySelector('.header__user-link--cart');
var closeCartButton = document.querySelector('.cart__close-button');
var cart_overlay = document.querySelector('.overlay');
var cartCount = document.querySelector('.cart__count');
var cartClearButton = document.querySelector('.cart__clear-button');
var commonPrice = document.querySelector('.cart__common-price-value');
var cartItems = [];
var createItem = function createItem(product) {
  var li = document.createElement('li');
  li.dataset.cartId = product.id;
  li.classList.add('cart__item');
  var imageDiv = document.createElement('div');
  imageDiv.classList.add('cart__image');
  var img = document.createElement('img');
  img.src = product.image;
  img.width = 96;
  img.height = 96;
  imageDiv.appendChild(img);
  var descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cart__description');
  var title = document.createElement('h3');
  title.classList.add('cart__title');
  title.textContent = product.title;
  var price = document.createElement('p');
  price.classList.add('cart__price');
  price.textContent = "".concat(product.price, " \u20BD");
  descriptionDiv.appendChild(title);
  descriptionDiv.appendChild(price);
  var addProductWrapper = document.createElement('div');
  addProductWrapper.classList.add('cart__add-product-wrapper');
  var removeButton = document.createElement('button');
  removeButton.classList.add('cart__product-button', 'cart__product-button--remove');
  removeButton.setAttribute('aria-label', 'Добавить 1 товар');
  removeButton.addEventListener('click', decreaseCount);
  var productCount = document.createElement('span');
  productCount.classList.add('cart__product-count');
  productCount.textContent = product.count;
  var addButton = document.createElement('button');
  addButton.classList.add('cart__product-button', 'cart__product-button--add');
  addButton.setAttribute('aria-label', 'Убрать 1 товар');
  addButton.addEventListener('click', increaseCount);
  addProductWrapper.appendChild(removeButton);
  addProductWrapper.appendChild(productCount);
  addProductWrapper.appendChild(addButton);
  var deleteButton = document.createElement('button');
  deleteButton.classList.add('cart__delete-button');
  deleteButton.setAttribute('aria-label', 'Удалить товар из корзины');
  deleteButton.addEventListener('click', removeItem);
  li.appendChild(imageDiv);
  li.appendChild(descriptionDiv);
  li.appendChild(addProductWrapper);
  li.appendChild(deleteButton);
  cartList.appendChild(li);
};
var updatePrice = function updatePrice() {
  var price = cartItems.reduce(function (acc, product) {
    return acc + product.price * product.count;
  }, 0);
  commonPrice.textContent = "".concat(price, " \u20BD");
};
var removeItem = function removeItem(evt) {
  var cartItem = evt.target.closest('.cart__item');
  var id = cartItem.dataset.cartId;
  var existingItem = cartItems.find(function (product) {
    return product.id === id;
  });
  var index = cartItems.indexOf(existingItem);
  cartItems.splice(index, 1);
  renderCart();
};
var removeAll = function removeAll() {
  cartItems.length = 0;
  renderCart();
};
var updateCartCount = function updateCartCount() {
  var count = cartItems.reduce(function (acc, product) {
    return acc + product.count;
  }, 0);
  cartCount.textContent = "".concat(count, " \u0442\u043E\u0432\u0430\u0440\u043E\u0432");
  openCartButton.textContent = count;
};
var renderCart = function renderCart() {
  cartList.innerHTML = '';
  if (cartItems.length === 0) {
    var span = document.createElement('span');
    span.textContent = 'Корзина пуста';
    cartList.appendChild(span);
  }
  cartItems.forEach(function (product) {
    createItem(product);
  });
  updateCartCount();
  updatePrice();
};
function decreaseCount(evt) {
  var cartItem = evt.target.closest('.cart__item');
  var id = cartItem.dataset.cartId;
  var existingItem = cartItems.find(function (product) {
    return product.id === id;
  });
  if (existingItem.count > 1) {
    existingItem.count--;
    renderCart();
  }
}
function increaseCount(evt) {
  var cartItem = evt.target.closest('.cart__item');
  var id = cartItem.dataset.cartId;
  var existingItem = cartItems.find(function (product) {
    return product.id === id;
  });
  existingItem.count++;
  renderCart();
}
var updateCart = function updateCart(evt) {
  var item = evt.target.closest('.products__item');
  var id = item.dataset.productId;
  var title = item.querySelector('.products__title').textContent;
  var price = item.querySelector('.products__price').textContent.split(' ')[0];
  var image = item.querySelector('.products__image img').src;
  var existingItem = cartItems.find(function (product) {
    return product.id === id;
  });
  updatePrice();
  if (existingItem) {
    existingItem.count++;
    updateCartCount();
    return;
  }
  cartItems.unshift({
    id: id,
    title: title,
    price: price,
    image: image,
    count: 1
  });
  updateCartCount();
};
var initCart = function initCart() {
  var openCart = function openCart() {
    cart.classList.add('cart--open');
    document.body.classList.add('no-scroll');
    cart_overlay.classList.add('overlay--open');
    renderCart();
  };
  var closeCart = function closeCart() {
    cart.classList.remove('cart--open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('click', closeOnClick);
    cart_overlay.classList.remove('overlay--open');
  };
  var closeOnClick = function closeOnClick(evt) {
    if (evt.target.closest('.overlay')) {
      closeCart();
    }
  };
  openCartButton.addEventListener('click', function () {
    openCart();
    setTimeout(function () {
      document.addEventListener('click', closeOnClick);
    }, 0);
  });
  closeCartButton.addEventListener('click', closeCart);
  cartClearButton.addEventListener('click', removeAll);
  updateCartCount();
};
;// ./src/js/products.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }



var FETCH_URL = 'https://6730890766e42ceaf16092ab.mockapi.io';
var productsList = document.querySelector('.products__list');
var productsCount = document.querySelector('.products__count');
var currentSortingMethod = 1;
var setMethod = function setMethod(newMethod) {
  currentSortingMethod = newMethod;
};
var applyLastRowStyles = function applyLastRowStyles() {
  var productsItems = productsList.querySelectorAll('.products__item');
  var columns = getComputedStyle(productsList).gridTemplateColumns.split(' ').length;
  var totalItems = productsItems.length;
  var lastRowStartIndex = totalItems - (totalItems % columns || columns);
  productsItems.forEach(function (item, index) {
    if (index >= lastRowStartIndex) {
      item.classList.add('products__item--last');
    }
  });
};
var createProduct = function createProduct(product) {
  var productItem = document.createElement('li');
  productItem.dataset.productId = product.id;
  productItem.classList.add('products__item');
  productsList.appendChild(productItem);
  var productImage = document.createElement('div');
  productImage.classList.add('products__image');
  productItem.appendChild(productImage);
  var image = new Image();
  image.src = product.preview;
  image.alt = product.title;
  image.loading = 'lazy';
  productImage.appendChild(image);
  var title = document.createElement('h2');
  title.classList.add('products__title');
  title.textContent = product.title;
  productItem.appendChild(title);
  var priceWrapper = document.createElement('div');
  priceWrapper.classList.add('products__price-wrapper');
  productItem.appendChild(priceWrapper);
  var price = document.createElement('span');
  price.classList.add('products__price');
  price.textContent = "".concat(Math.round(product.price), " \u20BD");
  priceWrapper.appendChild(price);
  var button = document.createElement('button');
  button.classList.add('products__buy-button');
  button.setAttribute('aria-label', 'Добавить в корзину');
  button.addEventListener('click', updateCart);
  priceWrapper.appendChild(button);
};
var fetchProducts = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var method,
      response,
      products,
      filteredProducts,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          method = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;
          _context.next = 3;
          return fetch("".concat(FETCH_URL, "/products"));
        case 3:
          response = _context.sent;
          _context.next = 6;
          return response.json();
        case 6:
          products = _context.sent;
          sortItems(products, method);
          filteredProducts = filterItems(products);
          filteredProducts.forEach(function (product) {
            createProduct(product);
          });
          productsCount.textContent = "".concat(filteredProducts.length, " \u0442\u043E\u0432\u0430\u0440\u043E\u0432");
          applyLastRowStyles();
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchProducts() {
    return _ref.apply(this, arguments);
  };
}();
var refreshItems = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(method) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          productsList.innerHTML = '';
          setMethod(method);
          _context2.next = 4;
          return fetchProducts(currentSortingMethod);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function refreshItems(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var initProducts = function initProducts() {
  applyLastRowStyles();
  fetchProducts().then(function () {
    console.log('Products loaded');
  });
};
;// ./src/js/filter.js

var filterOpenButton = document.querySelector('.products__filter-button');
var filter = document.querySelector('.products__filter');
var filter_overlay = document.querySelector('.overlay');
var moveZone = document.querySelector('.products__move-zone');
var filterItems = function filterItems(products) {
  var activeCheckboxes = document.querySelectorAll('.products__filter-checkbox:checked');
  if (activeCheckboxes.length === 0) {
    return products;
  }
  return products.filter(function (product) {
    return Array.from(activeCheckboxes).every(function (checkbox) {
      return product[checkbox.name];
    });
  });
};
var onCheckboxChange = function onCheckboxChange() {
  refreshItems(currentSortingMethod);
};
var onResize = function onResize() {
  var checkboxes = document.querySelectorAll('.products__filter-checkbox');
  if (window.matchMedia('(min-width: 1200px)').matches) {
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', onCheckboxChange);
    });
  } else {
    checkboxes.forEach(function (checkbox) {
      checkbox.removeEventListener('change', onCheckboxChange);
    });
  }
};
var initFilter = function initFilter() {
  var startY;
  var currentY;
  var initialBottom;
  var openFilter = function openFilter() {
    filter.classList.add('products__filter--open');
    document.body.classList.add('no-scroll');
    filter_overlay.classList.add('overlay--open');
    initialBottom = 0;
  };
  var closeFilter = function closeFilter() {
    filter.classList.remove('products__filter--open');
    filter_overlay.classList.remove('overlay--open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('click', closeOnClick);
    refreshItems(currentSortingMethod);
  };
  var closeOnClick = function closeOnClick(evt) {
    if (evt.target.closest('.overlay')) {
      closeFilter();
    }
  };
  filterOpenButton.addEventListener('click', function () {
    openFilter();
    setTimeout(function () {
      document.addEventListener('click', closeOnClick);
    }, 0);
  });
  moveZone.addEventListener('touchstart', function (evt) {
    startY = evt.touches[0].clientY;
    initialBottom = parseInt(window.getComputedStyle(filter).bottom, 10);
  });
  moveZone.addEventListener('touchmove', function (evt) {
    currentY = evt.touches[0].clientY;
    var deltaY = currentY - startY;
    if (deltaY < 0) {
      return;
    }
    filter.style.bottom = "".concat(initialBottom - deltaY, "px");
  });
  moveZone.addEventListener('touchend', function () {
    var deltaY = currentY - startY;
    if (deltaY > 50) {
      closeFilter();
      filter.style = '';
    } else {
      filter.style.bottom = '0';
    }
  });
  onResize();
  window.addEventListener('resize', onResize);
};
;// ./src/js/slider.js
var slides = [{
  title: 'Краски',
  description: 'Идеально подходят для стен и других поверхностей. Найди свой идеальный цвет!'
}, {
  title: 'Слайд 2',
  description: 'Описание для второго слайда.'
}, {
  title: 'Слайд 3',
  description: 'Описание для третьего слайда.'
}];
var currentSlide = 0;
var createSlide = function createSlide(slide) {
  var slideElement = document.createElement('div');
  slideElement.classList.add('slider__slide');
  slideElement.innerHTML = "\n    <h2 class=\"slider__title\">".concat(slide.title, "</h2>\n    <p class=\"slider__description\">").concat(slide.description, "</p>\n  ");
  return slideElement;
};
var createNavButton = function createNavButton(index) {
  var navButton = document.createElement('button');
  navButton.classList.add('slider__nav-button');
  if (index === 0) {
    navButton.classList.add('slider__nav-button--active');
  }
  navButton.setAttribute('aria-label', "\u0421\u043B\u0430\u0439\u0434 ".concat(index + 1));
  navButton.addEventListener('click', function () {
    return goToSlide(index);
  });
  return navButton;
};
var renderSlides = function renderSlides() {
  var sliderInner = document.querySelector('.slider__inner');
  sliderInner.innerHTML = '';
  sliderInner.appendChild(createSlide(slides[currentSlide]));
};
var renderNavButtons = function renderNavButtons() {
  var navList = document.querySelector('.slider__nav-list');
  navList.innerHTML = '';
  slides.forEach(function (_, index) {
    navList.appendChild(createNavButton(index));
  });
};
var updateNavButtons = function updateNavButtons() {
  var navButtons = document.querySelectorAll('.slider__nav-button');
  navButtons.forEach(function (button, index) {
    button.classList.toggle('slider__nav-button--active', index === currentSlide);
  });
};
var goToSlide = function goToSlide(index) {
  currentSlide = index;
  renderSlides();
  updateNavButtons();
};
var nextSlide = function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlides();
  updateNavButtons();
};
var prevSlide = function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  renderSlides();
  updateNavButtons();
};
var initSlider = function initSlider() {
  renderSlides();
  renderNavButtons();
  document.querySelector('.slider__control--next').addEventListener('click', nextSlide);
  document.querySelector('.slider__control--prev').addEventListener('click', prevSlide);
};
;// ./src/main.js







document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initSlider();
  initProducts();
  initFilter();
  initSort();
  initCart();
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0VBQ2xCNVMsUUFBUSxDQUFDQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQ0csZ0JBQWdCLENBQUMsT0FBTyxFQUFFOFMsU0FBUyxDQUFDO0VBQ3JGbFQsUUFBUSxDQUFDQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQ0csZ0JBQWdCLENBQUMsT0FBTyxFQUFFK1MsU0FBUyxDQUFDO0FBQ3ZGLENBQUM7O0FDbEZ5QjtBQUNPO0FBQ007QUFDSjtBQUNRO0FBQ1I7QUFDSTtBQUV2Q25ULFFBQVEsQ0FBQ0ksZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtFQUNsRE4sT0FBTyxDQUFDLENBQUM7RUFDVHNULFVBQVUsQ0FBQyxDQUFDO0VBQ1poRCxZQUFZLENBQUMsQ0FBQztFQUNkaUIsVUFBVSxDQUFDLENBQUM7RUFDWnhOLFFBQVEsQ0FBQyxDQUFDO0VBQ1ZpRCxRQUFRLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXBjLWh1bnRlcnMvLi9zcmMvanMvbmF2LmpzIiwid2VicGFjazovL2VwYy1odW50ZXJzLy4vc3JjL2pzL3NvcnQuanMiLCJ3ZWJwYWNrOi8vZXBjLWh1bnRlcnMvLi9zcmMvanMvY2FydC5qcyIsIndlYnBhY2s6Ly9lcGMtaHVudGVycy8uL3NyYy9qcy9wcm9kdWN0cy5qcyIsIndlYnBhY2s6Ly9lcGMtaHVudGVycy8uL3NyYy9qcy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vZXBjLWh1bnRlcnMvLi9zcmMvanMvc2xpZGVyLmpzIiwid2VicGFjazovL2VwYy1odW50ZXJzLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGluaXROYXYgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdicpO1xyXG4gIGNvbnN0IG9wZW5OYXZCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtYnV0dG9uJyk7XHJcbiAgY29uc3QgY2xvc2VOYXZCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2X19jbG9zZS1idXR0b24nKTtcclxuICBcclxuICBvcGVuTmF2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgbmF2LmNsYXNzTGlzdC5hZGQoJ25hdi0tb3BlbicpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcclxuICB9KTtcclxuICBcclxuICBjbG9zZU5hdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXYtLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7cmVmcmVzaEl0ZW1zfSBmcm9tICcuL3Byb2R1Y3RzJztcclxuXHJcbmNvbnN0IHNvcnRNZXRob2RzID0gW1xyXG4gIHtpZDogMSwgbmFtZTogJ9Ch0L3QsNGH0LDQu9CwINC00L7RgNC+0LPQuNC1J30sXHJcbiAge2lkOiAyLCBuYW1lOiAn0KHQvdCw0YfQsNC70LAg0L3QtdC00L7RgNC+0LPQuNC1J30sXHJcbiAge2lkOiAzLCBuYW1lOiAn0KHQvdCw0YfQsNC70LAg0L/QvtC/0YPQu9GP0YDQvdGL0LUnfSxcclxuICB7aWQ6IDQsIG5hbWU6ICfQodC90LDRh9Cw0LvQsCDQvdC+0LLRi9C1J30sXHJcbl07XHJcblxyXG5jb25zdCBzb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19zb3J0Jyk7XHJcbmNvbnN0IHNvcnRPcGVuQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19vcGVuLXNvcnQtYnV0dG9uJyk7XHJcbmNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpO1xyXG5jb25zdCBzb3J0TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0c19fc29ydC1saXN0Jyk7XHJcblxyXG5leHBvcnQgY29uc3Qgc29ydEl0ZW1zID0gKGl0ZW1zLCBtZXRob2QpID0+IHtcclxuICBzd2l0Y2ggKG1ldGhvZCkge1xyXG4gICAgY2FzZSAxOlxyXG4gICAgICByZXR1cm4gaXRlbXMuc29ydCgoYSwgYikgPT4gYi5wcmljZSAtIGEucHJpY2UpO1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICByZXR1cm4gaXRlbXMuc29ydCgoYSwgYikgPT4gYS5wcmljZSAtIGIucHJpY2UpO1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICByZXR1cm4gaXRlbXMuc29ydCgoYSwgYikgPT4gYi5zZWxscyAtIGEuc2VsbHMpO1xyXG4gICAgY2FzZSA0OlxyXG4gICAgICByZXR1cm4gaXRlbXMuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYi5kYXRlKSAtIG5ldyBEYXRlKGEuZGF0ZSkpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY3JlYXRlU29ydEJ1dHRvbiA9IChtZXRob2QsIGlzQWN0aXZlKSA9PiB7XHJcbiAgY29uc3Qgc29ydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIHNvcnRCdXR0b24uY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX3NvcnQtYnV0dG9uJyk7XHJcbiAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICBzb3J0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19zb3J0LWJ1dHRvbi0tYWN0aXZlJyk7XHJcbiAgfVxyXG4gIHNvcnRCdXR0b24uZGF0YXNldC5zb3J0SWQgPSBtZXRob2QuaWQ7XHJcbiAgc29ydEJ1dHRvbi50ZXh0Q29udGVudCA9IG1ldGhvZC5uYW1lO1xyXG4gIHNvcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNvcnRCdXR0b25DbGljayk7XHJcbiAgcmV0dXJuIHNvcnRCdXR0b247XHJcbn07XHJcblxyXG5jb25zdCBvblNvcnRCdXR0b25DbGljayA9IChldnQpID0+IHtcclxuICBjb25zdCBidG5UZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19vcGVuLXNvcnQtYnV0dG9uLXRleHQnKTtcclxuICBidG5UZXh0LnRleHRDb250ZW50ID0gZXZ0LnRhcmdldC50ZXh0Q29udGVudDtcclxuICBjbG9zZVNvcnQoKTtcclxuICByZWZyZXNoSXRlbXMoTnVtYmVyKGV2dC50YXJnZXQuZGF0YXNldC5zb3J0SWQpKTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVNvcnRCdXR0b25zID0gKGlkKSA9PiB7XHJcbiAgY29uc3QgYnV0dG9ucyA9IHNvcnRNZXRob2RzLm1hcCgobWV0aG9kKSA9PiBjcmVhdGVTb3J0QnV0dG9uKG1ldGhvZCwgbWV0aG9kLmlkID09PSBpZCkpO1xyXG4gIGNvbnN0IGFjdGl2ZUJ0bkluZGV4ID0gYnV0dG9ucy5maW5kSW5kZXgoKGJ0bikgPT4gYnRuLmNsYXNzTGlzdC5jb250YWlucygncHJvZHVjdHNfX3NvcnQtYnV0dG9uLS1hY3RpdmUnKSk7XHJcbiAgY29uc3QgYWN0aXZlQnRuID0gYnV0dG9ucy5zcGxpY2UoYWN0aXZlQnRuSW5kZXgsIDEpWzBdO1xyXG4gIGJ1dHRvbnMudW5zaGlmdChhY3RpdmVCdG4pO1xyXG4gIGJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiBzb3J0TGlzdC5hcHBlbmRDaGlsZChidG4pKTtcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZVNvcnRCdXR0b25zID0gKCkgPT4ge1xyXG4gIHdoaWxlIChzb3J0TGlzdC5maXJzdENoaWxkKSB7XHJcbiAgICBzb3J0TGlzdC5yZW1vdmVDaGlsZChzb3J0TGlzdC5maXJzdENoaWxkKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBvcGVuU29ydCA9ICgpID0+IHtcclxuICBjb25zdCB0YXNrID0gc29ydE1ldGhvZHMuZmluZCgobWV0aG9kKSA9PiBtZXRob2QubmFtZSA9PT0gc29ydE9wZW5CdXR0b24udGV4dENvbnRlbnQpO1xyXG4gIGNyZWF0ZVNvcnRCdXR0b25zKHRhc2suaWQpO1xyXG4gIHNvcnQuY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX3NvcnQtLW9wZW4nKTtcclxuICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktLW9wZW4nKTtcclxuICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spLCAwKTtcclxufTtcclxuXHJcbmNvbnN0IGNsb3NlU29ydCA9ICgpID0+IHtcclxuICBzb3J0LmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2R1Y3RzX19zb3J0LS1vcGVuJyk7XHJcbiAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVybGF5LS1vcGVuJyk7XHJcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spO1xyXG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XHJcbiAgcmVtb3ZlU29ydEJ1dHRvbnMoKTtcclxuICBcclxufTtcclxuXHJcbmNvbnN0IGNsb3NlT25DbGljayA9IChldnQpID0+IHtcclxuICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcub3ZlcmxheScpKSB7XHJcbiAgICBjbG9zZVNvcnQoKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFNvcnQgPSAoKSA9PiB7XHJcbiAgc29ydE9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuU29ydCk7XHJcbn07XHJcbiIsImNvbnN0IGNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydCcpO1xyXG5jb25zdCBjYXJ0TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19saXN0Jyk7XHJcbmNvbnN0IG9wZW5DYXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fdXNlci1saW5rLS1jYXJ0Jyk7XHJcbmNvbnN0IGNsb3NlQ2FydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19jbG9zZS1idXR0b24nKTtcclxuY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jyk7XHJcbmNvbnN0IGNhcnRDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19jb3VudCcpO1xyXG5jb25zdCBjYXJ0Q2xlYXJCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fY2xlYXItYnV0dG9uJyk7XHJcbmNvbnN0IGNvbW1vblByaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2NvbW1vbi1wcmljZS12YWx1ZScpO1xyXG5cclxuY29uc3QgY2FydEl0ZW1zID0gW107XHJcblxyXG5jb25zdCBjcmVhdGVJdGVtID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgbGkuZGF0YXNldC5jYXJ0SWQgPSBwcm9kdWN0LmlkO1xyXG4gIGxpLmNsYXNzTGlzdC5hZGQoJ2NhcnRfX2l0ZW0nKTtcclxuICBcclxuICBjb25zdCBpbWFnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGltYWdlRGl2LmNsYXNzTGlzdC5hZGQoJ2NhcnRfX2ltYWdlJyk7XHJcbiAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgaW1nLnNyYyA9IHByb2R1Y3QuaW1hZ2U7XHJcbiAgaW1nLndpZHRoID0gOTY7XHJcbiAgaW1nLmhlaWdodCA9IDk2O1xyXG4gIGltYWdlRGl2LmFwcGVuZENoaWxkKGltZyk7XHJcbiAgXHJcbiAgY29uc3QgZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBkZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdjYXJ0X19kZXNjcmlwdGlvbicpO1xyXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcclxuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjYXJ0X190aXRsZScpO1xyXG4gIHRpdGxlLnRleHRDb250ZW50ID0gcHJvZHVjdC50aXRsZTtcclxuICBjb25zdCBwcmljZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICBwcmljZS5jbGFzc0xpc3QuYWRkKCdjYXJ0X19wcmljZScpO1xyXG4gIHByaWNlLnRleHRDb250ZW50ID0gYCR7cHJvZHVjdC5wcmljZX0g4oK9YDtcclxuICBkZXNjcmlwdGlvbkRpdi5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcbiAgZGVzY3JpcHRpb25EaXYuYXBwZW5kQ2hpbGQocHJpY2UpO1xyXG4gIFxyXG4gIGNvbnN0IGFkZFByb2R1Y3RXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgYWRkUHJvZHVjdFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnY2FydF9fYWRkLXByb2R1Y3Qtd3JhcHBlcicpO1xyXG4gIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjYXJ0X19wcm9kdWN0LWJ1dHRvbicsICdjYXJ0X19wcm9kdWN0LWJ1dHRvbi0tcmVtb3ZlJyk7XHJcbiAgcmVtb3ZlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQlNC+0LHQsNCy0LjRgtGMIDEg0YLQvtCy0LDRgCcpO1xyXG4gIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlY3JlYXNlQ291bnQpO1xyXG4gIGNvbnN0IHByb2R1Y3RDb3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICBwcm9kdWN0Q291bnQuY2xhc3NMaXN0LmFkZCgnY2FydF9fcHJvZHVjdC1jb3VudCcpO1xyXG4gIHByb2R1Y3RDb3VudC50ZXh0Q29udGVudCA9IHByb2R1Y3QuY291bnQ7XHJcbiAgY29uc3QgYWRkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgYWRkQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2NhcnRfX3Byb2R1Y3QtYnV0dG9uJywgJ2NhcnRfX3Byb2R1Y3QtYnV0dG9uLS1hZGQnKTtcclxuICBhZGRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9Cj0LHRgNCw0YLRjCAxINGC0L7QstCw0YAnKTtcclxuICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpbmNyZWFzZUNvdW50KTtcclxuICBhZGRQcm9kdWN0V3JhcHBlci5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xyXG4gIGFkZFByb2R1Y3RXcmFwcGVyLmFwcGVuZENoaWxkKHByb2R1Y3RDb3VudCk7XHJcbiAgYWRkUHJvZHVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQoYWRkQnV0dG9uKTtcclxuICBcclxuICBjb25zdCBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBkZWxldGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY2FydF9fZGVsZXRlLWJ1dHRvbicpO1xyXG4gIGRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0KPQtNCw0LvQuNGC0Ywg0YLQvtCy0LDRgCDQuNC3INC60L7RgNC30LjQvdGLJyk7XHJcbiAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSXRlbSk7XHJcbiAgXHJcbiAgbGkuYXBwZW5kQ2hpbGQoaW1hZ2VEaXYpO1xyXG4gIGxpLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRGl2KTtcclxuICBsaS5hcHBlbmRDaGlsZChhZGRQcm9kdWN0V3JhcHBlcik7XHJcbiAgbGkuYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcclxuICBcclxuICBjYXJ0TGlzdC5hcHBlbmRDaGlsZChsaSk7XHJcbn07XHJcblxyXG5jb25zdCB1cGRhdGVQcmljZSA9ICgpID0+IHtcclxuICBjb25zdCBwcmljZSA9IGNhcnRJdGVtcy5yZWR1Y2UoKGFjYywgcHJvZHVjdCkgPT4gYWNjICsgcHJvZHVjdC5wcmljZSAqIHByb2R1Y3QuY291bnQsIDApO1xyXG4gIGNvbW1vblByaWNlLnRleHRDb250ZW50ID0gYCR7cHJpY2V9IOKCvWA7XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVJdGVtID0gKGV2dCkgPT4ge1xyXG4gIGNvbnN0IGNhcnRJdGVtID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2FydF9faXRlbScpO1xyXG4gIGNvbnN0IGlkID0gY2FydEl0ZW0uZGF0YXNldC5jYXJ0SWQ7XHJcbiAgY29uc3QgZXhpc3RpbmdJdGVtID0gY2FydEl0ZW1zLmZpbmQoKHByb2R1Y3QpID0+IHByb2R1Y3QuaWQgPT09IGlkKTtcclxuICBjb25zdCBpbmRleCA9IGNhcnRJdGVtcy5pbmRleE9mKGV4aXN0aW5nSXRlbSk7XHJcbiAgY2FydEl0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgcmVuZGVyQ2FydCgpO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQWxsID0gKCkgPT4ge1xyXG4gIGNhcnRJdGVtcy5sZW5ndGggPSAwO1xyXG4gIHJlbmRlckNhcnQoKTtcclxufTtcclxuXHJcbmNvbnN0IHVwZGF0ZUNhcnRDb3VudCA9ICgpID0+IHtcclxuICBsZXQgY291bnQgPSBjYXJ0SXRlbXMucmVkdWNlKChhY2MsIHByb2R1Y3QpID0+IGFjYyArIHByb2R1Y3QuY291bnQsIDApO1xyXG4gIGNhcnRDb3VudC50ZXh0Q29udGVudCA9IGAke2NvdW50fSDRgtC+0LLQsNGA0L7QsmA7XHJcbiAgb3BlbkNhcnRCdXR0b24udGV4dENvbnRlbnQgPSBjb3VudDtcclxufTtcclxuXHJcbmNvbnN0IHJlbmRlckNhcnQgPSAoKSA9PiB7XHJcbiAgY2FydExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgXHJcbiAgaWYgKGNhcnRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBzcGFuLnRleHRDb250ZW50ID0gJ9Ca0L7RgNC30LjQvdCwINC/0YPRgdGC0LAnO1xyXG4gICAgY2FydExpc3QuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgfVxyXG4gIFxyXG4gIGNhcnRJdGVtcy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XHJcbiAgICBjcmVhdGVJdGVtKHByb2R1Y3QpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIHVwZGF0ZUNhcnRDb3VudCgpO1xyXG4gIHVwZGF0ZVByaWNlKCk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBkZWNyZWFzZUNvdW50KGV2dCkge1xyXG4gIGNvbnN0IGNhcnRJdGVtID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2FydF9faXRlbScpO1xyXG4gIGNvbnN0IGlkID0gY2FydEl0ZW0uZGF0YXNldC5jYXJ0SWQ7XHJcbiAgY29uc3QgZXhpc3RpbmdJdGVtID0gY2FydEl0ZW1zLmZpbmQoKHByb2R1Y3QpID0+IHByb2R1Y3QuaWQgPT09IGlkKTtcclxuICBpZiAoZXhpc3RpbmdJdGVtLmNvdW50ID4gMSkge1xyXG4gICAgZXhpc3RpbmdJdGVtLmNvdW50LS07XHJcbiAgICByZW5kZXJDYXJ0KCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmNyZWFzZUNvdW50KGV2dCkge1xyXG4gIGNvbnN0IGNhcnRJdGVtID0gZXZ0LnRhcmdldC5jbG9zZXN0KCcuY2FydF9faXRlbScpO1xyXG4gIGNvbnN0IGlkID0gY2FydEl0ZW0uZGF0YXNldC5jYXJ0SWQ7XHJcbiAgY29uc3QgZXhpc3RpbmdJdGVtID0gY2FydEl0ZW1zLmZpbmQoKHByb2R1Y3QpID0+IHByb2R1Y3QuaWQgPT09IGlkKTtcclxuICBleGlzdGluZ0l0ZW0uY291bnQrKztcclxuICByZW5kZXJDYXJ0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVDYXJ0ID0gKGV2dCkgPT4ge1xyXG4gIGNvbnN0IGl0ZW0gPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5wcm9kdWN0c19faXRlbScpO1xyXG4gIGNvbnN0IGlkID0gaXRlbS5kYXRhc2V0LnByb2R1Y3RJZDtcclxuICBjb25zdCB0aXRsZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX190aXRsZScpLnRleHRDb250ZW50O1xyXG4gIGNvbnN0IHByaWNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX3ByaWNlJykudGV4dENvbnRlbnQuc3BsaXQoJyAnKVswXTtcclxuICBjb25zdCBpbWFnZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19pbWFnZSBpbWcnKS5zcmM7XHJcbiAgXHJcbiAgY29uc3QgZXhpc3RpbmdJdGVtID0gY2FydEl0ZW1zLmZpbmQoKHByb2R1Y3QpID0+IHByb2R1Y3QuaWQgPT09IGlkKTtcclxuICBcclxuICB1cGRhdGVQcmljZSgpO1xyXG4gIFxyXG4gIGlmIChleGlzdGluZ0l0ZW0pIHtcclxuICAgIGV4aXN0aW5nSXRlbS5jb3VudCsrO1xyXG4gICAgdXBkYXRlQ2FydENvdW50KCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGNhcnRJdGVtcy51bnNoaWZ0KHtcclxuICAgIGlkLFxyXG4gICAgdGl0bGUsXHJcbiAgICBwcmljZSxcclxuICAgIGltYWdlLFxyXG4gICAgY291bnQ6IDEsXHJcbiAgfSk7XHJcbiAgdXBkYXRlQ2FydENvdW50KCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdENhcnQgPSAoKSA9PiB7XHJcbiAgY29uc3Qgb3BlbkNhcnQgPSAoKSA9PiB7XHJcbiAgICBjYXJ0LmNsYXNzTGlzdC5hZGQoJ2NhcnQtLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktLW9wZW4nKTtcclxuICAgIFxyXG4gICAgcmVuZGVyQ2FydCgpO1xyXG4gIH07XHJcbiAgXHJcbiAgY29uc3QgY2xvc2VDYXJ0ID0gKCkgPT4ge1xyXG4gICAgY2FydC5jbGFzc0xpc3QucmVtb3ZlKCdjYXJ0LS1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spO1xyXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVybGF5LS1vcGVuJyk7XHJcbiAgfTtcclxuICBcclxuICBjb25zdCBjbG9zZU9uQ2xpY2sgPSAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcub3ZlcmxheScpKSB7XHJcbiAgICAgIGNsb3NlQ2FydCgpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgb3BlbkNhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBvcGVuQ2FydCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPbkNsaWNrKTtcclxuICAgIH0sIDApO1xyXG4gIH0pO1xyXG4gIGNsb3NlQ2FydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQ2FydCk7XHJcbiAgY2FydENsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlQWxsKTtcclxuICBcclxuICB1cGRhdGVDYXJ0Q291bnQoKTtcclxufTtcclxuIiwiaW1wb3J0IHtzb3J0SXRlbXN9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7ZmlsdGVySXRlbXN9IGZyb20gJy4vZmlsdGVyJztcclxuaW1wb3J0IHt1cGRhdGVDYXJ0fSBmcm9tICcuL2NhcnQnO1xyXG5cclxuY29uc3QgRkVUQ0hfVVJMID0gJ2h0dHBzOi8vNjczMDg5MDc2NmU0MmNlYWYxNjA5MmFiLm1vY2thcGkuaW8nO1xyXG5cclxuY29uc3QgcHJvZHVjdHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19saXN0Jyk7XHJcbmNvbnN0IHByb2R1Y3RzQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX2NvdW50Jyk7XHJcblxyXG5leHBvcnQgbGV0IGN1cnJlbnRTb3J0aW5nTWV0aG9kID0gMTtcclxuY29uc3Qgc2V0TWV0aG9kID0gKG5ld01ldGhvZCkgPT4ge1xyXG4gIGN1cnJlbnRTb3J0aW5nTWV0aG9kID0gbmV3TWV0aG9kO1xyXG59O1xyXG5cclxuY29uc3QgYXBwbHlMYXN0Um93U3R5bGVzID0gKCkgPT4ge1xyXG4gIGNvbnN0IHByb2R1Y3RzSXRlbXMgPSBwcm9kdWN0c0xpc3QucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3RzX19pdGVtJyk7XHJcbiAgY29uc3QgY29sdW1ucyA9IGdldENvbXB1dGVkU3R5bGUocHJvZHVjdHNMaXN0KS5ncmlkVGVtcGxhdGVDb2x1bW5zLnNwbGl0KCcgJykubGVuZ3RoO1xyXG4gIGNvbnN0IHRvdGFsSXRlbXMgPSBwcm9kdWN0c0l0ZW1zLmxlbmd0aDtcclxuICBjb25zdCBsYXN0Um93U3RhcnRJbmRleCA9IHRvdGFsSXRlbXMgLSAodG90YWxJdGVtcyAlIGNvbHVtbnMgfHwgY29sdW1ucyk7XHJcbiAgXHJcbiAgcHJvZHVjdHNJdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgaWYgKGluZGV4ID49IGxhc3RSb3dTdGFydEluZGV4KSB7XHJcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX2l0ZW0tLWxhc3QnKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVByb2R1Y3QgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IHByb2R1Y3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICBwcm9kdWN0SXRlbS5kYXRhc2V0LnByb2R1Y3RJZCA9IHByb2R1Y3QuaWQ7XHJcbiAgcHJvZHVjdEl0ZW0uY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX2l0ZW0nKTtcclxuICBwcm9kdWN0c0xpc3QuYXBwZW5kQ2hpbGQocHJvZHVjdEl0ZW0pO1xyXG4gIFxyXG4gIGNvbnN0IHByb2R1Y3RJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHByb2R1Y3RJbWFnZS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19faW1hZ2UnKTtcclxuICBwcm9kdWN0SXRlbS5hcHBlbmRDaGlsZChwcm9kdWN0SW1hZ2UpO1xyXG4gIFxyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gcHJvZHVjdC5wcmV2aWV3O1xyXG4gIGltYWdlLmFsdCA9IHByb2R1Y3QudGl0bGU7XHJcbiAgaW1hZ2UubG9hZGluZyA9ICdsYXp5JztcclxuICBwcm9kdWN0SW1hZ2UuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xyXG4gIFxyXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fdGl0bGUnKTtcclxuICB0aXRsZS50ZXh0Q29udGVudCA9IHByb2R1Y3QudGl0bGU7XHJcbiAgcHJvZHVjdEl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gIFxyXG4gIGNvbnN0IHByaWNlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHByaWNlV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fcHJpY2Utd3JhcHBlcicpO1xyXG4gIHByb2R1Y3RJdGVtLmFwcGVuZENoaWxkKHByaWNlV3JhcHBlcik7XHJcbiAgXHJcbiAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgcHJpY2UuY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX3ByaWNlJyk7XHJcbiAgcHJpY2UudGV4dENvbnRlbnQgPSBgJHtNYXRoLnJvdW5kKHByb2R1Y3QucHJpY2UpfSDigr1gO1xyXG4gIHByaWNlV3JhcHBlci5hcHBlbmRDaGlsZChwcmljZSk7XHJcbiAgXHJcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19idXktYnV0dG9uJyk7XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQlNC+0LHQsNCy0LjRgtGMINCyINC60L7RgNC30LjQvdGDJyk7XHJcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlQ2FydCk7XHJcbiAgcHJpY2VXcmFwcGVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbn07XHJcblxyXG5jb25zdCBmZXRjaFByb2R1Y3RzID0gYXN5bmMgKG1ldGhvZCA9IDEpID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0ZFVENIX1VSTH0vcHJvZHVjdHNgKTtcclxuICBjb25zdCBwcm9kdWN0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICBzb3J0SXRlbXMocHJvZHVjdHMsIG1ldGhvZCk7XHJcbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlckl0ZW1zKHByb2R1Y3RzKTtcclxuICBmaWx0ZXJlZFByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdCk7XHJcbiAgfSk7XHJcbiAgcHJvZHVjdHNDb3VudC50ZXh0Q29udGVudCA9IGAke2ZpbHRlcmVkUHJvZHVjdHMubGVuZ3RofSDRgtC+0LLQsNGA0L7QsmA7XHJcbiAgYXBwbHlMYXN0Um93U3R5bGVzKCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVmcmVzaEl0ZW1zID0gYXN5bmMgKG1ldGhvZCkgPT4ge1xyXG4gIHByb2R1Y3RzTGlzdC5pbm5lckhUTUwgPSAnJztcclxuICBzZXRNZXRob2QobWV0aG9kKTtcclxuICBhd2FpdCBmZXRjaFByb2R1Y3RzKGN1cnJlbnRTb3J0aW5nTWV0aG9kKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0UHJvZHVjdHMgPSAoKSA9PiB7XHJcbiAgYXBwbHlMYXN0Um93U3R5bGVzKCk7XHJcbiAgZmV0Y2hQcm9kdWN0cygpLnRoZW4oKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ1Byb2R1Y3RzIGxvYWRlZCcpO1xyXG4gIH0pO1xyXG59O1xyXG4iLCJpbXBvcnQge2N1cnJlbnRTb3J0aW5nTWV0aG9kLCByZWZyZXNoSXRlbXN9IGZyb20gJy4vcHJvZHVjdHMnO1xyXG5cclxuY29uc3QgZmlsdGVyT3BlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0c19fZmlsdGVyLWJ1dHRvbicpO1xyXG5jb25zdCBmaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX2ZpbHRlcicpO1xyXG5jb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuY29uc3QgbW92ZVpvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX21vdmUtem9uZScpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZpbHRlckl0ZW1zID0gKHByb2R1Y3RzKSA9PiB7XHJcbiAgY29uc3QgYWN0aXZlQ2hlY2tib3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0c19fZmlsdGVyLWNoZWNrYm94OmNoZWNrZWQnKTtcclxuICBcclxuICBpZiAoYWN0aXZlQ2hlY2tib3hlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiBwcm9kdWN0cztcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oYWN0aXZlQ2hlY2tib3hlcykuZXZlcnkoKGNoZWNrYm94KSA9PiB7XHJcbiAgICAgIHJldHVybiBwcm9kdWN0W2NoZWNrYm94Lm5hbWVdO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBvbkNoZWNrYm94Q2hhbmdlID0gKCkgPT4ge1xyXG4gIHJlZnJlc2hJdGVtcyhjdXJyZW50U29ydGluZ01ldGhvZCk7XHJcbn07XHJcblxyXG5jb25zdCBvblJlc2l6ZSA9ICgpID0+IHtcclxuICBjb25zdCBjaGVja2JveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3RzX19maWx0ZXItY2hlY2tib3gnKTtcclxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDEyMDBweCknKS5tYXRjaGVzKSB7XHJcbiAgICBjaGVja2JveGVzLmZvckVhY2goKGNoZWNrYm94KSA9PiB7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uQ2hlY2tib3hDaGFuZ2UpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrYm94ZXMuZm9yRWFjaCgoY2hlY2tib3gpID0+IHtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25DaGVja2JveENoYW5nZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdEZpbHRlciA9ICgpID0+IHtcclxuICBsZXQgc3RhcnRZO1xyXG4gIGxldCBjdXJyZW50WTtcclxuICBsZXQgaW5pdGlhbEJvdHRvbTtcclxuICBcclxuICBjb25zdCBvcGVuRmlsdGVyID0gKCkgPT4ge1xyXG4gICAgZmlsdGVyLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19maWx0ZXItLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktLW9wZW4nKTtcclxuICAgIGluaXRpYWxCb3R0b20gPSAwO1xyXG4gIH07XHJcbiAgXHJcbiAgY29uc3QgY2xvc2VGaWx0ZXIgPSAoKSA9PiB7XHJcbiAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZHVjdHNfX2ZpbHRlci0tb3BlbicpO1xyXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVybGF5LS1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spO1xyXG4gICAgcmVmcmVzaEl0ZW1zKGN1cnJlbnRTb3J0aW5nTWV0aG9kKTtcclxuICB9O1xyXG4gIFxyXG4gIGNvbnN0IGNsb3NlT25DbGljayA9IChldnQpID0+IHtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5vdmVybGF5JykpIHtcclxuICAgICAgY2xvc2VGaWx0ZXIoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIGZpbHRlck9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBvcGVuRmlsdGVyKCk7XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT25DbGljayk7XHJcbiAgICB9LCAwKTtcclxuICB9KTtcclxuICBcclxuICBtb3ZlWm9uZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4ge1xyXG4gICAgc3RhcnRZID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIGluaXRpYWxCb3R0b20gPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmaWx0ZXIpLmJvdHRvbSwgMTApO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG1vdmVab25lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChldnQpID0+IHtcclxuICAgIGN1cnJlbnRZID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIGNvbnN0IGRlbHRhWSA9IGN1cnJlbnRZIC0gc3RhcnRZO1xyXG4gICAgaWYgKGRlbHRhWSA8IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZmlsdGVyLnN0eWxlLmJvdHRvbSA9IGAke2luaXRpYWxCb3R0b20gLSBkZWx0YVl9cHhgO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG1vdmVab25lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gY3VycmVudFkgLSBzdGFydFk7XHJcbiAgICBpZiAoZGVsdGFZID4gNTApIHtcclxuICAgICAgY2xvc2VGaWx0ZXIoKTtcclxuICAgICAgZmlsdGVyLnN0eWxlID0gJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmaWx0ZXIuc3R5bGUuYm90dG9tID0gJzAnO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIG9uUmVzaXplKCk7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcclxufTtcclxuIiwiY29uc3Qgc2xpZGVzID0gW1xyXG4gIHtcclxuICAgIHRpdGxlOiAn0JrRgNCw0YHQutC4JyxcclxuICAgIGRlc2NyaXB0aW9uOiAn0JjQtNC10LDQu9GM0L3QviDQv9C+0LTRhdC+0LTRj9GCINC00LvRjyDRgdGC0LXQvSDQuCDQtNGA0YPQs9C40YUg0L/QvtCy0LXRgNGF0L3QvtGB0YLQtdC5LiDQndCw0LnQtNC4INGB0LLQvtC5INC40LTQtdCw0LvRjNC90YvQuSDRhtCy0LXRgiEnLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGl0bGU6ICfQodC70LDQudC0IDInLFxyXG4gICAgZGVzY3JpcHRpb246ICfQntC/0LjRgdCw0L3QuNC1INC00LvRjyDQstGC0L7RgNC+0LPQviDRgdC70LDQudC00LAuJyxcclxuICB9LFxyXG4gIHtcclxuICAgIHRpdGxlOiAn0KHQu9Cw0LnQtCAzJyxcclxuICAgIGRlc2NyaXB0aW9uOiAn0J7Qv9C40YHQsNC90LjQtSDQtNC70Y8g0YLRgNC10YLRjNC10LPQviDRgdC70LDQudC00LAuJyxcclxuICB9LFxyXG5dO1xyXG5cclxubGV0IGN1cnJlbnRTbGlkZSA9IDA7XHJcblxyXG5jb25zdCBjcmVhdGVTbGlkZSA9IChzbGlkZSkgPT4ge1xyXG4gIGNvbnN0IHNsaWRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHNsaWRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX3NsaWRlJyk7XHJcbiAgc2xpZGVFbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgIDxoMiBjbGFzcz1cInNsaWRlcl9fdGl0bGVcIj4ke3NsaWRlLnRpdGxlfTwvaDI+XHJcbiAgICA8cCBjbGFzcz1cInNsaWRlcl9fZGVzY3JpcHRpb25cIj4ke3NsaWRlLmRlc2NyaXB0aW9ufTwvcD5cclxuICBgO1xyXG4gIHJldHVybiBzbGlkZUVsZW1lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVOYXZCdXR0b24gPSAoaW5kZXgpID0+IHtcclxuICBjb25zdCBuYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBuYXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19uYXYtYnV0dG9uJyk7XHJcbiAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICBuYXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19uYXYtYnV0dG9uLS1hY3RpdmUnKTtcclxuICB9XHJcbiAgbmF2QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGDQodC70LDQudC0ICR7aW5kZXggKyAxfWApO1xyXG4gIG5hdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGdvVG9TbGlkZShpbmRleCkpO1xyXG4gIHJldHVybiBuYXZCdXR0b247XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJTbGlkZXMgPSAoKSA9PiB7XHJcbiAgY29uc3Qgc2xpZGVySW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19pbm5lcicpO1xyXG4gIHNsaWRlcklubmVyLmlubmVySFRNTCA9ICcnO1xyXG4gIHNsaWRlcklubmVyLmFwcGVuZENoaWxkKGNyZWF0ZVNsaWRlKHNsaWRlc1tjdXJyZW50U2xpZGVdKSk7XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJOYXZCdXR0b25zID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5hdkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19uYXYtbGlzdCcpO1xyXG4gIG5hdkxpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XHJcbiAgICBuYXZMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZU5hdkJ1dHRvbihpbmRleCkpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlTmF2QnV0dG9ucyA9ICgpID0+IHtcclxuICBjb25zdCBuYXZCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbmF2LWJ1dHRvbicpO1xyXG4gIG5hdkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpbmRleCkgPT4ge1xyXG4gICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ3NsaWRlcl9fbmF2LWJ1dHRvbi0tYWN0aXZlJywgaW5kZXggPT09IGN1cnJlbnRTbGlkZSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnb1RvU2xpZGUgPSAoaW5kZXgpID0+IHtcclxuICBjdXJyZW50U2xpZGUgPSBpbmRleDtcclxuICByZW5kZXJTbGlkZXMoKTtcclxuICB1cGRhdGVOYXZCdXR0b25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBuZXh0U2xpZGUgPSAoKSA9PiB7XHJcbiAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgc2xpZGVzLmxlbmd0aDtcclxuICByZW5kZXJTbGlkZXMoKTtcclxuICB1cGRhdGVOYXZCdXR0b25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBwcmV2U2xpZGUgPSAoKSA9PiB7XHJcbiAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XHJcbiAgcmVuZGVyU2xpZGVzKCk7XHJcbiAgdXBkYXRlTmF2QnV0dG9ucygpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTbGlkZXIgPSAoKSA9PiB7XHJcbiAgcmVuZGVyU2xpZGVzKCk7XHJcbiAgcmVuZGVyTmF2QnV0dG9ucygpO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5leHRTbGlkZSk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC0tcHJldicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcHJldlNsaWRlKTtcclxufTtcclxuIiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJztcclxuaW1wb3J0IHtpbml0TmF2fSBmcm9tICcuL2pzL25hdic7XHJcbmltcG9ydCB7aW5pdEZpbHRlcn0gZnJvbSAnLi9qcy9maWx0ZXInO1xyXG5pbXBvcnQge2luaXRTb3J0fSBmcm9tICcuL2pzL3NvcnQnO1xyXG5pbXBvcnQge2luaXRQcm9kdWN0c30gZnJvbSAnLi9qcy9wcm9kdWN0cyc7XHJcbmltcG9ydCB7aW5pdENhcnR9IGZyb20gJy4vanMvY2FydCc7XHJcbmltcG9ydCB7aW5pdFNsaWRlcn0gZnJvbSAnLi9qcy9zbGlkZXInO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICBpbml0TmF2KCk7XHJcbiAgaW5pdFNsaWRlcigpO1xyXG4gIGluaXRQcm9kdWN0cygpO1xyXG4gIGluaXRGaWx0ZXIoKTtcclxuICBpbml0U29ydCgpO1xyXG4gIGluaXRDYXJ0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsiaW5pdE5hdiIsIm5hdiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9wZW5OYXZCdXR0b24iLCJjbG9zZU5hdkJ1dHRvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJib2R5IiwicmVtb3ZlIiwicmVmcmVzaEl0ZW1zIiwic29ydE1ldGhvZHMiLCJpZCIsIm5hbWUiLCJzb3J0Iiwic29ydE9wZW5CdXR0b24iLCJvdmVybGF5Iiwic29ydExpc3QiLCJzb3J0SXRlbXMiLCJpdGVtcyIsIm1ldGhvZCIsImEiLCJiIiwicHJpY2UiLCJzZWxscyIsIkRhdGUiLCJkYXRlIiwiY3JlYXRlU29ydEJ1dHRvbiIsImlzQWN0aXZlIiwic29ydEJ1dHRvbiIsImNyZWF0ZUVsZW1lbnQiLCJkYXRhc2V0Iiwic29ydElkIiwidGV4dENvbnRlbnQiLCJvblNvcnRCdXR0b25DbGljayIsImV2dCIsImJ0blRleHQiLCJ0YXJnZXQiLCJjbG9zZVNvcnQiLCJOdW1iZXIiLCJjcmVhdGVTb3J0QnV0dG9ucyIsImJ1dHRvbnMiLCJtYXAiLCJhY3RpdmVCdG5JbmRleCIsImZpbmRJbmRleCIsImJ0biIsImNvbnRhaW5zIiwiYWN0aXZlQnRuIiwic3BsaWNlIiwidW5zaGlmdCIsImZvckVhY2giLCJhcHBlbmRDaGlsZCIsInJlbW92ZVNvcnRCdXR0b25zIiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwib3BlblNvcnQiLCJ0YXNrIiwiZmluZCIsInNldFRpbWVvdXQiLCJjbG9zZU9uQ2xpY2siLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2xvc2VzdCIsImluaXRTb3J0IiwiY2FydCIsImNhcnRMaXN0Iiwib3BlbkNhcnRCdXR0b24iLCJjbG9zZUNhcnRCdXR0b24iLCJjYXJ0Q291bnQiLCJjYXJ0Q2xlYXJCdXR0b24iLCJjb21tb25QcmljZSIsImNhcnRJdGVtcyIsImNyZWF0ZUl0ZW0iLCJwcm9kdWN0IiwibGkiLCJjYXJ0SWQiLCJpbWFnZURpdiIsImltZyIsInNyYyIsImltYWdlIiwid2lkdGgiLCJoZWlnaHQiLCJkZXNjcmlwdGlvbkRpdiIsInRpdGxlIiwiY29uY2F0IiwiYWRkUHJvZHVjdFdyYXBwZXIiLCJyZW1vdmVCdXR0b24iLCJzZXRBdHRyaWJ1dGUiLCJkZWNyZWFzZUNvdW50IiwicHJvZHVjdENvdW50IiwiY291bnQiLCJhZGRCdXR0b24iLCJpbmNyZWFzZUNvdW50IiwiZGVsZXRlQnV0dG9uIiwicmVtb3ZlSXRlbSIsInVwZGF0ZVByaWNlIiwicmVkdWNlIiwiYWNjIiwiY2FydEl0ZW0iLCJleGlzdGluZ0l0ZW0iLCJpbmRleCIsImluZGV4T2YiLCJyZW5kZXJDYXJ0IiwicmVtb3ZlQWxsIiwibGVuZ3RoIiwidXBkYXRlQ2FydENvdW50IiwiaW5uZXJIVE1MIiwic3BhbiIsInVwZGF0ZUNhcnQiLCJpdGVtIiwicHJvZHVjdElkIiwic3BsaXQiLCJpbml0Q2FydCIsIm9wZW5DYXJ0IiwiY2xvc2VDYXJ0IiwiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiYyIsImFzeW5jSXRlcmF0b3IiLCJ1IiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ3cmFwIiwiR2VuZXJhdG9yIiwiY3JlYXRlIiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsInR5cGUiLCJhcmciLCJjYWxsIiwiaCIsImwiLCJmIiwicyIsInkiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwicCIsImQiLCJnZXRQcm90b3R5cGVPZiIsInYiLCJ2YWx1ZXMiLCJnIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiX2ludm9rZSIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJfdHlwZW9mIiwicmVzb2x2ZSIsIl9fYXdhaXQiLCJ0aGVuIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRvbmUiLCJkZWxlZ2F0ZSIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwiaXNOYU4iLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsImZpbHRlckl0ZW1zIiwiRkVUQ0hfVVJMIiwicHJvZHVjdHNMaXN0IiwicHJvZHVjdHNDb3VudCIsImN1cnJlbnRTb3J0aW5nTWV0aG9kIiwic2V0TWV0aG9kIiwibmV3TWV0aG9kIiwiYXBwbHlMYXN0Um93U3R5bGVzIiwicHJvZHVjdHNJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjb2x1bW5zIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJ0b3RhbEl0ZW1zIiwibGFzdFJvd1N0YXJ0SW5kZXgiLCJjcmVhdGVQcm9kdWN0IiwicHJvZHVjdEl0ZW0iLCJwcm9kdWN0SW1hZ2UiLCJJbWFnZSIsInByZXZpZXciLCJhbHQiLCJsb2FkaW5nIiwicHJpY2VXcmFwcGVyIiwiTWF0aCIsInJvdW5kIiwiYnV0dG9uIiwiZmV0Y2hQcm9kdWN0cyIsIl9yZWYiLCJfY2FsbGVlIiwicmVzcG9uc2UiLCJwcm9kdWN0cyIsImZpbHRlcmVkUHJvZHVjdHMiLCJfYXJncyIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJ1bmRlZmluZWQiLCJmZXRjaCIsImpzb24iLCJfcmVmMiIsIl9jYWxsZWUyIiwiX2NhbGxlZTIkIiwiX2NvbnRleHQyIiwiX3giLCJpbml0UHJvZHVjdHMiLCJjb25zb2xlIiwibG9nIiwiZmlsdGVyT3BlbkJ1dHRvbiIsImZpbHRlciIsIm1vdmVab25lIiwiYWN0aXZlQ2hlY2tib3hlcyIsIkFycmF5IiwiZnJvbSIsImV2ZXJ5IiwiY2hlY2tib3giLCJvbkNoZWNrYm94Q2hhbmdlIiwib25SZXNpemUiLCJjaGVja2JveGVzIiwid2luZG93IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJpbml0RmlsdGVyIiwic3RhcnRZIiwiY3VycmVudFkiLCJpbml0aWFsQm90dG9tIiwib3BlbkZpbHRlciIsImNsb3NlRmlsdGVyIiwidG91Y2hlcyIsImNsaWVudFkiLCJwYXJzZUludCIsImJvdHRvbSIsImRlbHRhWSIsInN0eWxlIiwic2xpZGVzIiwiZGVzY3JpcHRpb24iLCJjdXJyZW50U2xpZGUiLCJjcmVhdGVTbGlkZSIsInNsaWRlIiwic2xpZGVFbGVtZW50IiwiY3JlYXRlTmF2QnV0dG9uIiwibmF2QnV0dG9uIiwiZ29Ub1NsaWRlIiwicmVuZGVyU2xpZGVzIiwic2xpZGVySW5uZXIiLCJyZW5kZXJOYXZCdXR0b25zIiwibmF2TGlzdCIsIl8iLCJ1cGRhdGVOYXZCdXR0b25zIiwibmF2QnV0dG9ucyIsInRvZ2dsZSIsIm5leHRTbGlkZSIsInByZXZTbGlkZSIsImluaXRTbGlkZXIiXSwic291cmNlUm9vdCI6IiJ9