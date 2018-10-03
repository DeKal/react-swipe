import React from 'react';
import ReactDOM from 'react-dom';
import ReactSwipe from './reactSwipe';

jest.useFakeTimers();

const renderIntoDocument = (component, root) => {
  if (!root) {
    root = document.createElement('div');
    document.body.appendChild(root);
  }

  ReactDOM.render(component, root);
  return root;
};

describe('ReactSwipe', () => {
  it('renders without crashing', () => {
    renderIntoDocument(<ReactSwipe className="my-swipe-component" />);
  });

  it('renders all the children correctly', () => {
    expect(
      renderIntoDocument(
        <ReactSwipe className="product-carousel">
          <img alt="img1" src="./image1.png" />
        </ReactSwipe>
      ).outerHTML
    ).toMatchSnapshot();

    expect(
      renderIntoDocument(
        <ReactSwipe className="product-carousel">
          <img alt="img1" src="./image1.png" />
          <img alt="img2" src="./image2.png" />
          <img alt="img3" src="./image3.png" />
        </ReactSwipe>
      ).outerHTML
    ).toMatchSnapshot();

    expect(
      renderIntoDocument(
        <ReactSwipe className="product-carousel">
          <div style={{ background: 'red' }}>
            <img alt="img1" src="./image1.png" />
          </div>
          <div style={{ background: 'red' }}>
            <img alt="img2" src="./image2.png" />
          </div>
          <div style={{ background: 'red' }}>
            <img alt="img3" src="./image3.png" />
          </div>
        </ReactSwipe>
      ).outerHTML
    ).toMatchSnapshot();
  });

  it('dupplicates the children when there are exactly 2 were set', () => {
    const div = renderIntoDocument(
      <ReactSwipe className="product-carousel">
        <div style={{ background: 'red' }}>
          <img alt="img1" src="./image1.png" />
        </div>
        <div style={{ background: 'red' }}>
          <img alt="img2" src="./image2.png" />
        </div>
      </ReactSwipe>
    );

    expect(div.outerHTML).toMatchSnapshot();

    // 2 elements is dupplicated
    expect(div.querySelectorAll('img[alt="img1"]').length).toBe(2);
    expect(div.querySelectorAll('img[alt="img2"]').length).toBe(2);
  });

  it('handles the chidren internal updates correctly when there are 2 childs', () => {
    class LazyImage extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          loaded: props.loaded
        };

        if (!props.loaded) {
          setTimeout(() => {
            this.setState({
              loaded: true
            });
          }, 1500);
        }
      }

      render() {
        const { src } = this.props;
        const { loaded } = this.state;

        // XXX the component should have a wrapper, avoid losing all the attribute set by swipe
        return (
          <div className="lazy-image" src={src}>
            {loaded ? <img src={src} /> : <span src={src}>loading</span>}{' '}
          </div>
        );
      }
    }

    const div = renderIntoDocument(
      <ReactSwipe className="product-carousel">
        <LazyImage src="img1" loaded />
        <LazyImage src="img2" loaded={false} />
      </ReactSwipe>
    );

    expect(div.outerHTML).toMatchSnapshot();
    expect(div.querySelectorAll('img[src="img1"]').length).toBe(2);

    // image2 is not loaded, we only see a span
    expect(div.querySelectorAll('img[src="img2"]').length).toBe(0);
    expect(div.querySelectorAll('span[src="img2"]').length).toBe(2);

    // update LazyImage state by timer
    jest.runAllTimers();

    expect(div.outerHTML).toMatchSnapshot();
    expect(div.querySelectorAll('img[src="img1"]').length).toBe(2);

    // image2 is now loaded
    expect(div.querySelectorAll('span[src="img2"]').length).toBe(0);
    expect(div.querySelectorAll('img[src="img2"]').length).toBe(2);

    // its wrapper keep the original attr
    const wrappers = div.querySelectorAll('.lazy-image[src="img2"]');
    expect(wrappers[0].getAttribute('data-index')).toBe('1');
    expect(wrappers[1].getAttribute('data-index')).toBe('3');
  });

  it('handle props update correctly when 2 childs are set', () => {
    class LazyProduct extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          loaded: false
        };

        // update product state
        setTimeout(() => {
          this.setState({
            loaded: true
          });
        }, 1500);
      }

      render() {
        const { loaded } = this.state;
        return (
          <ReactSwipe>
            <img src="img1" />
            {loaded ? <img src="img2" /> : <span src="img2">loading</span>}
          </ReactSwipe>
        );
      }
    }

    const div = renderIntoDocument(<LazyProduct />);

    expect(div.outerHTML).toMatchSnapshot();
    expect(div.querySelectorAll('img[src="img1"]').length).toBe(2);

    // image2 is not loaded, we only see a span
    expect(div.querySelectorAll('img[src="img2"]').length).toBe(0);
    expect(div.querySelectorAll('span[src="img2"]').length).toBe(2);

    // update LazyImage state by timer
    jest.runAllTimers();

    expect(div.outerHTML).toMatchSnapshot();
    expect(div.querySelectorAll('img[src="img1"]').length).toBe(2);

    // image2 is now loaded
    expect(div.querySelectorAll('span[src="img2"]').length).toBe(0);
    expect(div.querySelectorAll('img[src="img2"]').length).toBe(2);

    // images2 and its clone keep the original attr
    const images = div.querySelectorAll('img[src="img2"]');
    expect(images[0].getAttribute('data-index')).toBe('1');
    expect(images[1].getAttribute('data-index')).toBe('3');
  });
});
