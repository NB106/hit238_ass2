(function() {
  'use strict'

  //Board constructor object and assign some properties to its prototype
  function TaskBoard(title) {
    var nextId = 0

    this.title = title
    this.lists = []
    this.cards = {}

    this.node = document.createElement('div')
    this.titleNode = document.createElement('div')
    this.listsNode = document.createElement('div')

    this.node.id = 'board'
    this.titleNode.id = 'todo-title-board'
    this.listsNode.id = 'todo-canvas-board'

    // new list title form
    this.titleFormNode = buildListTitleForm()
    this.titleNode.appendChild(document.createTextNode(this.title))

    this.getNextId = function() {
      return '_' + (nextId++).toString()
    }
  }

  TaskBoard.prototype.render = function() {
    this.lists.push(new List(this, 'Add a new task', 0, true))
    for (var i = 0; i < this.lists.length; ++i) {
      this.listsNode.appendChild(this.lists[i].node)
    }
    this.lists[this.lists.length - 1].node.appendChild(this.titleFormNode)
    this.lists[this.lists.length - 1].titleNode.onclick = addListTrello(this)
    this.node.appendChild(this.titleNode)
    this.node.appendChild(this.listsNode)
  }


  TaskBoard.prototype.registerCard = function(card, index) {
    this.cards[card.id] = {
      card: card,
      list: card.list,
      index: index
    }
  }

  TaskBoard.prototype.reregisterSubsequent = function(list, index, shift) {
    for (var i = index; i < list.cards.length; ++i) {
      this.registerCard(list.cards[i], i + shift)
    }
  }

  TaskBoard.prototype.unregisterCard = function(card) {
    delete this.cards[card.id]
  }


  //if you click on escape then also the edit window will get closed
  window.onkeydown = function(evt) {
    if (evt.keyCode === 27) {
      cardEdit.close()
    }
  }


  //Onloading the document render the board.The code starts from here
  document.body.onload = function() {
    var title = 'My things ToDo',
      board = new TaskBoard(title)

    board.render()
    document.getElementById('container').appendChild(board.node)
    currentBoard = board
  }
}())