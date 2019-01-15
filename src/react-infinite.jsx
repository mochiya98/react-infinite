/* @flow */

var React = global.React || require('react');
var PropTypes = global.PropTypes || require('prop-types');

var window = require('./utils/window');

require('./utils/establish-polyfills');
var scaleEnum = require('./utils/scaleEnum');
var infiniteHelpers = require('./utils/infiniteHelpers');
var _isFinite = require('lodash.isfinite');

var checkProps = require('./utils/checkProps');

class Infinite extends React.Component<
  ReactInfiniteProvidedDefaultProps,
  ReactInfiniteProps,
  ReactInfiniteState
> {
  state: ReactInfiniteState;

  static propTypes = {
    children: PropTypes.any,

    handleScroll: PropTypes.func,

    // preloadBatchSize causes updates only to
    // happen each preloadBatchSize pixels of scrolling.
    // Set a larger number to cause fewer updates to the
    // element list.
    preloadBatchSize: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
        amount: PropTypes.number.isRequired
      })
    ]),
    // preloadAdditionalHeight determines how much of the
    // list above and below the container is preloaded even
    // when it is not currently visible to the user. In the
    // regular scroll implementation, preloadAdditionalHeight
    // is equal to the entire height of the list.
    preloadAdditionalHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
        amount: PropTypes.number.isRequired
      })
    ]), // page to screen ratio

    // The provided elementHeight can be either
    //  1. a constant: all elements are the same height
    //  2. an array containing the height of each element
    elementHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]).isRequired,
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
  };

  static containerHeightScaleFactor(factor) {
    if (!_isFinite(factor)) {
      throw new Error('The scale factor must be a number.');
    }
    return {
      type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
      amount: factor
    };
  }

  static defaultProps = {
    handleScroll: () => {},

    useWindowAsScrollContainer: false,

    onInfiniteLoad: () => {},
    loadingSpinnerDelegate: <div />,
    optionalHeader: <div />,

    displayBottomUpwards: false,

    isInfiniteLoading: false,
    timeScrollStateLastsForAfterUserScrolls: 150,

    className: '',

    styles: {}
  };

  constructor(props: ReactInfiniteProps) {
    super(props);
    const state = this.recomputeInternalStateFromProps(props);

    this.shouldAttachToBottom = props.displayBottomUpwards;

    state.scrollTimeout = undefined;
    state.isScrolling = false;

    this.state = state;
  }

  // Properties currently used but which may be
  // refactored away in the future.
  computedProps: ReactInfiniteComputedProps;

  utils: ReactInfiniteUtilityFunctions;

  shouldAttachToBottom = false;

  preservedScrollState = 0;

  loadingSpinnerHeight = 0;

  // Refs
  scrollable: HTMLDivElement;

  topSpacer: HTMLDivElement;

  bottomSpacer: HTMLDivElement;

  smoothScrollingWrapper: HTMLDivElement;

  loadingSpinner: HTMLDivElement;

  generateComputedUtilityFunctions = (
    props: ReactInfiniteProps
  ): ReactInfiniteUtilityFunctions => {
    var utilities = {};
    utilities.getLoadingSpinnerHeight = () => {
      var loadingSpinnerHeight = 0;
      if (this.loadingSpinner) {
        loadingSpinnerHeight = this.loadingSpinner.offsetHeight || 0;
      }
      return loadingSpinnerHeight;
    };
    if (props.useWindowAsScrollContainer) {
      utilities.subscribeToScrollListener = () => {
        window.addEventListener('scroll', this.infiniteHandleScroll);
      };
      utilities.unsubscribeFromScrollListener = () => {
        window.removeEventListener('scroll', this.infiniteHandleScroll);
      };
      utilities.nodeScrollListener = () => {};
      utilities.getScrollTop = () => window.pageYOffset;
      utilities.setScrollTop = top => {
        window.scroll(window.pageXOffset, top);
      };
      utilities.scrollShouldBeIgnored = () => false;
      utilities.buildScrollableStyle = () => ({});
    } else {
      utilities.subscribeToScrollListener = () => {};
      utilities.unsubscribeFromScrollListener = () => {};
      utilities.nodeScrollListener = this.infiniteHandleScroll;
      utilities.getScrollTop = () => {
        return this.scrollable ? this.scrollable.scrollTop : 0;
      };

      utilities.setScrollTop = top => {
        if (this.scrollable) {
          this.scrollable.scrollTop = top;
        }
      };
      utilities.scrollShouldBeIgnored = event =>
        event.target !== this.scrollable;

      utilities.buildScrollableStyle = () => {
        return Object.assign(
          {},
          {
            height: this.state.computedProps.containerHeight,
            overflowX: 'hidden',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch'
          },
          this.state.computedProps.styles.scrollableStyle || {}
        );
      };
    }
    return utilities;
  };

  recomputeInternalStateFromProps = (
    props: ReactInfiniteProps
  ): ReactInfiniteState => {
    checkProps(props);
    var computedProps = infiniteHelpers.generateComputedProps(props);
    var utils: ReactInfiniteUtilityFunctions = this.generateComputedUtilityFunctions(
      props
    );

    var newState = { computedProps, utils };

    newState.numberOfChildren = React.Children.count(computedProps.children);
    newState.infiniteComputer = infiniteHelpers.createInfiniteComputer(
      computedProps.elementHeight,
      computedProps.children
    );

    if (computedProps.isInfiniteLoading !== undefined) {
      newState.isInfiniteLoading = computedProps.isInfiniteLoading;
    }

    newState.preloadBatchSize = computedProps.preloadBatchSize;
    newState.preloadAdditionalHeight = computedProps.preloadAdditionalHeight;

    newState = Object.assign(
      newState,
      infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(
        newState,
        utils.getScrollTop()
      )
    );

    return newState;
  };

  shouldComponentUpdate(
    nextProps: ReactInfiniteProps,
    nextState: ReactInfiniteState
  ) {
    if (this.props !== nextProps) {
      setTimeout(() => {
        this.setState(this.recomputeInternalStateFromProps(nextProps));
      }, 0);
      return false;
    }
    return true;
  }

  getSnapshotBeforeUpdate() {
    if (this.props.displayBottomUpwards) {
      this.preservedScrollState =
        this.state.utils.getScrollTop() - this.loadingSpinnerHeight;
    }
    return null;
  }

  componentDidUpdate(
    prevProps: ReactInfiniteProps,
    prevState: ReactInfiniteState
  ) {
    this.loadingSpinnerHeight = this.state.utils.getLoadingSpinnerHeight();

    if (
      !prevProps.useWindowAsScrollContainer &&
      this.props.useWindowAsScrollContainer
    ) {
      this.state.utils.subscribeToScrollListener();
    }

    if (this.props.displayBottomUpwards) {
      var lowestScrollTop = this.getLowestPossibleScrollTop();
      if (
        this.shouldAttachToBottom &&
        this.state.utils.getScrollTop() < lowestScrollTop
      ) {
        this.state.utils.setScrollTop(lowestScrollTop);
      } else if (prevProps.isInfiniteLoading && !this.props.isInfiniteLoading) {
        this.state.utils.setScrollTop(
          this.state.infiniteComputer.getTotalScrollableHeight() -
            prevState.infiniteComputer.getTotalScrollableHeight() +
            this.preservedScrollState
        );
      }
    }

    const hasLoadedMoreChildren =
      this.state.numberOfChildren !== prevState.numberOfChildren;
    if (hasLoadedMoreChildren) {
      var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(
        this.state,
        this.state.utils.getScrollTop()
      );
      this.setState(newApertureState);
    }

    const isMissingVisibleRows =
      hasLoadedMoreChildren &&
      !this.hasAllVisibleItems() &&
      !this.state.isInfiniteLoading;
    if (isMissingVisibleRows) {
      this.onInfiniteLoad();
    }
  }

  componentDidMount() {
    this.state.utils.subscribeToScrollListener();

    if (!this.hasAllVisibleItems()) {
      this.onInfiniteLoad();
    }

    if (this.props.displayBottomUpwards) {
      var lowestScrollTop = this.getLowestPossibleScrollTop();
      if (
        this.shouldAttachToBottom &&
        this.state.utils.getScrollTop() < lowestScrollTop
      ) {
        this.state.utils.setScrollTop(lowestScrollTop);
      }
    }
  }

  componentWillUnmount() {
    this.state.utils.unsubscribeFromScrollListener();
  }

  infiniteHandleScroll = (e: SyntheticEvent) => {
    if (this.state.utils.scrollShouldBeIgnored(e)) {
      return;
    }
    this.state.computedProps.handleScroll(this.scrollable);
    this.handleScroll(this.state.utils.getScrollTop());
  };

  manageScrollTimeouts = () => {
    // Maintains a series of timeouts to set this.state.isScrolling
    // to be true when the element is scrolling.

    if (this.state.scrollTimeout) {
      clearTimeout(this.state.scrollTimeout);
    }

    var that = this,
      scrollTimeout = setTimeout(() => {
        that.setState({
          isScrolling: false,
          scrollTimeout: undefined
        });
      }, this.state.computedProps.timeScrollStateLastsForAfterUserScrolls);

    this.setState({
      isScrolling: true,
      scrollTimeout: scrollTimeout
    });
  };

  getLowestPossibleScrollTop = (): number => {
    return (
      this.state.infiniteComputer.getTotalScrollableHeight() -
      this.state.computedProps.containerHeight
    );
  };

  hasAllVisibleItems = (): boolean => {
    return !(
      _isFinite(this.state.computedProps.infiniteLoadBeginEdgeOffset) &&
      this.state.infiniteComputer.getTotalScrollableHeight() <
        this.state.computedProps.containerHeight
    );
  };

  passedEdgeForInfiniteScroll = (scrollTop: number): boolean => {
    const edgeOffset = this.state.computedProps.infiniteLoadBeginEdgeOffset;
    if (typeof edgeOffset !== 'number') {
      return false;
    }

    if (this.state.computedProps.displayBottomUpwards) {
      return !this.shouldAttachToBottom && scrollTop < edgeOffset;
    } else {
      return (
        scrollTop >
        this.state.infiniteComputer.getTotalScrollableHeight() -
          this.state.computedProps.containerHeight -
          edgeOffset
      );
    }
  };

  onInfiniteLoad = () => {
    this.setState({ isInfiniteLoading: true });
    this.state.computedProps.onInfiniteLoad();
  };

  handleScroll = (scrollTop: number) => {
    this.shouldAttachToBottom =
      this.state.computedProps.displayBottomUpwards &&
      scrollTop >= this.getLowestPossibleScrollTop();

    this.manageScrollTimeouts();

    var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(
      this.state,
      scrollTop
    );

    if (
      this.passedEdgeForInfiniteScroll(scrollTop) &&
      !this.state.isInfiniteLoading
    ) {
      this.setState(Object.assign({}, newApertureState));
      this.onInfiniteLoad();
    } else {
      this.setState(newApertureState);
    }
  };

  render() {
    var displayables;
    var computedProps = this.state.computedProps;
    if (this.state.numberOfChildren > 1) {
      displayables = computedProps.children.slice(
        this.state.displayIndexStart,
        this.state.displayIndexEnd + 1
      );
    } else {
      displayables = computedProps.children;
    }

    var infiniteScrollStyles = {};
    if (this.state.isScrolling) {
      infiniteScrollStyles.pointerEvents = 'none';
    }

    var topSpacerHeight = this.state.infiniteComputer.getTopSpacerHeight(
        this.state.displayIndexStart
      ),
      bottomSpacerHeight = this.state.infiniteComputer.getBottomSpacerHeight(
        this.state.displayIndexEnd
      );

    // This asymmetry is due to a reluctance to use CSS to control
    // the bottom alignment
    if (computedProps.displayBottomUpwards) {
      var heightDifference =
        computedProps.containerHeight -
        this.state.infiniteComputer.getTotalScrollableHeight();
      if (heightDifference > 0) {
        topSpacerHeight = heightDifference - this.loadingSpinnerHeight;
      }
    }

    var loadingSpinner =
      computedProps.infiniteLoadBeginEdgeOffset === undefined ? null : (
        <div
          ref={c => {
            this.loadingSpinner = c;
          }}
        >
          {this.state.isInfiniteLoading
            ? computedProps.loadingSpinnerDelegate
            : null}
        </div>
      );

    // topSpacer and bottomSpacer take up the amount of space that the
    // rendered elements would have taken up otherwise
    return (
      <div
        className={computedProps.className}
        ref={c => {
          this.scrollable = c;
        }}
        style={this.state.utils.buildScrollableStyle()}
        onScroll={this.state.utils.nodeScrollListener}
      >
        <div
          ref={c => {
            this.smoothScrollingWrapper = c;
          }}
          style={infiniteScrollStyles}
        >
          <div
            ref={c => {
              this.topSpacer = c;
            }}
            style={infiniteHelpers.buildHeightStyle(topSpacerHeight)}
          />
          {this.props.optionalHeader}
          {computedProps.displayBottomUpwards && loadingSpinner}
          {displayables}
          {!computedProps.displayBottomUpwards && loadingSpinner}
          <div
            ref={c => {
              this.bottomSpacer = c;
            }}
            style={infiniteHelpers.buildHeightStyle(bottomSpacerHeight)}
          />
        </div>
      </div>
    );
  }
}

module.exports = Infinite;
global.Infinite = Infinite;
