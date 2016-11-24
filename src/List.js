import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import Card from './Card'; 

class List extends Component {
  render() {
    return this.props.target(
      <div className="list-item-container">
        {this.props.list.cards.map(({id, text}, i) =>
          <Card list={this.props.index} text={text} id={id} index={i} key={text} move={this.move.bind(this)} />
        )}
      </div>
    );
  }

  move(list, card) {
    this.props.moveCard({
      from: list,
      to: this.props.index
    }, card);
  }
}

const drop = {
  target: {
    hover(props, monitor) {
      if ( !props.list.cards.length ) {
        props.moveCard({
          from: monitor.getItem().list,
          to: props.index
        }, { from: monitor.getItem().index, to: 0 })

        monitor.getItem().index = 0;
        monitor.getItem().list = props.index;
      }
    }
  },

  collect(connect, monitor) {
    return {
      target: connect.dropTarget()
    };
  }
};

export default DropTarget('card', drop.target, drop.collect)(List);