(() => {
    // Global variables
    let todoListArray = [];
    const form = document.querySelector(".form");
    const input = document.querySelector(".form-input");
    const ul = document.querySelector(".todoList");

    // Unique ID counter for each list item generated
    let taskId = 1 

    form.addEventListener("submit", e => {
        e.preventDefault();

        // Remove trailing whitespace if any
        let todoTask = input.value.trim();
        let itemId = taskId;

        appendToContainer(todoTask, itemId);
        appendToArray(todoTask, itemId);

        taskId++
        input.value = "";
    });

    ul.addEventListener("click", e => {
        let id = e.target.getAttribute("data-id");

        // No response if blank area clicked
        if (!id) return
        
        removeFromContainer(id);
        removeFromArray(id);
    });

    function appendToContainer(todoTask, itemId) {
        const li = document.createElement("li");
        li.textContent = todoTask;
        li.setAttribute("data-id", itemId);
        ul.appendChild(li);
    }

    function appendToArray(todoTask, itemId) {
        todoListArray.push({todoTask, itemId});
        console.log(todoListArray);
    }

    function removeFromContainer(id) {
        const li = document.querySelector(`[data-id="${id}"]`)
        ul.removeChild(li);
    }

    function removeFromArray(id) {
        const taskIndex = todoListArray.findIndex(task => task.itemId == id);
        todoListArray.splice(taskIndex, 1);
        console.log(todoListArray);
    }
})();