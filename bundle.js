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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ckZqVCxRQUFRLENBQUNDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU4UyxTQUFTLENBQUM7QUFDdkYsQ0FBQzs7QUNsRnlCO0FBQ087QUFDTTtBQUNKO0FBQ1E7QUFDUjtBQUNJO0FBRXZDbFQsUUFBUSxDQUFDSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0VBQ2xETixPQUFPLENBQUMsQ0FBQztFQUNUcVQsVUFBVSxDQUFDLENBQUM7RUFDWmhELFlBQVksQ0FBQyxDQUFDO0VBQ2RpQixVQUFVLENBQUMsQ0FBQztFQUNadk4sUUFBUSxDQUFDLENBQUM7RUFDVmlELFFBQVEsQ0FBQyxDQUFDO0FBQ1osQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lcGMtaHVudGVycy8uL3NyYy9qcy9uYXYuanMiLCJ3ZWJwYWNrOi8vZXBjLWh1bnRlcnMvLi9zcmMvanMvc29ydC5qcyIsIndlYnBhY2s6Ly9lcGMtaHVudGVycy8uL3NyYy9qcy9jYXJ0LmpzIiwid2VicGFjazovL2VwYy1odW50ZXJzLy4vc3JjL2pzL3Byb2R1Y3RzLmpzIiwid2VicGFjazovL2VwYy1odW50ZXJzLy4vc3JjL2pzL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly9lcGMtaHVudGVycy8uL3NyYy9qcy9zbGlkZXIuanMiLCJ3ZWJwYWNrOi8vZXBjLWh1bnRlcnMvLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgaW5pdE5hdiA9ICgpID0+IHtcclxuICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2Jyk7XHJcbiAgY29uc3Qgb3Blbk5hdkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1idXR0b24nKTtcclxuICBjb25zdCBjbG9zZU5hdkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZfX2Nsb3NlLWJ1dHRvbicpO1xyXG4gIFxyXG4gIG9wZW5OYXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBuYXYuY2xhc3NMaXN0LmFkZCgnbmF2LS1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGNsb3NlTmF2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdi0tb3BlbicpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcclxuICB9KTtcclxufTtcclxuIiwiaW1wb3J0IHtyZWZyZXNoSXRlbXN9IGZyb20gJy4vcHJvZHVjdHMnO1xyXG5cclxuY29uc3Qgc29ydE1ldGhvZHMgPSBbXHJcbiAge2lkOiAxLCBuYW1lOiAn0KHQvdCw0YfQsNC70LAg0LTQvtGA0L7Qs9C40LUnfSxcclxuICB7aWQ6IDIsIG5hbWU6ICfQodC90LDRh9Cw0LvQsCDQvdC10LTQvtGA0L7Qs9C40LUnfSxcclxuICB7aWQ6IDMsIG5hbWU6ICfQodC90LDRh9Cw0LvQsCDQv9C+0L/Rg9C70Y/RgNC90YvQtSd9LFxyXG4gIHtpZDogNCwgbmFtZTogJ9Ch0L3QsNGH0LDQu9CwINC90L7QstGL0LUnfSxcclxuXTtcclxuXHJcbmNvbnN0IHNvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX3NvcnQnKTtcclxuY29uc3Qgc29ydE9wZW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX29wZW4tc29ydC1idXR0b24nKTtcclxuY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jyk7XHJcbmNvbnN0IHNvcnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2R1Y3RzX19zb3J0LWxpc3QnKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzb3J0SXRlbXMgPSAoaXRlbXMsIG1ldGhvZCkgPT4ge1xyXG4gIHN3aXRjaCAobWV0aG9kKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIHJldHVybiBpdGVtcy5zb3J0KChhLCBiKSA9PiBiLnByaWNlIC0gYS5wcmljZSk7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIHJldHVybiBpdGVtcy5zb3J0KChhLCBiKSA9PiBhLnByaWNlIC0gYi5wcmljZSk7XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIHJldHVybiBpdGVtcy5zb3J0KChhLCBiKSA9PiBiLnNlbGxzIC0gYS5zZWxscyk7XHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHJldHVybiBpdGVtcy5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLmRhdGUpIC0gbmV3IERhdGUoYS5kYXRlKSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gaXRlbXM7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjcmVhdGVTb3J0QnV0dG9uID0gKG1ldGhvZCwgaXNBY3RpdmUpID0+IHtcclxuICBjb25zdCBzb3J0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgc29ydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fc29ydC1idXR0b24nKTtcclxuICBpZiAoaXNBY3RpdmUpIHtcclxuICAgIHNvcnRCdXR0b24uY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX3NvcnQtYnV0dG9uLS1hY3RpdmUnKTtcclxuICB9XHJcbiAgc29ydEJ1dHRvbi5kYXRhc2V0LnNvcnRJZCA9IG1ldGhvZC5pZDtcclxuICBzb3J0QnV0dG9uLnRleHRDb250ZW50ID0gbWV0aG9kLm5hbWU7XHJcbiAgc29ydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU29ydEJ1dHRvbkNsaWNrKTtcclxuICByZXR1cm4gc29ydEJ1dHRvbjtcclxufTtcclxuXHJcbmNvbnN0IG9uU29ydEJ1dHRvbkNsaWNrID0gKGV2dCkgPT4ge1xyXG4gIGNvbnN0IGJ0blRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX29wZW4tc29ydC1idXR0b24tdGV4dCcpO1xyXG4gIGJ0blRleHQudGV4dENvbnRlbnQgPSBldnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG4gIGNsb3NlU29ydCgpO1xyXG4gIHJlZnJlc2hJdGVtcyhOdW1iZXIoZXZ0LnRhcmdldC5kYXRhc2V0LnNvcnRJZCkpO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlU29ydEJ1dHRvbnMgPSAoaWQpID0+IHtcclxuICBjb25zdCBidXR0b25zID0gc29ydE1ldGhvZHMubWFwKChtZXRob2QpID0+IGNyZWF0ZVNvcnRCdXR0b24obWV0aG9kLCBtZXRob2QuaWQgPT09IGlkKSk7XHJcbiAgY29uc3QgYWN0aXZlQnRuSW5kZXggPSBidXR0b25zLmZpbmRJbmRleCgoYnRuKSA9PiBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9kdWN0c19fc29ydC1idXR0b24tLWFjdGl2ZScpKTtcclxuICBjb25zdCBhY3RpdmVCdG4gPSBidXR0b25zLnNwbGljZShhY3RpdmVCdG5JbmRleCwgMSlbMF07XHJcbiAgYnV0dG9ucy51bnNoaWZ0KGFjdGl2ZUJ0bik7XHJcbiAgYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHNvcnRMaXN0LmFwcGVuZENoaWxkKGJ0bikpO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlU29ydEJ1dHRvbnMgPSAoKSA9PiB7XHJcbiAgd2hpbGUgKHNvcnRMaXN0LmZpcnN0Q2hpbGQpIHtcclxuICAgIHNvcnRMaXN0LnJlbW92ZUNoaWxkKHNvcnRMaXN0LmZpcnN0Q2hpbGQpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IG9wZW5Tb3J0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHRhc2sgPSBzb3J0TWV0aG9kcy5maW5kKChtZXRob2QpID0+IG1ldGhvZC5uYW1lID09PSBzb3J0T3BlbkJ1dHRvbi50ZXh0Q29udGVudCk7XHJcbiAgY3JlYXRlU29ydEJ1dHRvbnModGFzay5pZCk7XHJcbiAgc29ydC5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fc29ydC0tb3BlbicpO1xyXG4gIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS0tb3BlbicpO1xyXG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XHJcbiAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT25DbGljayksIDApO1xyXG59O1xyXG5cclxuY29uc3QgY2xvc2VTb3J0ID0gKCkgPT4ge1xyXG4gIHNvcnQuY2xhc3NMaXN0LnJlbW92ZSgncHJvZHVjdHNfX3NvcnQtLW9wZW4nKTtcclxuICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ292ZXJsYXktLW9wZW4nKTtcclxuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT25DbGljayk7XHJcbiAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcclxuICByZW1vdmVTb3J0QnV0dG9ucygpO1xyXG4gIFxyXG59O1xyXG5cclxuY29uc3QgY2xvc2VPbkNsaWNrID0gKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5vdmVybGF5JykpIHtcclxuICAgIGNsb3NlU29ydCgpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U29ydCA9ICgpID0+IHtcclxuICBzb3J0T3BlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5Tb3J0KTtcclxufTtcclxuIiwiY29uc3QgY2FydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0Jyk7XHJcbmNvbnN0IGNhcnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2xpc3QnKTtcclxuY29uc3Qgb3BlbkNhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX191c2VyLWxpbmstLWNhcnQnKTtcclxuY29uc3QgY2xvc2VDYXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2Nsb3NlLWJ1dHRvbicpO1xyXG5jb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuY29uc3QgY2FydENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2NvdW50Jyk7XHJcbmNvbnN0IGNhcnRDbGVhckJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19jbGVhci1idXR0b24nKTtcclxuY29uc3QgY29tbW9uUHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fY29tbW9uLXByaWNlLXZhbHVlJyk7XHJcblxyXG5jb25zdCBjYXJ0SXRlbXMgPSBbXTtcclxuXHJcbmNvbnN0IGNyZWF0ZUl0ZW0gPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICBsaS5kYXRhc2V0LmNhcnRJZCA9IHByb2R1Y3QuaWQ7XHJcbiAgbGkuY2xhc3NMaXN0LmFkZCgnY2FydF9faXRlbScpO1xyXG4gIFxyXG4gIGNvbnN0IGltYWdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgaW1hZ2VEaXYuY2xhc3NMaXN0LmFkZCgnY2FydF9faW1hZ2UnKTtcclxuICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICBpbWcuc3JjID0gcHJvZHVjdC5pbWFnZTtcclxuICBpbWcud2lkdGggPSA5NjtcclxuICBpbWcuaGVpZ2h0ID0gOTY7XHJcbiAgaW1hZ2VEaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICBcclxuICBjb25zdCBkZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRlc2NyaXB0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ2NhcnRfX2Rlc2NyaXB0aW9uJyk7XHJcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xyXG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NhcnRfX3RpdGxlJyk7XHJcbiAgdGl0bGUudGV4dENvbnRlbnQgPSBwcm9kdWN0LnRpdGxlO1xyXG4gIGNvbnN0IHByaWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIHByaWNlLmNsYXNzTGlzdC5hZGQoJ2NhcnRfX3ByaWNlJyk7XHJcbiAgcHJpY2UudGV4dENvbnRlbnQgPSBgJHtwcm9kdWN0LnByaWNlfSDigr1gO1xyXG4gIGRlc2NyaXB0aW9uRGl2LmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICBkZXNjcmlwdGlvbkRpdi5hcHBlbmRDaGlsZChwcmljZSk7XHJcbiAgXHJcbiAgY29uc3QgYWRkUHJvZHVjdFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBhZGRQcm9kdWN0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdjYXJ0X19hZGQtcHJvZHVjdC13cmFwcGVyJyk7XHJcbiAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2NhcnRfX3Byb2R1Y3QtYnV0dG9uJywgJ2NhcnRfX3Byb2R1Y3QtYnV0dG9uLS1yZW1vdmUnKTtcclxuICByZW1vdmVCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9CU0L7QsdCw0LLQuNGC0YwgMSDRgtC+0LLQsNGAJyk7XHJcbiAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVjcmVhc2VDb3VudCk7XHJcbiAgY29uc3QgcHJvZHVjdENvdW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gIHByb2R1Y3RDb3VudC5jbGFzc0xpc3QuYWRkKCdjYXJ0X19wcm9kdWN0LWNvdW50Jyk7XHJcbiAgcHJvZHVjdENvdW50LnRleHRDb250ZW50ID0gcHJvZHVjdC5jb3VudDtcclxuICBjb25zdCBhZGRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBhZGRCdXR0b24uY2xhc3NMaXN0LmFkZCgnY2FydF9fcHJvZHVjdC1idXR0b24nLCAnY2FydF9fcHJvZHVjdC1idXR0b24tLWFkZCcpO1xyXG4gIGFkZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAn0KPQsdGA0LDRgtGMIDEg0YLQvtCy0LDRgCcpO1xyXG4gIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGluY3JlYXNlQ291bnQpO1xyXG4gIGFkZFByb2R1Y3RXcmFwcGVyLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XHJcbiAgYWRkUHJvZHVjdFdyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZHVjdENvdW50KTtcclxuICBhZGRQcm9kdWN0V3JhcHBlci5hcHBlbmRDaGlsZChhZGRCdXR0b24pO1xyXG4gIFxyXG4gIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjYXJ0X19kZWxldGUtYnV0dG9uJyk7XHJcbiAgZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICfQo9C00LDQu9C40YLRjCDRgtC+0LLQsNGAINC40Lcg0LrQvtGA0LfQuNC90YsnKTtcclxuICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVJdGVtKTtcclxuICBcclxuICBsaS5hcHBlbmRDaGlsZChpbWFnZURpdik7XHJcbiAgbGkuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25EaXYpO1xyXG4gIGxpLmFwcGVuZENoaWxkKGFkZFByb2R1Y3RXcmFwcGVyKTtcclxuICBsaS5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xyXG4gIFxyXG4gIGNhcnRMaXN0LmFwcGVuZENoaWxkKGxpKTtcclxufTtcclxuXHJcbmNvbnN0IHVwZGF0ZVByaWNlID0gKCkgPT4ge1xyXG4gIGNvbnN0IHByaWNlID0gY2FydEl0ZW1zLnJlZHVjZSgoYWNjLCBwcm9kdWN0KSA9PiBhY2MgKyBwcm9kdWN0LnByaWNlICogcHJvZHVjdC5jb3VudCwgMCk7XHJcbiAgY29tbW9uUHJpY2UudGV4dENvbnRlbnQgPSBgJHtwcmljZX0g4oK9YDtcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUl0ZW0gPSAoZXZ0KSA9PiB7XHJcbiAgY29uc3QgY2FydEl0ZW0gPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXJ0X19pdGVtJyk7XHJcbiAgY29uc3QgaWQgPSBjYXJ0SXRlbS5kYXRhc2V0LmNhcnRJZDtcclxuICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjYXJ0SXRlbXMuZmluZCgocHJvZHVjdCkgPT4gcHJvZHVjdC5pZCA9PT0gaWQpO1xyXG4gIGNvbnN0IGluZGV4ID0gY2FydEl0ZW1zLmluZGV4T2YoZXhpc3RpbmdJdGVtKTtcclxuICBjYXJ0SXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICByZW5kZXJDYXJ0KCk7XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVBbGwgPSAoKSA9PiB7XHJcbiAgY2FydEl0ZW1zLmxlbmd0aCA9IDA7XHJcbiAgcmVuZGVyQ2FydCgpO1xyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlQ2FydENvdW50ID0gKCkgPT4ge1xyXG4gIGxldCBjb3VudCA9IGNhcnRJdGVtcy5yZWR1Y2UoKGFjYywgcHJvZHVjdCkgPT4gYWNjICsgcHJvZHVjdC5jb3VudCwgMCk7XHJcbiAgY2FydENvdW50LnRleHRDb250ZW50ID0gYCR7Y291bnR9INGC0L7QstCw0YDQvtCyYDtcclxuICBvcGVuQ2FydEJ1dHRvbi50ZXh0Q29udGVudCA9IGNvdW50O1xyXG59O1xyXG5cclxuY29uc3QgcmVuZGVyQ2FydCA9ICgpID0+IHtcclxuICBjYXJ0TGlzdC5pbm5lckhUTUwgPSAnJztcclxuICBcclxuICBpZiAoY2FydEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW4udGV4dENvbnRlbnQgPSAn0JrQvtGA0LfQuNC90LAg0L/Rg9GB0YLQsCc7XHJcbiAgICBjYXJ0TGlzdC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICB9XHJcbiAgXHJcbiAgY2FydEl0ZW1zLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgIGNyZWF0ZUl0ZW0ocHJvZHVjdCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgdXBkYXRlQ2FydENvdW50KCk7XHJcbiAgdXBkYXRlUHJpY2UoKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGRlY3JlYXNlQ291bnQoZXZ0KSB7XHJcbiAgY29uc3QgY2FydEl0ZW0gPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXJ0X19pdGVtJyk7XHJcbiAgY29uc3QgaWQgPSBjYXJ0SXRlbS5kYXRhc2V0LmNhcnRJZDtcclxuICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjYXJ0SXRlbXMuZmluZCgocHJvZHVjdCkgPT4gcHJvZHVjdC5pZCA9PT0gaWQpO1xyXG4gIGlmIChleGlzdGluZ0l0ZW0uY291bnQgPiAxKSB7XHJcbiAgICBleGlzdGluZ0l0ZW0uY291bnQtLTtcclxuICAgIHJlbmRlckNhcnQoKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluY3JlYXNlQ291bnQoZXZ0KSB7XHJcbiAgY29uc3QgY2FydEl0ZW0gPSBldnQudGFyZ2V0LmNsb3Nlc3QoJy5jYXJ0X19pdGVtJyk7XHJcbiAgY29uc3QgaWQgPSBjYXJ0SXRlbS5kYXRhc2V0LmNhcnRJZDtcclxuICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjYXJ0SXRlbXMuZmluZCgocHJvZHVjdCkgPT4gcHJvZHVjdC5pZCA9PT0gaWQpO1xyXG4gIGV4aXN0aW5nSXRlbS5jb3VudCsrO1xyXG4gIHJlbmRlckNhcnQoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUNhcnQgPSAoZXZ0KSA9PiB7XHJcbiAgY29uc3QgaXRlbSA9IGV2dC50YXJnZXQuY2xvc2VzdCgnLnByb2R1Y3RzX19pdGVtJyk7XHJcbiAgY29uc3QgaWQgPSBpdGVtLmRhdGFzZXQucHJvZHVjdElkO1xyXG4gIGNvbnN0IHRpdGxlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX3RpdGxlJykudGV4dENvbnRlbnQ7XHJcbiAgY29uc3QgcHJpY2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0c19fcHJpY2UnKS50ZXh0Q29udGVudC5zcGxpdCgnICcpWzBdO1xyXG4gIGNvbnN0IGltYWdlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX2ltYWdlIGltZycpLnNyYztcclxuICBcclxuICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjYXJ0SXRlbXMuZmluZCgocHJvZHVjdCkgPT4gcHJvZHVjdC5pZCA9PT0gaWQpO1xyXG4gIFxyXG4gIHVwZGF0ZVByaWNlKCk7XHJcbiAgXHJcbiAgaWYgKGV4aXN0aW5nSXRlbSkge1xyXG4gICAgZXhpc3RpbmdJdGVtLmNvdW50Kys7XHJcbiAgICB1cGRhdGVDYXJ0Q291bnQoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgY2FydEl0ZW1zLnVuc2hpZnQoe1xyXG4gICAgaWQsXHJcbiAgICB0aXRsZSxcclxuICAgIHByaWNlLFxyXG4gICAgaW1hZ2UsXHJcbiAgICBjb3VudDogMSxcclxuICB9KTtcclxuICB1cGRhdGVDYXJ0Q291bnQoKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0Q2FydCA9ICgpID0+IHtcclxuICBjb25zdCBvcGVuQ2FydCA9ICgpID0+IHtcclxuICAgIGNhcnQuY2xhc3NMaXN0LmFkZCgnY2FydC0tb3BlbicpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS0tb3BlbicpO1xyXG4gICAgXHJcbiAgICByZW5kZXJDYXJ0KCk7XHJcbiAgfTtcclxuICBcclxuICBjb25zdCBjbG9zZUNhcnQgPSAoKSA9PiB7XHJcbiAgICBjYXJ0LmNsYXNzTGlzdC5yZW1vdmUoJ2NhcnQtLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT25DbGljayk7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ292ZXJsYXktLW9wZW4nKTtcclxuICB9O1xyXG4gIFxyXG4gIGNvbnN0IGNsb3NlT25DbGljayA9IChldnQpID0+IHtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5vdmVybGF5JykpIHtcclxuICAgICAgY2xvc2VDYXJ0KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICBvcGVuQ2FydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIG9wZW5DYXJ0KCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spO1xyXG4gICAgfSwgMCk7XHJcbiAgfSk7XHJcbiAgY2xvc2VDYXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VDYXJ0KTtcclxuICBjYXJ0Q2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVBbGwpO1xyXG4gIFxyXG4gIHVwZGF0ZUNhcnRDb3VudCgpO1xyXG59O1xyXG4iLCJpbXBvcnQge3NvcnRJdGVtc30gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtmaWx0ZXJJdGVtc30gZnJvbSAnLi9maWx0ZXInO1xyXG5pbXBvcnQge3VwZGF0ZUNhcnR9IGZyb20gJy4vY2FydCc7XHJcblxyXG5jb25zdCBGRVRDSF9VUkwgPSAnaHR0cHM6Ly82NzMwODkwNzY2ZTQyY2VhZjE2MDkyYWIubW9ja2FwaS5pbyc7XHJcblxyXG5jb25zdCBwcm9kdWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX2xpc3QnKTtcclxuY29uc3QgcHJvZHVjdHNDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0c19fY291bnQnKTtcclxuXHJcbmV4cG9ydCBsZXQgY3VycmVudFNvcnRpbmdNZXRob2QgPSAxO1xyXG5jb25zdCBzZXRNZXRob2QgPSAobmV3TWV0aG9kKSA9PiB7XHJcbiAgY3VycmVudFNvcnRpbmdNZXRob2QgPSBuZXdNZXRob2Q7XHJcbn07XHJcblxyXG5jb25zdCBhcHBseUxhc3RSb3dTdHlsZXMgPSAoKSA9PiB7XHJcbiAgY29uc3QgcHJvZHVjdHNJdGVtcyA9IHByb2R1Y3RzTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdHNfX2l0ZW0nKTtcclxuICBjb25zdCBjb2x1bW5zID0gZ2V0Q29tcHV0ZWRTdHlsZShwcm9kdWN0c0xpc3QpLmdyaWRUZW1wbGF0ZUNvbHVtbnMuc3BsaXQoJyAnKS5sZW5ndGg7XHJcbiAgY29uc3QgdG90YWxJdGVtcyA9IHByb2R1Y3RzSXRlbXMubGVuZ3RoO1xyXG4gIGNvbnN0IGxhc3RSb3dTdGFydEluZGV4ID0gdG90YWxJdGVtcyAtICh0b3RhbEl0ZW1zICUgY29sdW1ucyB8fCBjb2x1bW5zKTtcclxuICBcclxuICBwcm9kdWN0c0l0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICBpZiAoaW5kZXggPj0gbGFzdFJvd1N0YXJ0SW5kZXgpIHtcclxuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19faXRlbS0tbGFzdCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlUHJvZHVjdCA9IChwcm9kdWN0KSA9PiB7XHJcbiAgY29uc3QgcHJvZHVjdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gIHByb2R1Y3RJdGVtLmRhdGFzZXQucHJvZHVjdElkID0gcHJvZHVjdC5pZDtcclxuICBwcm9kdWN0SXRlbS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19faXRlbScpO1xyXG4gIHByb2R1Y3RzTGlzdC5hcHBlbmRDaGlsZChwcm9kdWN0SXRlbSk7XHJcbiAgXHJcbiAgY29uc3QgcHJvZHVjdEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgcHJvZHVjdEltYWdlLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19pbWFnZScpO1xyXG4gIHByb2R1Y3RJdGVtLmFwcGVuZENoaWxkKHByb2R1Y3RJbWFnZSk7XHJcbiAgXHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSBwcm9kdWN0LnByZXZpZXc7XHJcbiAgaW1hZ2UuYWx0ID0gcHJvZHVjdC50aXRsZTtcclxuICBwcm9kdWN0SW1hZ2UuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xyXG4gIFxyXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fdGl0bGUnKTtcclxuICB0aXRsZS50ZXh0Q29udGVudCA9IHByb2R1Y3QudGl0bGU7XHJcbiAgcHJvZHVjdEl0ZW0uYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gIFxyXG4gIGNvbnN0IHByaWNlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHByaWNlV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdwcm9kdWN0c19fcHJpY2Utd3JhcHBlcicpO1xyXG4gIHByb2R1Y3RJdGVtLmFwcGVuZENoaWxkKHByaWNlV3JhcHBlcik7XHJcbiAgXHJcbiAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgcHJpY2UuY2xhc3NMaXN0LmFkZCgncHJvZHVjdHNfX3ByaWNlJyk7XHJcbiAgcHJpY2UudGV4dENvbnRlbnQgPSBgJHtNYXRoLnJvdW5kKHByb2R1Y3QucHJpY2UpfSDigr1gO1xyXG4gIHByaWNlV3JhcHBlci5hcHBlbmRDaGlsZChwcmljZSk7XHJcbiAgXHJcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19idXktYnV0dG9uJyk7XHJcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlQ2FydCk7XHJcbiAgcHJpY2VXcmFwcGVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbn07XHJcblxyXG5jb25zdCBmZXRjaFByb2R1Y3RzID0gYXN5bmMgKG1ldGhvZCA9IDEpID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke0ZFVENIX1VSTH0vcHJvZHVjdHNgKTtcclxuICBjb25zdCBwcm9kdWN0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICBzb3J0SXRlbXMocHJvZHVjdHMsIG1ldGhvZCk7XHJcbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlckl0ZW1zKHByb2R1Y3RzKTtcclxuICBmaWx0ZXJlZFByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgIGNyZWF0ZVByb2R1Y3QocHJvZHVjdCk7XHJcbiAgfSk7XHJcbiAgcHJvZHVjdHNDb3VudC50ZXh0Q29udGVudCA9IGAke2ZpbHRlcmVkUHJvZHVjdHMubGVuZ3RofSDRgtC+0LLQsNGA0L7QsmA7XHJcbiAgYXBwbHlMYXN0Um93U3R5bGVzKCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVmcmVzaEl0ZW1zID0gYXN5bmMgKG1ldGhvZCkgPT4ge1xyXG4gIHByb2R1Y3RzTGlzdC5pbm5lckhUTUwgPSAnJztcclxuICBzZXRNZXRob2QobWV0aG9kKTtcclxuICBhd2FpdCBmZXRjaFByb2R1Y3RzKGN1cnJlbnRTb3J0aW5nTWV0aG9kKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbml0UHJvZHVjdHMgPSAoKSA9PiB7XHJcbiAgYXBwbHlMYXN0Um93U3R5bGVzKCk7XHJcbiAgZmV0Y2hQcm9kdWN0cygpLnRoZW4oKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ1Byb2R1Y3RzIGxvYWRlZCcpO1xyXG4gIH0pO1xyXG59O1xyXG4iLCJpbXBvcnQge2N1cnJlbnRTb3J0aW5nTWV0aG9kLCByZWZyZXNoSXRlbXN9IGZyb20gJy4vcHJvZHVjdHMnO1xyXG5cclxuY29uc3QgZmlsdGVyT3BlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0c19fZmlsdGVyLWJ1dHRvbicpO1xyXG5jb25zdCBmaWx0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX2ZpbHRlcicpO1xyXG5jb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuY29uc3QgbW92ZVpvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX21vdmUtem9uZScpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZpbHRlckl0ZW1zID0gKHByb2R1Y3RzKSA9PiB7XHJcbiAgY29uc3QgYWN0aXZlQ2hlY2tib3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0c19fZmlsdGVyLWNoZWNrYm94OmNoZWNrZWQnKTtcclxuICBcclxuICBpZiAoYWN0aXZlQ2hlY2tib3hlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiBwcm9kdWN0cztcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oYWN0aXZlQ2hlY2tib3hlcykuZXZlcnkoKGNoZWNrYm94KSA9PiB7XHJcbiAgICAgIHJldHVybiBwcm9kdWN0W2NoZWNrYm94Lm5hbWVdO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBvbkNoZWNrYm94Q2hhbmdlID0gKCkgPT4ge1xyXG4gIHJlZnJlc2hJdGVtcyhjdXJyZW50U29ydGluZ01ldGhvZCk7XHJcbn07XHJcblxyXG5jb25zdCBvblJlc2l6ZSA9ICgpID0+IHtcclxuICBjb25zdCBjaGVja2JveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3RzX19maWx0ZXItY2hlY2tib3gnKTtcclxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDEyMDBweCknKS5tYXRjaGVzKSB7XHJcbiAgICBjaGVja2JveGVzLmZvckVhY2goKGNoZWNrYm94KSA9PiB7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uQ2hlY2tib3hDaGFuZ2UpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNoZWNrYm94ZXMuZm9yRWFjaCgoY2hlY2tib3gpID0+IHtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25DaGVja2JveENoYW5nZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdEZpbHRlciA9ICgpID0+IHtcclxuICBsZXQgc3RhcnRZO1xyXG4gIGxldCBjdXJyZW50WTtcclxuICBsZXQgaW5pdGlhbEJvdHRvbTtcclxuICBcclxuICBjb25zdCBvcGVuRmlsdGVyID0gKCkgPT4ge1xyXG4gICAgZmlsdGVyLmNsYXNzTGlzdC5hZGQoJ3Byb2R1Y3RzX19maWx0ZXItLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktLW9wZW4nKTtcclxuICAgIGluaXRpYWxCb3R0b20gPSAwO1xyXG4gIH07XHJcbiAgXHJcbiAgY29uc3QgY2xvc2VGaWx0ZXIgPSAoKSA9PiB7XHJcbiAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZHVjdHNfX2ZpbHRlci0tb3BlbicpO1xyXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVybGF5LS1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9uQ2xpY2spO1xyXG4gICAgcmVmcmVzaEl0ZW1zKGN1cnJlbnRTb3J0aW5nTWV0aG9kKTtcclxuICB9O1xyXG4gIFxyXG4gIGNvbnN0IGNsb3NlT25DbGljayA9IChldnQpID0+IHtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5vdmVybGF5JykpIHtcclxuICAgICAgY2xvc2VGaWx0ZXIoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIGZpbHRlck9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBvcGVuRmlsdGVyKCk7XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT25DbGljayk7XHJcbiAgICB9LCAwKTtcclxuICB9KTtcclxuICBcclxuICBtb3ZlWm9uZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4ge1xyXG4gICAgc3RhcnRZID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIGluaXRpYWxCb3R0b20gPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmaWx0ZXIpLmJvdHRvbSwgMTApO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG1vdmVab25lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChldnQpID0+IHtcclxuICAgIGN1cnJlbnRZID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIGNvbnN0IGRlbHRhWSA9IGN1cnJlbnRZIC0gc3RhcnRZO1xyXG4gICAgaWYgKGRlbHRhWSA8IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZmlsdGVyLnN0eWxlLmJvdHRvbSA9IGAke2luaXRpYWxCb3R0b20gLSBkZWx0YVl9cHhgO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG1vdmVab25lLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gY3VycmVudFkgLSBzdGFydFk7XHJcbiAgICBpZiAoZGVsdGFZID4gNTApIHtcclxuICAgICAgY2xvc2VGaWx0ZXIoKTtcclxuICAgICAgZmlsdGVyLnN0eWxlID0gJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmaWx0ZXIuc3R5bGUuYm90dG9tID0gJzAnO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIG9uUmVzaXplKCk7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcclxufTtcclxuIiwiY29uc3Qgc2xpZGVzID0gW1xyXG4gIHtcclxuICAgIHRpdGxlOiAn0JrRgNCw0YHQutC4JyxcclxuICAgIGRlc2NyaXB0aW9uOiAn0JjQtNC10LDQu9GM0L3QviDQv9C+0LTRhdC+0LTRj9GCINC00LvRjyDRgdGC0LXQvSDQuCDQtNGA0YPQs9C40YUg0L/QvtCy0LXRgNGF0L3QvtGB0YLQtdC5LiDQndCw0LnQtNC4INGB0LLQvtC5INC40LTQtdCw0LvRjNC90YvQuSDRhtCy0LXRgiEnLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGl0bGU6ICfQodC70LDQudC0IDInLFxyXG4gICAgZGVzY3JpcHRpb246ICfQntC/0LjRgdCw0L3QuNC1INC00LvRjyDQstGC0L7RgNC+0LPQviDRgdC70LDQudC00LAuJyxcclxuICB9LFxyXG4gIHtcclxuICAgIHRpdGxlOiAn0KHQu9Cw0LnQtCAzJyxcclxuICAgIGRlc2NyaXB0aW9uOiAn0J7Qv9C40YHQsNC90LjQtSDQtNC70Y8g0YLRgNC10YLRjNC10LPQviDRgdC70LDQudC00LAuJyxcclxuICB9LFxyXG5dO1xyXG5cclxubGV0IGN1cnJlbnRTbGlkZSA9IDA7XHJcblxyXG5jb25zdCBjcmVhdGVTbGlkZSA9IChzbGlkZSkgPT4ge1xyXG4gIGNvbnN0IHNsaWRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHNsaWRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX3NsaWRlJyk7XHJcbiAgc2xpZGVFbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgIDxoMiBjbGFzcz1cInNsaWRlcl9fdGl0bGVcIj4ke3NsaWRlLnRpdGxlfTwvaDI+XHJcbiAgICA8cCBjbGFzcz1cInNsaWRlcl9fZGVzY3JpcHRpb25cIj4ke3NsaWRlLmRlc2NyaXB0aW9ufTwvcD5cclxuICBgO1xyXG4gIHJldHVybiBzbGlkZUVsZW1lbnQ7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVOYXZCdXR0b24gPSAoaW5kZXgpID0+IHtcclxuICBjb25zdCBuYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBuYXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19uYXYtYnV0dG9uJyk7XHJcbiAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICBuYXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnc2xpZGVyX19uYXYtYnV0dG9uLS1hY3RpdmUnKTtcclxuICB9XHJcbiAgbmF2QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGDQodC70LDQudC0ICR7aW5kZXggKyAxfWApO1xyXG4gIG5hdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGdvVG9TbGlkZShpbmRleCkpO1xyXG4gIHJldHVybiBuYXZCdXR0b247XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJTbGlkZXMgPSAoKSA9PiB7XHJcbiAgY29uc3Qgc2xpZGVySW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19pbm5lcicpO1xyXG4gIHNsaWRlcklubmVyLmlubmVySFRNTCA9ICcnO1xyXG4gIHNsaWRlcklubmVyLmFwcGVuZENoaWxkKGNyZWF0ZVNsaWRlKHNsaWRlc1tjdXJyZW50U2xpZGVdKSk7XHJcbn07XHJcblxyXG5jb25zdCByZW5kZXJOYXZCdXR0b25zID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5hdkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyX19uYXYtbGlzdCcpO1xyXG4gIG5hdkxpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XHJcbiAgICBuYXZMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZU5hdkJ1dHRvbihpbmRleCkpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlTmF2QnV0dG9ucyA9ICgpID0+IHtcclxuICBjb25zdCBuYXZCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fbmF2LWJ1dHRvbicpO1xyXG4gIG5hdkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpbmRleCkgPT4ge1xyXG4gICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ3NsaWRlcl9fbmF2LWJ1dHRvbi0tYWN0aXZlJywgaW5kZXggPT09IGN1cnJlbnRTbGlkZSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnb1RvU2xpZGUgPSAoaW5kZXgpID0+IHtcclxuICBjdXJyZW50U2xpZGUgPSBpbmRleDtcclxuICByZW5kZXJTbGlkZXMoKTtcclxuICB1cGRhdGVOYXZCdXR0b25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBuZXh0U2xpZGUgPSAoKSA9PiB7XHJcbiAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgc2xpZGVzLmxlbmd0aDtcclxuICByZW5kZXJTbGlkZXMoKTtcclxuICB1cGRhdGVOYXZCdXR0b25zKCk7XHJcbn07XHJcblxyXG5jb25zdCBwcmV2U2xpZGUgPSAoKSA9PiB7XHJcbiAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XHJcbiAgcmVuZGVyU2xpZGVzKCk7XHJcbiAgdXBkYXRlTmF2QnV0dG9ucygpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTbGlkZXIgPSAoKSA9PiB7XHJcbiAgcmVuZGVyU2xpZGVzKCk7XHJcbiAgcmVuZGVyTmF2QnV0dG9ucygpO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5leHRTbGlkZSk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlcl9fY29udHJvbC0tcHJldicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcHJldlNsaWRlKTtcclxufTtcclxuIiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJztcclxuaW1wb3J0IHtpbml0TmF2fSBmcm9tICcuL2pzL25hdic7XHJcbmltcG9ydCB7aW5pdEZpbHRlcn0gZnJvbSAnLi9qcy9maWx0ZXInO1xyXG5pbXBvcnQge2luaXRTb3J0fSBmcm9tICcuL2pzL3NvcnQnO1xyXG5pbXBvcnQge2luaXRQcm9kdWN0c30gZnJvbSAnLi9qcy9wcm9kdWN0cyc7XHJcbmltcG9ydCB7aW5pdENhcnR9IGZyb20gJy4vanMvY2FydCc7XHJcbmltcG9ydCB7aW5pdFNsaWRlcn0gZnJvbSAnLi9qcy9zbGlkZXInO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICBpbml0TmF2KCk7XHJcbiAgaW5pdFNsaWRlcigpO1xyXG4gIGluaXRQcm9kdWN0cygpO1xyXG4gIGluaXRGaWx0ZXIoKTtcclxuICBpbml0U29ydCgpO1xyXG4gIGluaXRDYXJ0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsiaW5pdE5hdiIsIm5hdiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9wZW5OYXZCdXR0b24iLCJjbG9zZU5hdkJ1dHRvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJhZGQiLCJib2R5IiwicmVtb3ZlIiwicmVmcmVzaEl0ZW1zIiwic29ydE1ldGhvZHMiLCJpZCIsIm5hbWUiLCJzb3J0Iiwic29ydE9wZW5CdXR0b24iLCJvdmVybGF5Iiwic29ydExpc3QiLCJzb3J0SXRlbXMiLCJpdGVtcyIsIm1ldGhvZCIsImEiLCJiIiwicHJpY2UiLCJzZWxscyIsIkRhdGUiLCJkYXRlIiwiY3JlYXRlU29ydEJ1dHRvbiIsImlzQWN0aXZlIiwic29ydEJ1dHRvbiIsImNyZWF0ZUVsZW1lbnQiLCJkYXRhc2V0Iiwic29ydElkIiwidGV4dENvbnRlbnQiLCJvblNvcnRCdXR0b25DbGljayIsImV2dCIsImJ0blRleHQiLCJ0YXJnZXQiLCJjbG9zZVNvcnQiLCJOdW1iZXIiLCJjcmVhdGVTb3J0QnV0dG9ucyIsImJ1dHRvbnMiLCJtYXAiLCJhY3RpdmVCdG5JbmRleCIsImZpbmRJbmRleCIsImJ0biIsImNvbnRhaW5zIiwiYWN0aXZlQnRuIiwic3BsaWNlIiwidW5zaGlmdCIsImZvckVhY2giLCJhcHBlbmRDaGlsZCIsInJlbW92ZVNvcnRCdXR0b25zIiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwib3BlblNvcnQiLCJ0YXNrIiwiZmluZCIsInNldFRpbWVvdXQiLCJjbG9zZU9uQ2xpY2siLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2xvc2VzdCIsImluaXRTb3J0IiwiY2FydCIsImNhcnRMaXN0Iiwib3BlbkNhcnRCdXR0b24iLCJjbG9zZUNhcnRCdXR0b24iLCJjYXJ0Q291bnQiLCJjYXJ0Q2xlYXJCdXR0b24iLCJjb21tb25QcmljZSIsImNhcnRJdGVtcyIsImNyZWF0ZUl0ZW0iLCJwcm9kdWN0IiwibGkiLCJjYXJ0SWQiLCJpbWFnZURpdiIsImltZyIsInNyYyIsImltYWdlIiwid2lkdGgiLCJoZWlnaHQiLCJkZXNjcmlwdGlvbkRpdiIsInRpdGxlIiwiY29uY2F0IiwiYWRkUHJvZHVjdFdyYXBwZXIiLCJyZW1vdmVCdXR0b24iLCJzZXRBdHRyaWJ1dGUiLCJkZWNyZWFzZUNvdW50IiwicHJvZHVjdENvdW50IiwiY291bnQiLCJhZGRCdXR0b24iLCJpbmNyZWFzZUNvdW50IiwiZGVsZXRlQnV0dG9uIiwicmVtb3ZlSXRlbSIsInVwZGF0ZVByaWNlIiwicmVkdWNlIiwiYWNjIiwiY2FydEl0ZW0iLCJleGlzdGluZ0l0ZW0iLCJpbmRleCIsImluZGV4T2YiLCJyZW5kZXJDYXJ0IiwicmVtb3ZlQWxsIiwibGVuZ3RoIiwidXBkYXRlQ2FydENvdW50IiwiaW5uZXJIVE1MIiwic3BhbiIsInVwZGF0ZUNhcnQiLCJpdGVtIiwicHJvZHVjdElkIiwic3BsaXQiLCJpbml0Q2FydCIsIm9wZW5DYXJ0IiwiY2xvc2VDYXJ0IiwiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiYyIsImFzeW5jSXRlcmF0b3IiLCJ1IiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ3cmFwIiwiR2VuZXJhdG9yIiwiY3JlYXRlIiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsInR5cGUiLCJhcmciLCJjYWxsIiwiaCIsImwiLCJmIiwicyIsInkiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwicCIsImQiLCJnZXRQcm90b3R5cGVPZiIsInYiLCJ2YWx1ZXMiLCJnIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiX2ludm9rZSIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJfdHlwZW9mIiwicmVzb2x2ZSIsIl9fYXdhaXQiLCJ0aGVuIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRvbmUiLCJkZWxlZ2F0ZSIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwiaXNOYU4iLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsImZpbHRlckl0ZW1zIiwiRkVUQ0hfVVJMIiwicHJvZHVjdHNMaXN0IiwicHJvZHVjdHNDb3VudCIsImN1cnJlbnRTb3J0aW5nTWV0aG9kIiwic2V0TWV0aG9kIiwibmV3TWV0aG9kIiwiYXBwbHlMYXN0Um93U3R5bGVzIiwicHJvZHVjdHNJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjb2x1bW5zIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJ0b3RhbEl0ZW1zIiwibGFzdFJvd1N0YXJ0SW5kZXgiLCJjcmVhdGVQcm9kdWN0IiwicHJvZHVjdEl0ZW0iLCJwcm9kdWN0SW1hZ2UiLCJJbWFnZSIsInByZXZpZXciLCJhbHQiLCJwcmljZVdyYXBwZXIiLCJNYXRoIiwicm91bmQiLCJidXR0b24iLCJmZXRjaFByb2R1Y3RzIiwiX3JlZiIsIl9jYWxsZWUiLCJyZXNwb25zZSIsInByb2R1Y3RzIiwiZmlsdGVyZWRQcm9kdWN0cyIsIl9hcmdzIiwiX2NhbGxlZSQiLCJfY29udGV4dCIsInVuZGVmaW5lZCIsImZldGNoIiwianNvbiIsIl9yZWYyIiwiX2NhbGxlZTIiLCJfY2FsbGVlMiQiLCJfY29udGV4dDIiLCJfeCIsImluaXRQcm9kdWN0cyIsImNvbnNvbGUiLCJsb2ciLCJmaWx0ZXJPcGVuQnV0dG9uIiwiZmlsdGVyIiwibW92ZVpvbmUiLCJhY3RpdmVDaGVja2JveGVzIiwiQXJyYXkiLCJmcm9tIiwiZXZlcnkiLCJjaGVja2JveCIsIm9uQ2hlY2tib3hDaGFuZ2UiLCJvblJlc2l6ZSIsImNoZWNrYm94ZXMiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImluaXRGaWx0ZXIiLCJzdGFydFkiLCJjdXJyZW50WSIsImluaXRpYWxCb3R0b20iLCJvcGVuRmlsdGVyIiwiY2xvc2VGaWx0ZXIiLCJ0b3VjaGVzIiwiY2xpZW50WSIsInBhcnNlSW50IiwiYm90dG9tIiwiZGVsdGFZIiwic3R5bGUiLCJzbGlkZXMiLCJkZXNjcmlwdGlvbiIsImN1cnJlbnRTbGlkZSIsImNyZWF0ZVNsaWRlIiwic2xpZGUiLCJzbGlkZUVsZW1lbnQiLCJjcmVhdGVOYXZCdXR0b24iLCJuYXZCdXR0b24iLCJnb1RvU2xpZGUiLCJyZW5kZXJTbGlkZXMiLCJzbGlkZXJJbm5lciIsInJlbmRlck5hdkJ1dHRvbnMiLCJuYXZMaXN0IiwiXyIsInVwZGF0ZU5hdkJ1dHRvbnMiLCJuYXZCdXR0b25zIiwidG9nZ2xlIiwibmV4dFNsaWRlIiwicHJldlNsaWRlIiwiaW5pdFNsaWRlciJdLCJzb3VyY2VSb290IjoiIn0=