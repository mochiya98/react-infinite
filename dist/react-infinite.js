(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Infinite = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],2:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number,
 *  else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

module.exports = isFinite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var InfiniteComputer=require("./infiniteComputer.js"),bs=require("../utils/binaryIndexSearch.js"),ArrayInfiniteComputer=function(e){function t(e,r){var n;return _classCallCheck(this,t),_defineProperty(_assertThisInitialized(_assertThisInitialized(n=_possibleConstructorReturn(this,_getPrototypeOf(t).call(this,e,r)))),"prefixHeightData",void 0),n.prefixHeightData=n.heightData.reduce(function(e,t){return 0===e.length?[t]:(e.push(e[e.length-1]+t),e)},[]),n}return _inherits(t,InfiniteComputer),_createClass(t,[{key:"maybeIndexToIndex",value:function(e){return null==e?this.prefixHeightData.length-1:e}},{key:"getTotalScrollableHeight",value:function(){var e=this.prefixHeightData.length;return 0===e?0:this.prefixHeightData[e-1]}},{key:"getDisplayIndexStart",value:function(e){var t=bs.binaryIndexSearch(this.prefixHeightData,e,bs.opts.CLOSEST_HIGHER);return this.maybeIndexToIndex(t)}},{key:"getDisplayIndexEnd",value:function(e){var t=bs.binaryIndexSearch(this.prefixHeightData,e,bs.opts.CLOSEST_HIGHER);return this.maybeIndexToIndex(t)}},{key:"getTopSpacerHeight",value:function(e){var t=e-1;return t<0?0:this.prefixHeightData[t]}},{key:"getBottomSpacerHeight",value:function(e){return-1===e?0:this.getTotalScrollableHeight()-this.prefixHeightData[e]}}]),t}();module.exports=ArrayInfiniteComputer;

},{"../utils/binaryIndexSearch.js":8,"./infiniteComputer.js":6}],5:[function(require,module,exports){
"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var InfiniteComputer=require("./infiniteComputer.js"),ConstantInfiniteComputer=function(t){function e(){return _classCallCheck(this,e),_possibleConstructorReturn(this,_getPrototypeOf(e).apply(this,arguments))}return _inherits(e,InfiniteComputer),_createClass(e,[{key:"getTotalScrollableHeight",value:function(){return this.heightData*this.numberOfChildren}},{key:"getDisplayIndexStart",value:function(t){return Math.floor(t/this.heightData)}},{key:"getDisplayIndexEnd",value:function(t){var e=Math.ceil(t/this.heightData);return e>0?e-1:e}},{key:"getTopSpacerHeight",value:function(t){return t*this.heightData}},{key:"getBottomSpacerHeight",value:function(t){var e=t+1;return Math.max(0,(this.numberOfChildren-e)*this.heightData)}}]),e}();module.exports=ConstantInfiniteComputer;

},{"./infiniteComputer.js":6}],6:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}var InfiniteComputer=function(){function e(t,n){_classCallCheck(this,e),this.heightData=t,this.numberOfChildren=n}return _createClass(e,[{key:"getTotalScrollableHeight",value:function(){0}},{key:"getDisplayIndexStart",value:function(e){0}},{key:"getDisplayIndexEnd",value:function(e){0}},{key:"getTopSpacerHeight",value:function(e){0}},{key:"getBottomSpacerHeight",value:function(e){0}}]),e}();module.exports=InfiniteComputer;

},{}],7:[function(require,module,exports){
(function (global){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var o=t[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _defineProperty(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var React=global.React||require("react"),PropTypes=global.PropTypes||require("prop-types"),window=require("./utils/window");require("./utils/establish-polyfills");var scaleEnum=require("./utils/scaleEnum"),infiniteHelpers=require("./utils/infiniteHelpers"),_isFinite=require("lodash.isfinite"),checkProps=require("./utils/checkProps"),Infinite=function(e){function t(e){var i;_classCallCheck(this,t),_defineProperty(_assertThisInitialized(_assertThisInitialized(i=_possibleConstructorReturn(this,_getPrototypeOf(t).call(this,e)))),"state",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"computedProps",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"utils",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"shouldAttachToBottom",!1),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"preservedScrollState",0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"loadingSpinnerHeight",0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"scrollable",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"topSpacer",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"bottomSpacer",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"smoothScrollingWrapper",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"loadingSpinner",void 0),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"generateComputedUtilityFunctions",function(e){var t={getLoadingSpinnerHeight:function(){var e=0;return i.loadingSpinner&&(e=i.loadingSpinner.offsetHeight||0),e}};return e.useWindowAsScrollContainer?(t.subscribeToScrollListener=function(){window.addEventListener("scroll",i.infiniteHandleScroll)},t.unsubscribeFromScrollListener=function(){window.removeEventListener("scroll",i.infiniteHandleScroll)},t.nodeScrollListener=function(){},t.getScrollTop=function(){return window.pageYOffset},t.setScrollTop=function(e){window.scroll(window.pageXOffset,e)},t.scrollShouldBeIgnored=function(){return!1},t.buildScrollableStyle=function(){return{}}):(t.subscribeToScrollListener=function(){},t.unsubscribeFromScrollListener=function(){},t.nodeScrollListener=i.infiniteHandleScroll,t.getScrollTop=function(){return i.scrollable?i.scrollable.scrollTop:0},t.setScrollTop=function(e){i.scrollable&&(i.scrollable.scrollTop=e)},t.scrollShouldBeIgnored=function(e){return e.target!==i.scrollable},t.buildScrollableStyle=function(){return Object.assign({},{height:i.state.computedProps.containerHeight,overflowX:"hidden",overflowY:"scroll",WebkitOverflowScrolling:"touch"},i.state.computedProps.styles.scrollableStyle||{})}),t}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"recomputeInternalStateFromProps",function(e){checkProps(e);var t=infiniteHelpers.generateComputedProps(e),o=i.generateComputedUtilityFunctions(e),r={computedProps:t,utils:o};return r.numberOfChildren=React.Children.count(t.children),r.infiniteComputer=infiniteHelpers.createInfiniteComputer(t.elementHeight,t.children),void 0!==t.isInfiniteLoading&&(r.isInfiniteLoading=t.isInfiniteLoading),r.preloadBatchSize=t.preloadBatchSize,r.preloadAdditionalHeight=t.preloadAdditionalHeight,r=Object.assign(r,infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(r,o.getScrollTop()))}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"infiniteHandleScroll",function(e){i.state.utils.scrollShouldBeIgnored(e)||(i.state.computedProps.handleScroll(i.scrollable),i.handleScroll(i.state.utils.getScrollTop()))}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"manageScrollTimeouts",function(){i.state.scrollTimeout&&clearTimeout(i.state.scrollTimeout);var e=_assertThisInitialized(_assertThisInitialized(i)),t=setTimeout(function(){e.setState({isScrolling:!1,scrollTimeout:void 0})},i.state.computedProps.timeScrollStateLastsForAfterUserScrolls);i.setState({isScrolling:!0,scrollTimeout:t})}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"getLowestPossibleScrollTop",function(){return i.state.infiniteComputer.getTotalScrollableHeight()-i.state.computedProps.containerHeight}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"hasAllVisibleItems",function(){return!(_isFinite(i.state.computedProps.infiniteLoadBeginEdgeOffset)&&i.state.infiniteComputer.getTotalScrollableHeight()<i.state.computedProps.containerHeight)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"passedEdgeForInfiniteScroll",function(e){var t=i.state.computedProps.infiniteLoadBeginEdgeOffset;return"number"==typeof t&&(i.state.computedProps.displayBottomUpwards?!i.shouldAttachToBottom&&e<t:e>i.state.infiniteComputer.getTotalScrollableHeight()-i.state.computedProps.containerHeight-t)}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"onInfiniteLoad",function(){i.setState({isInfiniteLoading:!0}),i.state.computedProps.onInfiniteLoad()}),_defineProperty(_assertThisInitialized(_assertThisInitialized(i)),"handleScroll",function(e){i.shouldAttachToBottom=i.state.computedProps.displayBottomUpwards&&e>=i.getLowestPossibleScrollTop(),i.manageScrollTimeouts();var t=infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(i.state,e);i.passedEdgeForInfiniteScroll(e)&&!i.state.isInfiniteLoading?(i.setState(Object.assign({},t)),i.onInfiniteLoad()):i.setState(t)});var o=i.recomputeInternalStateFromProps(e);return i.shouldAttachToBottom=e.displayBottomUpwards,o.scrollTimeout=void 0,o.isScrolling=!1,i.state=o,i}return _inherits(t,React.Component),_createClass(t,null,[{key:"containerHeightScaleFactor",value:function(e){if(!_isFinite(e))throw new Error("The scale factor must be a number.");return{type:scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,amount:e}}}]),_createClass(t,[{key:"shouldComponentUpdate",value:function(e,t){var i=this;return this.props===e||(setTimeout(function(){i.setState(i.recomputeInternalStateFromProps(e))},0),!1)}},{key:"getSnapshotBeforeUpdate",value:function(){return this.props.displayBottomUpwards&&(this.preservedScrollState=this.state.utils.getScrollTop()-this.loadingSpinnerHeight),null}},{key:"componentDidUpdate",value:function(e,t){if(this.loadingSpinnerHeight=this.state.utils.getLoadingSpinnerHeight(),!e.useWindowAsScrollContainer&&this.props.useWindowAsScrollContainer&&this.state.utils.subscribeToScrollListener(),this.props.displayBottomUpwards){var i=this.getLowestPossibleScrollTop();this.shouldAttachToBottom&&this.state.utils.getScrollTop()<i?this.state.utils.setScrollTop(i):e.isInfiniteLoading&&!this.props.isInfiniteLoading&&this.state.utils.setScrollTop(this.state.infiniteComputer.getTotalScrollableHeight()-t.infiniteComputer.getTotalScrollableHeight()+this.preservedScrollState)}var o=this.state.numberOfChildren!==t.numberOfChildren;if(o){var r=infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(this.state,this.state.utils.getScrollTop());this.setState(r)}o&&!this.hasAllVisibleItems()&&!this.state.isInfiniteLoading&&this.onInfiniteLoad()}},{key:"componentDidMount",value:function(){if(this.state.utils.subscribeToScrollListener(),this.hasAllVisibleItems()||this.onInfiniteLoad(),this.props.displayBottomUpwards){var e=this.getLowestPossibleScrollTop();this.shouldAttachToBottom&&this.state.utils.getScrollTop()<e&&this.state.utils.setScrollTop(e)}}},{key:"componentWillUnmount",value:function(){this.state.utils.unsubscribeFromScrollListener()}},{key:"render",value:function(){var e,t=this,i=this.state.computedProps;e=this.state.numberOfChildren>1?i.children.slice(this.state.displayIndexStart,this.state.displayIndexEnd+1):i.children;var o={};this.state.isScrolling&&(o.pointerEvents="none");var r=this.state.infiniteComputer.getTopSpacerHeight(this.state.displayIndexStart),n=this.state.infiniteComputer.getBottomSpacerHeight(this.state.displayIndexEnd);if(i.displayBottomUpwards){var s=i.containerHeight-this.state.infiniteComputer.getTotalScrollableHeight();s>0&&(r=s-this.loadingSpinnerHeight)}var l=void 0===i.infiniteLoadBeginEdgeOffset?null:React.createElement("div",{ref:function(e){t.loadingSpinner=e}},this.state.isInfiniteLoading?i.loadingSpinnerDelegate:null);return React.createElement("div",{className:i.className,ref:function(e){t.scrollable=e},style:this.state.utils.buildScrollableStyle(),onScroll:this.state.utils.nodeScrollListener},React.createElement("div",{ref:function(e){t.smoothScrollingWrapper=e},style:o},React.createElement("div",{ref:function(e){t.topSpacer=e},style:infiniteHelpers.buildHeightStyle(r)}),this.props.optionalHeader,i.displayBottomUpwards&&l,e,!i.displayBottomUpwards&&l,React.createElement("div",{ref:function(e){t.bottomSpacer=e},style:infiniteHelpers.buildHeightStyle(n)})))}}]),t}();_defineProperty(Infinite,"propTypes",{children:PropTypes.any,handleScroll:PropTypes.func,preloadBatchSize:PropTypes.oneOfType([PropTypes.number,PropTypes.shape({type:PropTypes.oneOf(["containerHeightScaleFactor"]).isRequired,amount:PropTypes.number.isRequired})]),preloadAdditionalHeight:PropTypes.oneOfType([PropTypes.number,PropTypes.shape({type:PropTypes.oneOf(["containerHeightScaleFactor"]).isRequired,amount:PropTypes.number.isRequired})]),elementHeight:PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]).isRequired,containerHeight:PropTypes.number,useWindowAsScrollContainer:PropTypes.bool,displayBottomUpwards:PropTypes.bool.isRequired,infiniteLoadBeginEdgeOffset:PropTypes.number,onInfiniteLoad:PropTypes.func,loadingSpinnerDelegate:PropTypes.node,optionalHeader:PropTypes.node,isInfiniteLoading:PropTypes.bool,timeScrollStateLastsForAfterUserScrolls:PropTypes.number,className:PropTypes.string,styles:PropTypes.shape({scrollableStyle:PropTypes.object}).isRequired}),_defineProperty(Infinite,"defaultProps",{handleScroll:function(){},useWindowAsScrollContainer:!1,onInfiniteLoad:function(){},loadingSpinnerDelegate:React.createElement("div",null),optionalHeader:React.createElement("div",null),displayBottomUpwards:!1,isInfiniteLoading:!1,timeScrollStateLastsForAfterUserScrolls:150,className:"",styles:{}}),module.exports=Infinite,global.Infinite=Infinite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/checkProps":9,"./utils/establish-polyfills":10,"./utils/infiniteHelpers":11,"./utils/scaleEnum":12,"./utils/window":13,"lodash.isfinite":2,"prop-types":undefined,"react":undefined}],8:[function(require,module,exports){
"use strict";var opts={CLOSEST_LOWER:1,CLOSEST_HIGHER:2},binaryIndexSearch=function(r,t,e){for(var n,o,S,a=r.length-1,s=0;s<=a;){if((S=r[o=s+Math.floor((a-s)/2)])===t)return o;S<t?s=o+1:S>t&&(a=o-1)}return e===opts.CLOSEST_LOWER&&s>0?n=s-1:e===opts.CLOSEST_HIGHER&&a<r.length-1&&(n=a+1),n};module.exports={binaryIndexSearch:binaryIndexSearch,opts:opts};

},{}],9:[function(require,module,exports){
(function (global){
"use strict";var React=global.React||require("react"),_isFinite=require("lodash.isfinite");module.exports=function(e){var r="Invariant Violation: ";if(!e.containerHeight&&!e.useWindowAsScrollContainer)throw new Error(r+"Either containerHeight or useWindowAsScrollContainer must be provided.");if(!_isFinite(e.elementHeight)&&!Array.isArray(e.elementHeight))throw new Error(r+"You must provide either a number or an array of numbers as the elementHeight.");if(Array.isArray(e.elementHeight)&&React.Children.count(e.children)!==e.elementHeight.length)throw new Error(r+"There must be as many values provided in the elementHeight prop as there are children.")};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash.isfinite":2,"react":undefined}],10:[function(require,module,exports){
"use strict";Object.assign||(Object.assign=require("object-assign")),Array.isArray||(Array.isArray=require("lodash.isarray"));

},{"lodash.isarray":1,"object-assign":3}],11:[function(require,module,exports){
(function (global){
"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _objectWithoutProperties(e,t){if(null==e)return{};var o,r,n=_objectWithoutPropertiesLoose(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)o=i[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}function _objectWithoutPropertiesLoose(e,t){if(null==e)return{};var o,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)o=i[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}var ConstantInfiniteComputer=require("../computers/constantInfiniteComputer.js"),ArrayInfiniteComputer=require("../computers/arrayInfiniteComputer.js"),scaleEnum=require("./scaleEnum"),React=global.React||require("react"),window=require("./window");function createInfiniteComputer(e,t){var o=React.Children.count(t);return Array.isArray(e)?new ArrayInfiniteComputer(e,o):new ConstantInfiniteComputer(e,o)}function recomputeApertureStateFromOptionsAndScrollTop(e,t){var o=e.preloadBatchSize,r=e.preloadAdditionalHeight,n=e.infiniteComputer,i=o*(0===o?0:Math.floor(t/o)),a=i+o,l=Math.max(0,i-r),u=Math.min(n.getTotalScrollableHeight(),a+r);return{displayIndexStart:n.getDisplayIndexStart(l),displayIndexEnd:n.getDisplayIndexEnd(u)}}function generateComputedProps(e){var t=e.containerHeight,o=e.preloadBatchSize,r=e.preloadAdditionalHeight,n=e.handleScroll,i=e.onInfiniteLoad,a=_objectWithoutProperties(e,["containerHeight","preloadBatchSize","preloadAdditionalHeight","handleScroll","onInfiniteLoad"]),l={};t="number"==typeof t?t:0,l.containerHeight=e.useWindowAsScrollContainer?window.innerHeight:t,l.handleScroll=n||function(){},l.onInfiniteLoad=i||function(){};var u={type:scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,amount:.5},p=o&&o.type?o:u;"number"==typeof o?l.preloadBatchSize=o:"object"===_typeof(p)&&p.type===scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR?l.preloadBatchSize=l.containerHeight*p.amount:l.preloadBatchSize=0;var c={type:scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,amount:1},d=r&&r.type?r:c;return"number"==typeof r?l.preloadAdditionalHeight=r:"object"===_typeof(d)&&d.type===scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR?l.preloadAdditionalHeight=l.containerHeight*d.amount:l.preloadAdditionalHeight=0,Object.assign(a,l)}function buildHeightStyle(e){return{width:"100%",height:Math.ceil(e)}}module.exports={createInfiniteComputer:createInfiniteComputer,recomputeApertureStateFromOptionsAndScrollTop:recomputeApertureStateFromOptionsAndScrollTop,generateComputedProps:generateComputedProps,buildHeightStyle:buildHeightStyle};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../computers/arrayInfiniteComputer.js":4,"../computers/constantInfiniteComputer.js":5,"./scaleEnum":12,"./window":13,"react":undefined}],12:[function(require,module,exports){
"use strict";module.exports={CONTAINER_HEIGHT_SCALE_FACTOR:"containerHeightScaleFactor"};

},{}],13:[function(require,module,exports){
(function (global){
"use strict";var win;win="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},module.exports=win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[7])(7)
});
