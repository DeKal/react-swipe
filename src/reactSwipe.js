import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Swipe from 'swipe-js-iso';

class ReactSwipe extends Component {
  static propTypes = {
    swipeOptions: PropTypes.shape({
      startSlide: PropTypes.number,
      speed: PropTypes.number,
      auto: PropTypes.number,
      continuous: PropTypes.bool,
      disableScroll: PropTypes.bool,
      stopPropagation: PropTypes.bool,
      swiping: PropTypes.func,
      callback: PropTypes.func,
      transitionEnd: PropTypes.func
    }),
    style: PropTypes.shape({
      container: PropTypes.object,
      wrapper: PropTypes.object,
      child: PropTypes.object
    }),
    id: PropTypes.string,
    className: PropTypes.string,
    swipeKey: PropTypes.string
  };

  static defaultProps = {
    swipeOptions: {},
    style: {
      container: {
        overflow: 'hidden',
        visibility: 'hidden',
        position: 'relative'
      },

      wrapper: {
        overflow: 'hidden',
        position: 'relative'
      },

      child: {
        float: 'left',
        width: '100%',
        position: 'relative',
        transitionProperty: 'transform'
      }
    },
    className: '',
    swipeKey: null
  };

  componentDidMount() {
    const { swipeOptions } = this.props;

    this.swipe = Swipe(this.container, swipeOptions);
  }

  componentDidUpdate(prevProps) {
    const { swipeKey, children } = this.props;

    if (
      prevProps.swipeKey !== swipeKey ||
      (children.length == 2 && prevProps.children !== children)
    ) {
      // just setup again
      this.swipe.setup();
    }
  }

  componentWillUnmount() {
    this.swipe.kill();
    this.swipe = void 0;
  }

  next() {
    setTimeout(this.swipe.next, 0);
  }

  prev() {
    setTimeout(this.swipe.prev, 0);
  }

  slide(...args) {
    this.swipe.slide(...args);
  }

  getPos() {
    return this.swipe.getPos();
  }

  getNumSlides() {
    return this.swipe.getNumSlides();
  }

  renderChildren() {
    const { children, style } = this.props;

    if (!children) {
      return null;
    }

    const childCount = children.length;
    let allChildren = children;

    if (childCount === 2) {
      // special case, we dupplicate the children to avoid outdated cloning in swipe.js
      allChildren = [...children, ...children];
    }

    return React.Children.map(allChildren, (child, idx) => {
      if (!child) {
        return null;
      }

      return React.cloneElement(child, {
        key: idx,
        style: {
          ...style.child,
          ...child.props.style
        }
      });
    });
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <div
        ref={el => {
          this.container = el;
        }}
        id={id}
        className={`react-swipe-container ${className}`}
        style={style.container}
      >
        <div style={style.wrapper}>{this.renderChildren()}</div>
      </div>
    );
  }
}

export default ReactSwipe;
