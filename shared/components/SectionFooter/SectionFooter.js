import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import NAV_MENU_ITEMS from 'const/nav-menu-items';
import { STORE_LINKS, SOCIAL_LINKS } from 'const/links';

import ImgMacAppStore from 'assets/images/home/media/mac-app-store.svg';
import ImgAppStore from 'assets/images/home/media/app-store.svg';
import ImgGooglePlay from 'assets/images/home/media/google-play.svg';

class SectionFooter extends Component {
  render() {
    return (
      <footer>
        <div className="guide">
          <div className="social-touch">
            <a href={SOCIAL_LINKS.TELEGRAM} className="icon-telegram" />
            <a href={SOCIAL_LINKS.FACEBOOK} className="icon-facebook" />
            <a href={SOCIAL_LINKS.TWITTER} className="icon-twitter" />
            <a href={SOCIAL_LINKS.STEEMIT} className="icon-steemit" />
            <a href={SOCIAL_LINKS.MEDIUM} className="icon-medium" />
          </div>
          <h6>Explore our product</h6>
          <div className="download-icons">
            <a href={STORE_LINKS.MAC_STORE} target="_blank">
              <img src={ImgMacAppStore} />
            </a>
            <a href={STORE_LINKS.APP_STORE} target="_blank">
              <img src={ImgAppStore} />
            </a>
            <a href={STORE_LINKS.PLAY_STORE} target="_blank">
              <img src={ImgGooglePlay} />
            </a>
          </div>
          <div className="footer-nav">
            {NAV_MENU_ITEMS.map((item) => {
              const key = item.link || item.href;
              if (item.href) {
                return (
                  <a href={item.href} key={key}>
                    {item.title}
                  </a>
                );
              }
              return (
                <Link to={item.link} key={key}>
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionFooter);
