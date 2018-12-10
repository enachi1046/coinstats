import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { auth as authActions } from 'store/actions';

class Reactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  _onReactionClick(reaction) {
    if (reaction.value === 'saved') {
      if (!this.props.user) {
        this.props.showAuthModal();
      } else {
        this.props._onReactionClick(reaction);
        this.props.history.push(
          `/news?filter=${reaction.value.split(' ').join('_')}`,
        );
      }
    } else {
      this.props._onReactionClick(reaction);
      if (reaction.value.split(' ').join('_') !== 'all_news_feed') {
        this.props.history.push(
          `/news?filter=${reaction.value.split(' ').join('_')}`,
        );
      } else {
        this.props.history.push('/news');
      }
    }
  }

  render() {
    const options = [];
    this.props.reactions.map((reaction, i) => {
      options.push({
        value: reaction.toLowerCase(),
        label: reaction,
      });
    });
    return (
      <Dropdown
        options={options}
        onChange={this._onReactionClick.bind(this)}
        placeholder={
          this.props.reactionId
            ? this.props.reactions[this.props.reactionId - 1]
            : 'All Categories'
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    reactionId: state.news.reactionId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showAuthModal: () => {
      return dispatch(authActions.toggleModal(true));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Reactions));
