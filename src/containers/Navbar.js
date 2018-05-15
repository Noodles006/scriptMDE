import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toolbar from './Toolbar';

class Navbar extends Component {
  downloadAsPDF() {
    // async () => {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();
    //   await page.goto('./Features.html', {waitUntil: 'networkidle2'});
    //   await page.pdf({path: 'hn.pdf', format: 'A4'});

    //   await browser.close();
    // }
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">ScriptMDE</span>
        <button
        	className="navbar-toggler"
        	type="button"
        	data-toggle="collapse"
        	data-target="#navbarSupportedContent"
        	aria-controls="navbarSupportedContent"
        	aria-expanded="false"
        	aria-label="Toggle navigation"
        >
			    <span className="navbar-toggler-icon"></span>
			  </button>
			  <div className="collapse navbar-collapse" id="navbarSupportedContent">
        	<Toolbar />
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Menus
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a onClick={this.downloadAsPDF} className="dropdown-item" href="#">Download PDF</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    markdown: state.markdown,
  }
};

export default connect(mapStateToProps)(Navbar);
