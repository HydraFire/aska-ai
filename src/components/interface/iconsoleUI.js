import React from 'react';
import PropTypes from 'prop-types';
import '../../css/iconsoleUI.css';

class serverLog extends React.Component {
  render() {
    return (
      <div>
        <div className={this.props.logType} />
      </div>
    );
  }
}
serverLog.propTypes = {
  logType: PropTypes.string.isRequired,
};
export default serverLog;
