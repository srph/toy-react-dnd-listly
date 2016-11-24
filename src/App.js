import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react-addons-update';
import List from './List'; 

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [{
        id: 1,
        cards: [{
          id: 1,
          text: 'Hello, World'
        }, {
          id: 2,
          text: 'Foo Bar'
        }, {
          id: 3,
          text:'Baz La'
        }]
      }, {
        id: 2,
        cards: [{
          id: 4,
          text: 'Hello, Z'
        }, {
          id: 5,
          text: 'Foo Bar X'
        }]
      }]
    };

    this.moveCard = this.moveCard.bind(this);
  }

  render() {
    return (
      <div className="container-wrapper">
        <div>
          {this.state.lists.map((list, i) =>
            <List
              list={list}
              index={i}
              moveCard={this.moveCard}
              key={list.id} />
          )}
        </div>
      </div>
    );
  }

  moveCard(list, card) {
    if ( list.from === list.to ) {
      this.setState(update(this.state, {
        lists: {
          [list.from]: {
            cards: {
              $splice: [
                [card.from, 1],
                [card.to, 0, this.state.lists[list.from].cards[card.from]]
              ]
            }
          }
        }
      }));

      return;
    }

    this.setState(update(this.state, {
      lists: {
        [list.from]: {
          cards: {
            $splice: [
              [card.from, 1]
            ]
          }
        },

        [list.to]: {
          cards: {
            $splice: [
              [card.to, 0, this.state.lists[list.from].cards[card.from]]
            ]
          }
        }
      }
    }));
  }
}

export default DragDropContext(HTML5Backend)(App);