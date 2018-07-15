import React from 'react';
import '../../css/logo.css';
import '../../css/inputCommandLine.css';

class Logo extends React.Component {
  componentDidMount() {
    // graphicsStart();
    // socket.start(process.env.HOSTNAME);
    // speechRec();
  }
  render() {
    const svg1 = `${process.env.FILESERVER}index-portal-red-semi-085b4e44d49b2ffe935cc1b2b3094ce8.svg`;
    const svg2 = `${process.env.FILESERVER}index-portal-red-be5d1b8a52c13bf286560aba3e4c8c30.svg`;
    const svg3 = `${process.env.FILESERVER}index-portal-orange-semi-d2010f0f8e41e03dbf2b5c52166abe4b.svg`;
    const svg4 = `${process.env.FILESERVER}index-portal-orange-b3bddfb758b91d22f43d0e14ed8e29da.svg`;
    const svg5 = `${process.env.FILESERVER}index-portal-yellow-semi-545681fe77ff01659d472bd379a9f38b.svg`;
    const svg6 = `${process.env.FILESERVER}index-portal-yellow-ff207a58ad4f450ea9ac0e17224b39f1.svg`;
    const svg7 = `${process.env.FILESERVER}index-portal-green-semi-2d5bc571ee90e710d93f7ae7ddd06e85.svg`;
    const svg8 = `${process.env.FILESERVER}index-portal-green-6ab85a1e7343a232273868031b242806.svg`;
    const svg9 = `${process.env.FILESERVER}index-portal-blue-semi-7333f1323549be50644411b691b173dd.svg`;
    const svg10 = `${process.env.FILESERVER}index-portal-blue-92fc2c151190795bd0147c03d4fb8352.svg`;
    const svg11 = `${process.env.FILESERVER}index-portal-sides-7d999cb5d5762880eef4ede55549d5c6.svg`;
    return (
      <div className="main">
        <img className="hero-logo-circle" id="c1" src={svg1} alt="lol" />
        <img className="hero-logo-circle" id="c2" src={svg2} alt="lol" />
        <img className="hero-logo-circle" id="c3" src={svg3} alt="lol" />
        <img className="hero-logo-circle" id="c4" src={svg4} alt="lol" />
        <img className="hero-logo-circle" id="c5" src={svg5} alt="lol" />
        <img className="hero-logo-circle" id="c6" src={svg6} alt="lol" />
        <img className="hero-logo-circle" id="c7" src={svg7} alt="lol" />
        <img className="hero-logo-circle" id="c8" src={svg8} alt="lol" />
        <img className="hero-logo-circle" id="c9" src={svg9} alt="lol" />
        <img className="hero-logo-circle" id="c10" src={svg10} alt="lol" />
        <img className="hero-logo" src={svg11} alt="lol" />
        <div className="inputConteiner">
          <input className="inputCommandLine" type="text" placeholder="" />
        </div>
      </div>
    );
  }
}


export default Logo;
