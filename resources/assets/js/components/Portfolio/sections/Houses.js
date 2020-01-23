import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { URLS } from '../../../constants/urls';

import Pattern from '../parts/Pattern';

const style = {
  outter: {
    backgroundPosition: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    height: '100vh'
  },
  bgLayerStyle: {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    overflow: 'hidden',
    background: 'rgba(0,0,0, 0.4)'
  }
};

const { outter, bgLayerStyle } = style;

class Houses extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      page: { page }
    } = nextProps;

    if (page === URLS.houses) {
      $('#fp-nav ul li a span').addClass('houses-bg');
    } else {
      $('#fp-nav ul li a span').removeClass('houses-bg');
    }
  }

  render() {
    return (
      <div style={outter}>
        <div style={bgLayerStyle} />
        <Pattern
          classname="Houses"
          logo={null}
          logoText="HOOMES"
          url=""
          effectClassIn="zoomIn"
          effectClassOut="zoomOut"
          technologies={() => <div className="technologies" />}
          description={() => (
            <div className="description">
              <p>I have developed the project, including the development of the backend part on Laravel, and the frontend on VueJs; design of architecture; code review of team members</p>
            </div>
          )}
          figure={() => <div />}
          logoDescription={() => <p className="paragraph">The system for design and buying a construction project of building</p>}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ page }) => ({ page });

Houses.propTypes = {
  page: PropTypes.shape({
    page: PropTypes.string
  })
};

Houses.defaultProps = {
  page: {
    page: ''
  }
};

export default connect(mapStateToProps)(Houses);
