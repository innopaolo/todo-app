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


    function appendToContainer(todoTask, itemId) {
        const li = document.createElement("li");
        const div = document.createElement("div")

        // Create delete and flag icons + set data-id (used for click event)
        div.classList.add("icon-buttons");
        div.innerHTML = `<img id='flag' data-id='${itemId}' src='flag-solid.svg'><img id='trash'  class='tooltip-d' data-id='${itemId}' src='trash-can-solid.svg'>`;

        // Create a separate element for the task text
        const taskText = document.createElement("span");
        taskText.textContent = todoTask;

        // Append the div with the task text and icons to the li
        li.appendChild(taskText);
        li.appendChild(div);
        
        // Give both span element and its parent li an ID 
        li.setAttribute("data-id", itemId);
        taskText.setAttribute("data-id", itemId);

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


    // Toggle light and dark theme
    const themeBtn = document.getElementById("theme-btn");
    const container = document.querySelector(".container");
    const formInput = document.querySelector(".form-input");
    const modalContent = document.querySelector(".modal-content");
    const modalImage = document.getElementById("modal-image");
    const modalTxtarea = document.getElementById("description");


    themeBtn.addEventListener("click", () => {

        // Default class "fa-moon" switches to "fa-sun" on toggle
        themeBtn.classList.toggle("fa-sun");

        if (themeBtn.classList.contains("fa-sun")) {

            themeBtn.style.backgroundColor = "#793b1b";
            themeBtn.style.color = "white";

            document.body.classList.add("changeThemeBody");
            container.classList.add("changeThemeContainer");
            formInput.classList.add("changeThemeInput");
            modalContent.classList.add("changeThemeModal");
            modalTxtarea.classList.add("changeThemeInput");

            // Change to white version of the ship's wheel button
            modalImage.src = "ship-wheel-light.png";

        } else {

            themeBtn.style.backgroundColor = "#e6d7a9";
            themeBtn.style.color = "#494a4b";

            document.body.classList.remove("changeThemeBody");
            container.classList.remove("changeThemeContainer");
            formInput.classList.remove("changeThemeInput");
            modalContent.classList.remove("changeThemeModal");
            modalTxtarea.classList.remove("changeThemeInput");

            // Change to black version of the ship's wheel button
            modalImage.src = "ship-wheel.png";
        }
    });


    // Get the modal element
    const modal = document.getElementById("myModal");

    // Get the close button element inside the modal
    const closeBtn = document.querySelector(".close");

    // Function to open the modal
    function openModal() {
        modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Event Listener for opening the modal
    ul.addEventListener("click", e => {
        
        let id = e.target.getAttribute("data-id");

        // No response if blank area clicked
        if (!id) return
        
        if (e.target.tagName === "SPAN") {
            openModal();
            return;
        }

        if (e.target.tagName === "IMG") {
            const icon = e.target.getAttribute("id");
            if (icon === "flag") {

                // Target the parent div of flag then the div's sibling which is the text
                const closestDiv = e.target.closest("div");
                const closestSpan = closestDiv.previousElementSibling;

                // Targets the task and checks if there is already a generated priority flag
                const childSpanExists = closestSpan.querySelector("span");

                if (childSpanExists) {
                    if (childSpanExists.style.color === "orangered") {
                        // If the color is already set to high priority, remove the span
                        childSpanExists.remove();
                    } else {
                        // Otherwise, change the color to high priority
                        childSpanExists.style.color = "orangered";
                    }
                } else {
                    // If the span doesn't exist, create and append it
                    const span = document.createElement("span");
                    span.style.color = "#1a82a9"; // Initial color for medium priority
                    span.style.paddingLeft = "1rem";
                    span.textContent = "!!!important";
                    closestSpan.appendChild(span);
                }

            } else {
                const closestLi = e.target.closest("li");

                // Add a strikethrough and require two taps to delete
                if (closestLi.classList.contains("readyForDeletion")) {

                    removeFromContainer(id);
                    removeFromArray(id);

                } else {

                    closestLi.classList.add("readyForDeletion")

                    // Remove strikethrough if not confirmed after 6 seconds
                    setTimeout(() => {
                        closestLi.classList.remove("readyForDeletion");
                    }, 6000);
                } 
            }
        }
      
    });

    // Event listener for closing the modal when clicking the close button
    closeBtn.addEventListener("click", closeModal);

    // Event listener for closing the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });



})();