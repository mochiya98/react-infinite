"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = global.React || require('react');

var PropTypes = global.PropTypes || require('prop-types');

var window = require('./utils/window');

require('./utils/establish-polyfills');

var scaleEnum = require('./utils/scaleEnum');

var infiniteHelpers = require('./utils/infiniteHelpers');

var _isFinite = require('lodash.isfinite');

var checkProps = require('./utils/checkProps');

var Infinite =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Infinite, _React$Component);

  _createClass(Infinite, null, [{
    key: "containerHeightScaleFactor",
    value: function containerHeightScaleFactor(factor) {
      if (!_isFinite(factor)) {
        throw new Error('The scale factor must be a number.');
      }

      return {
        type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
        amount: factor
      };
    }
  }]);

  function Infinite(_props) {
    var _this;

    _classCallCheck(this, Infinite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Infinite).call(this, _props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "computedProps", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "utils", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "shouldAttachToBottom", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "preservedScrollState", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadingSpinnerHeight", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollable", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "topSpacer", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "bottomSpacer", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "smoothScrollingWrapper", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadingSpinner", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "generateComputedUtilityFunctions", function (props) {
      var utilities = {};

      utilities.getLoadingSpinnerHeight = function () {
        var loadingSpinnerHeight = 0;

        if (_this.loadingSpinner) {
          loadingSpinnerHeight = _this.loadingSpinner.offsetHeight || 0;
        }

        return loadingSpinnerHeight;
      };

      if (props.useWindowAsScrollContainer) {
        utilities.subscribeToScrollListener = function () {
          window.addEventListener('scroll', _this.infiniteHandleScroll);
        };

        utilities.unsubscribeFromScrollListener = function () {
          window.removeEventListener('scroll', _this.infiniteHandleScroll);
        };

        utilities.nodeScrollListener = function () {};

        utilities.getScrollTop = function () {
          return window.pageYOffset;
        };

        utilities.setScrollTop = function (top) {
          window.scroll(window.pageXOffset, top);
        };

        utilities.scrollShouldBeIgnored = function () {
          return false;
        };

        utilities.buildScrollableStyle = function () {
          return {};
        };
      } else {
        utilities.subscribeToScrollListener = function () {};

        utilities.unsubscribeFromScrollListener = function () {};

        utilities.nodeScrollListener = _this.infiniteHandleScroll;

        utilities.getScrollTop = function () {
          return _this.scrollable ? _this.scrollable.scrollTop : 0;
        };

        utilities.setScrollTop = function (top) {
          if (_this.scrollable) {
            _this.scrollable.scrollTop = top;
          }
        };

        utilities.scrollShouldBeIgnored = function (event) {
          return event.target !== _this.scrollable;
        };

        utilities.buildScrollableStyle = function () {
          return Object.assign({}, {
            height: _this.state.computedProps.containerHeight,
            overflowX: 'hidden',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch'
          }, _this.state.computedProps.styles.scrollableStyle || {});
        };
      }

      return utilities;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "recomputeInternalStateFromProps", function (props) {
      checkProps(props);
      var computedProps = infiniteHelpers.generateComputedProps(props);

      var utils = _this.generateComputedUtilityFunctions(props);

      var newState = {
        computedProps: computedProps,
        utils: utils
      };
      newState.numberOfChildren = React.Children.count(computedProps.children);
      newState.infiniteComputer = infiniteHelpers.createInfiniteComputer(computedProps.elementHeight, computedProps.children);

      if (computedProps.isInfiniteLoading !== undefined) {
        newState.isInfiniteLoading = computedProps.isInfiniteLoading;
      }

      newState.preloadBatchSize = computedProps.preloadBatchSize;
      newState.preloadAdditionalHeight = computedProps.preloadAdditionalHeight;
      newState = Object.assign(newState, infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(newState, utils.getScrollTop()));
      return newState;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "infiniteHandleScroll", function (e) {
      if (_this.state.utils.scrollShouldBeIgnored(e)) {
        return;
      }

      _this.state.computedProps.handleScroll(_this.scrollable);

      _this.handleScroll(_this.state.utils.getScrollTop());
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "manageScrollTimeouts", function () {
      // Maintains a series of timeouts to set this.state.isScrolling
      // to be true when the element is scrolling.
      if (_this.state.scrollTimeout) {
        clearTimeout(_this.state.scrollTimeout);
      }

      var that = _assertThisInitialized(_assertThisInitialized(_this)),
          scrollTimeout = setTimeout(function () {
        that.setState({
          isScrolling: false,
          scrollTimeout: undefined
        });
      }, _this.state.computedProps.timeScrollStateLastsForAfterUserScrolls);

      _this.setState({
        isScrolling: true,
        scrollTimeout: scrollTimeout
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getLowestPossibleScrollTop", function () {
      return _this.state.infiniteComputer.getTotalScrollableHeight() - _this.state.computedProps.containerHeight;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hasAllVisibleItems", function () {
      return !(_isFinite(_this.state.computedProps.infiniteLoadBeginEdgeOffset) && _this.state.infiniteComputer.getTotalScrollableHeight() < _this.state.computedProps.containerHeight);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "passedEdgeForInfiniteScroll", function (scrollTop) {
      var edgeOffset = _this.state.computedProps.infiniteLoadBeginEdgeOffset;

      if (typeof edgeOffset !== 'number') {
        return false;
      }

      if (_this.state.computedProps.displayBottomUpwards) {
        return !_this.shouldAttachToBottom && scrollTop < edgeOffset;
      } else {
        return scrollTop > _this.state.infiniteComputer.getTotalScrollableHeight() - _this.state.computedProps.containerHeight - edgeOffset;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onInfiniteLoad", function () {
      _this.setState({
        isInfiniteLoading: true
      });

      _this.state.computedProps.onInfiniteLoad();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScroll", function (scrollTop) {
      _this.shouldAttachToBottom = _this.state.computedProps.displayBottomUpwards && scrollTop >= _this.getLowestPossibleScrollTop();

      _this.manageScrollTimeouts();

      var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(_this.state, scrollTop);

      if (_this.passedEdgeForInfiniteScroll(scrollTop) && !_this.state.isInfiniteLoading) {
        _this.setState(Object.assign({}, newApertureState));

        _this.onInfiniteLoad();
      } else {
        _this.setState(newApertureState);
      }
    });

    var state = _this.recomputeInternalStateFromProps(_props);

    _this.shouldAttachToBottom = _props.displayBottomUpwards;
    state.scrollTimeout = undefined;
    state.isScrolling = false;
    _this.state = state;
    return _this;
  } // Properties currently used but which may be
  // refactored away in the future.


  _createClass(Infinite, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _this2 = this;

      if (this.props !== nextProps) {
        setTimeout(function () {
          _this2.setState(_this2.recomputeInternalStateFromProps(nextProps));
        }, 0);
        return false;
      }

      return true;
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate() {
      if (this.props.displayBottomUpwards) {
        this.preservedScrollState = this.state.utils.getScrollTop() - this.loadingSpinnerHeight;
      }

      return null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.loadingSpinnerHeight = this.state.utils.getLoadingSpinnerHeight();

      if (!prevProps.useWindowAsScrollContainer && this.props.useWindowAsScrollContainer) {
        this.state.utils.subscribeToScrollListener();
      }

      if (this.props.displayBottomUpwards) {
        var lowestScrollTop = this.getLowestPossibleScrollTop();

        if (this.shouldAttachToBottom && this.state.utils.getScrollTop() < lowestScrollTop) {
          this.state.utils.setScrollTop(lowestScrollTop);
        } else if (prevProps.isInfiniteLoading && !this.props.isInfiniteLoading) {
          this.state.utils.setScrollTop(this.state.infiniteComputer.getTotalScrollableHeight() - prevState.infiniteComputer.getTotalScrollableHeight() + this.preservedScrollState);
        }
      }

      var hasLoadedMoreChildren = this.state.numberOfChildren !== prevState.numberOfChildren;

      if (hasLoadedMoreChildren) {
        var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(this.state, this.state.utils.getScrollTop());
        this.setState(newApertureState);
      }

      var isMissingVisibleRows = hasLoadedMoreChildren && !this.hasAllVisibleItems() && !this.state.isInfiniteLoading;

      if (isMissingVisibleRows) {
        this.onInfiniteLoad();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.state.utils.subscribeToScrollListener();

      if (!this.hasAllVisibleItems()) {
        this.onInfiniteLoad();
      }

      if (this.props.displayBottomUpwards) {
        var lowestScrollTop = this.getLowestPossibleScrollTop();

        if (this.shouldAttachToBottom && this.state.utils.getScrollTop() < lowestScrollTop) {
          this.state.utils.setScrollTop(lowestScrollTop);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.state.utils.unsubscribeFromScrollListener();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var displayables;
      var computedProps = this.state.computedProps;

      if (this.state.numberOfChildren > 1) {
        displayables = computedProps.children.slice(this.state.displayIndexStart, this.state.displayIndexEnd + 1);
      } else {
        displayables = computedProps.children;
      }

      var infiniteScrollStyles = {};

      if (this.state.isScrolling) {
        infiniteScrollStyles.pointerEvents = 'none';
      }

      var topSpacerHeight = this.state.infiniteComputer.getTopSpacerHeight(this.state.displayIndexStart),
          bottomSpacerHeight = this.state.infiniteComputer.getBottomSpacerHeight(this.state.displayIndexEnd); // This asymmetry is due to a reluctance to use CSS to control
      // the bottom alignment

      if (computedProps.displayBottomUpwards) {
        var heightDifference = computedProps.containerHeight - this.state.infiniteComputer.getTotalScrollableHeight();

        if (heightDifference > 0) {
          topSpacerHeight = heightDifference - this.loadingSpinnerHeight;
        }
      }

      var loadingSpinner = computedProps.infiniteLoadBeginEdgeOffset === undefined ? null : React.createElement("div", {
        ref: function ref(c) {
          _this3.loadingSpinner = c;
        }
      }, this.state.isInfiniteLoading ? computedProps.loadingSpinnerDelegate : null); // topSpacer and bottomSpacer take up the amount of space that the
      // rendered elements would have taken up otherwise

      return React.createElement("div", {
        className: computedProps.className,
        ref: function ref(c) {
          _this3.scrollable = c;
        },
        style: this.state.utils.buildScrollableStyle(),
        onScroll: this.state.utils.nodeScrollListener
      }, React.createElement("div", {
        ref: function ref(c) {
          _this3.smoothScrollingWrapper = c;
        },
        style: infiniteScrollStyles
      }, React.createElement("div", {
        ref: function ref(c) {
          _this3.topSpacer = c;
        },
        style: infiniteHelpers.buildHeightStyle(topSpacerHeight)
      }), this.props.optionalHeader, computedProps.displayBottomUpwards && loadingSpinner, displayables, !computedProps.displayBottomUpwards && loadingSpinner, React.createElement("div", {
        ref: function ref(c) {
          _this3.bottomSpacer = c;
        },
        style: infiniteHelpers.buildHeightStyle(bottomSpacerHeight)
      })));
    }
  }]);

  return Infinite;
}(React.Component);

_defineProperty(Infinite, "propTypes", {
  children: PropTypes.any,
  handleScroll: PropTypes.func,
  // preloadBatchSize causes updates only to
  // happen each preloadBatchSize pixels of scrolling.
  // Set a larger number to cause fewer updates to the
  // element list.
  preloadBatchSize: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
    amount: PropTypes.number.isRequired
  })]),
  // preloadAdditionalHeight determines how much of the
  // list above and below the container is preloaded even
  // when it is not currently visible to the user. In the
  // regular scroll implementation, preloadAdditionalHeight
  // is equal to the entire height of the list.
  preloadAdditionalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
    amount: PropTypes.number.isRequired
  })]),
  // page to screen ratio
  // The provided elementHeight can be either
  //  1. a constant: all elements are the same height
  //  2. an array containing the height of each element
  elementHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  // This is the total height of the visible window. One
  // of
  containerHeight: PropTypes.number,
  useWindowAsScrollContainer: PropTypes.bool,
  displayBottomUpwards: PropTypes.bool.isRequired,
  infiniteLoadBeginEdgeOffset: PropTypes.number,
  onInfiniteLoad: PropTypes.func,
  loadingSpinnerDelegate: PropTypes.node,
  optionalHeader: PropTypes.node,
  isInfiniteLoading: PropTypes.bool,
  timeScrollStateLastsForAfterUserScrolls: PropTypes.number,
  className: PropTypes.string,
  styles: PropTypes.shape({
    scrollableStyle: PropTypes.object
  }).isRequired
});

_defineProperty(Infinite, "defaultProps", {
  handleScroll: function handleScroll() {},
  useWindowAsScrollContainer: false,
  onInfiniteLoad: function onInfiniteLoad() {},
  loadingSpinnerDelegate: React.createElement("div", null),
  optionalHeader: React.createElement("div", null),
  displayBottomUpwards: false,
  isInfiniteLoading: false,
  timeScrollStateLastsForAfterUserScrolls: 150,
  className: '',
  styles: {}
});

module.exports = Infinite;
global.Infinite = Infinite;