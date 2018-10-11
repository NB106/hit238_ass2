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
    this.lists[this.lists.length - 1].titleNode.onclick = addListTodo(this)
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



//This function will called on adding the list on the board
function addListTodo(board) {
  return function() {
    var titleInput = document.getElementById('todo-list-title-input')

    document.getElementById('todo-list-title-submit').onclick = titleButtonClick
    board.titleFormNode.style.display = 'block'
    titleInput.focus()

    function titleButtonClick(evt) {
      evt.preventDefault()
      var title = titleInput.value.trim(),
        index = board.lists.length - 1,
        list

      board.titleFormNode.style.display = 'none'
      titleInput.value = ''
      if (!title) {
        return
      }

      list = new List(board, title, index)
      board.lists.splice(index, 0, list)
      board.listsNode.insertBefore(list.node,
        board.lists[index + 1].node)
      board.lists[index + 1].titleNode.setAttribute('list-index', index + 1)
    }
  }
}

//add list
function List(board, title, index, dummyList) {
  this.board = board
  this.dummyList = dummyList
  this.title = title
  this.index = index
  this.node = document.createElement('div')
  this.titleNode = document.createElement('div')
  this.cardsNode = document.createElement('div')
  this.node.classList.add('list')
  this.titleNode.classList.add('list-title')
  this.cardsNode.classList.add('list-cards')
  this.titleNode.setAttribute('list-index', index)
  this.titleNode.appendChild(document.createTextNode(this.title))
  this.node.appendChild(this.titleNode)

  if (!dummyList) {
    var dummyCard = new Card(this, 'Add a subtask...', 0)

    this.cards = [dummyCard]
    board.registerCard(this.cards[0], 0)

    // new card title form
    this.titleFormNode = buildCardTitleForm()

    for (var i = 0; i < this.cards.length; ++i) {
      this.cardsNode.appendChild(this.cards[i].node)
    }
    dummyCard.titleNode.onclick = addCardTodo(this)
    this.node.appendChild(this.cardsNode)
    dummyCard.node.appendChild(this.titleFormNode)
    dummyCard.node.draggable = false
    dummyCard.node.onclick = undefined
  }
}

/*
This function will build the form for list,It is called by addList
 */
function buildListTitleForm() {
  var node = document.createElement('form')
  node.innerHTML =
    '<div class="newitem-title-wrapper">' +
    '<input id="todo-list-title-input" type="text">' +
    '<input id="todo-list-title-submit" type="submit" value="Add">' +
    '</div>'
  node.style.display = 'none'
  return node
}

//this function will build the card node
function buildCardNode() {
  var node = document.createElement('div')
  node.draggable = true
  node.innerHTML =
    '<div class="card-title"></div>';
  return node
}

/*
 This function is constructor function for card
 */
function Card(list, title) {
  this.id = list.board.getNextId()
  this.list = list
  this.title = title
  this.node = buildCardNode()
  this.titleNode = this.node.getElementsByClassName('card-title')[0]

  this.node.classList.add('card')
  this.node.setAttribute('card-id', this.id)
  this.titleNode.appendChild(document.createTextNode(this.title))


  // this function will be called once you click on the text to edit
  this.node.onclick = (function(card) {
    return function() {
      cardEdit.card = card
      cardEdit.titleNode.value = card.title;
      cardEdit.show()
    }
  }(this))
}

function buildCardTitleForm() {
  var node = document.createElement('form')
  node.innerHTML =
    '<div class="newitem-title-wrapper">' +
    '<textarea class="todo-new-card-title-input" type="text"></textarea>' +
    '<input class="todo-new-card-title-submit" type="submit" value="Add">' +
    '</div>'
  node.style.display = 'none'
  return node
}

/*
 This function will add the Card in the list
 */

function addCardTodo(list) {
  return function() {
    var titleTextarea = list.titleFormNode
      .getElementsByClassName('todo-new-card-title-input')[0]
    list.titleFormNode.getElementsByClassName('todo-new-card-title-submit')[0]
      .onclick = titleSubmit
    list.titleFormNode.style.display = 'block';
    titleTextarea.focus();

    function titleSubmit(evt) {
      evt.preventDefault()
      var title = titleTextarea.value.trim(),
        card;

      list.titleFormNode.style.display = 'none';
      titleTextarea.value = '';
      if (!title) {
        return
      }

      card = new Card(list, title);
      list.board.registerCard(card, list.cards.length);
      list.cardsNode.insertBefore(card.node, list.cards[list.cards.length - 1].node);
      list.cards.push(card);
    }
  }
}