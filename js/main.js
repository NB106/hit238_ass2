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
function addListTrello(board) {
  return function() {
    var titleInput = document.getElementById('trello-list-title-input')

    document.getElementById('trello-list-title-submit').onclick = titleButtonClick
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