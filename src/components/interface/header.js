import React from 'react';
import pushNotification from '../pushNotification';
import '../../css/header.css';
// /////////////////////////////////////////////////////////////////
export default class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <strong className="logo">NERV.PRO</strong>
      </div>
    );
  }
}
