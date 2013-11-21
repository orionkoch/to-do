/* todoListClass
 * A class that lets you add to-do items and
 * mark them complete. 
 */
function todoListClass()
{
	var db,
		
		schema = {
		  stores:[{
			name:'todoList',
			keyPath:'id',
			autoIncrement: true
		  }]
		};


	/* 
	 * _bindEvents()
	 * Binds click events, etc.
	 */
	function _bindEvents() 
	{
	    document.querySelector("#btnTodo").addEventListener("click", _addTodo, false);
		document.querySelector(".formTodo").addEventListener("submit", _addTodo, false);
	}
	
	
	/* 
	 * _addTodo(event)
	 * Adds a to-do list item to browser storage.
	 */
	function _addTodo(event)
	{		
		var todo = document.querySelector("#inputTodo"),
			data = {
			"todo":todo.value,
			"completed":false,
			"created":new Date().getTime()
		};
		
		//If its not blank, add the to-do item.
		if(todo.value != '') 
		{
			db.put('todoList', data)
				.fail(function(e) {
					throw e;
				})
				.done(function()
				{
					todo.value = "";	
					_renderTodoList();
				});
		}
		if ( event.preventDefault ) event.preventDefault();
	}


	/* 
	 * _completeTodo(id)
	 * Mark a to-do list item as complete or incomplete.
	 */	
	function _completeTodo(id)
	{
		var req = db.get('todoList', id);
		
		req
			.done(function(record) 
			{
				record.completed = !(record.completed); //invert the 'completed' value
				db.put('todoList', record)
					.fail(function(e) {
						throw e;
					})
					.done(function()
					{
						_renderTodoList();
					});
			})
			.fail(function(e) {
			  throw e;
			});
	}
	
	
	/* 
	 * _renderTodoList()
	 * Loop through whats in the database and create DOM nodes.
	 */	
	function _renderTodoList()
	{
		var todoList = document.querySelector(".todoList");
		
		db.values('todoList')
			.done(function (records) 
			{
				var n = records.length;
				if(n > 0) todoList.innerHTML = "";

				for (var i = 0; i < n; i++) {
					_renderTodoItem(records[i]);
				}
			})
			.fail(function (e) {
				throw e;
			});
	}


	/* 
	 * _renderTodoItem()
	 * creates a single DOM node, 
	 * assigns it a click event.
	 * adds it to the document.
	 */	
	function _renderTodoItem(todoItem)
	{
		var todos        = document.querySelector('.todoList'),
			li           = document.createElement("li"),
			checkbox     = document.createElement("input"),
			text         = document.createTextNode(todoItem.todo),
			liClassName  = "todoItem",
			completeTodo = function(key){
				return function(){
					_completeTodo(key);
				}
			}(todoItem.id);
		
		checkbox.type="checkbox";
		checkbox.value=todoItem.key;
		checkbox.checked=todoItem.completed;
		
		checkbox.addEventListener("click", completeTodo, false);
		liClassName += ((todoItem.completed==true) ? " completed" : "");
		li.className = liClassName;
		li.appendChild(checkbox);
		li.appendChild(text);
		todos.appendChild(li);
	}


	/* 
	 * _init()
	 * creates database / gets reference to one.
	 * assigns whatever click events are necessary.
	 * initial render of the to-do list.
	 */	
	this.init = function()
	{
		db = new ydn.db.Storage('todoList', schema);
		_bindEvents();
		_renderTodoList();
	}

}