import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import classnames from 'classnames';

class Card extends Component {
  render() {
    if ( this.props.dragging ) {
      console.log('Dragging');
      return <div className='list-item-placeholder' />;
    }

    // if ( this.props.dragging && !this.props.over ) {
    //   return null;
    // }

    return this.props.target(
      this.props.source(
        <div className='list-item-card'>
          {this.props.text}
        </div>
      )
    );
  }
}

const drag = {
  source: {
    beginDrag({list, index, id}) {
      return {
        list,
        index,
        id
      };
    },

    isDragging(props, monitor) {
      return props.id === monitor.getItem().id
    }
  },

  collect: function (connect, monitor) {
    return {
      source: connect.dragSource(),
      dragging: monitor.isDragging()
    };
  }
};

const drop = {
  target: {
    hover(props, monitor, component) {
      const dragIndex = monitor.getItem().index;
      const dragList = monitor.getItem().list;
      const hoverIndex = props.index;
      const hoverList = props.list;

      if ( dragList === hoverList ) {
        if ( dragIndex === hoverIndex ) {
          return;
        }

        const {left, right} = findDOMNode(component).getBoundingClientRect();
        const middleX = (right - left) / 2;
        const hoverX = monitor.getClientOffset().x - left;

        // Left
        if ( dragIndex < hoverIndex && hoverX < middleX ) {
          return;
        }

        // Right
        if ( dragIndex > hoverIndex && hoverX > middleX ) {
          return;
        }
      }

      props.move(dragList, { from: dragIndex, to: hoverIndex });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
      monitor.getItem().list = hoverList;
    }
  },

  collect: function (connect, monitor) {
    return {
      target: connect.dropTarget(),
      over: monitor.isOver()
    };
  }
};

export default DropTarget('card', drop.target, drop.collect)(
  DragSource('card', drag.source, drag.collect)(Card)
);